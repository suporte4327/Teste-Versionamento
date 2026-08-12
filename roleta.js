// Espera o conteúdo HTML da página ser totalmente carregado antes de rodar o script
document.addEventListener("DOMContentLoaded", function () {

    // ===================== ELEMENTOS DA PÁGINA =====================

    const formulario = document.getElementById("formOpcao");
    const campoOpcao = document.getElementById("inputOpcao");
    const lista = document.getElementById("listaOpcoes");
    const mensagemVazia = document.getElementById("mensagemVazia");
    const botaoGirar = document.getElementById("btnGirar");
    const botaoLimpar = document.getElementById("btnLimpar");
    const canvas = document.getElementById("canvasRoleta");
    const contexto = canvas.getContext("2d");
    const mensagemResultado = document.getElementById("mensagemResultado");
    const textoVencedor = document.getElementById("textoVencedor");
    const modalResultado = new bootstrap.Modal(document.getElementById("modalResultado"));

    // Paleta de cores usada nas fatias da roleta, repetida caso existam mais opções que cores
    const paletaCores = [
        "#ef476f", "#ff8500", "#ffd60a", "#06d6a0", "#118ab2",
        "#7209b7", "#f72585", "#3a86ff", "#2ec4b6", "#e63946"
    ];

    // Lista de opções cadastradas pelo usuário
    let opcoes = [];

    // Controla se a roleta está girando, para bloquear ações durante a animação
    let girando = false;

    // Guarda a rotação total já aplicada ao canvas (sempre soma, nunca reinicia em 0)
    let rotacaoTotal = 0;

    // Guarda qual opção foi sorteada no giro atual, para ser lida quando a animação terminar
    let indiceVencedorAtual = -1;

    // Tamanho "lógico" do canvas (em pixels de CSS); o tamanho real do bitmap
    // é maior em telas de alta densidade (retina), evitando imagem borrada
    let tamanhoCanvas = canvas.width;


    // ===================== RESOLUÇÃO DO CANVAS =====================

    // Ajusta a resolução interna do canvas à densidade de pixels da tela,
    // desenhando em alta definição mesmo quando o CSS exibe o canvas ampliado
    function ajustarResolucaoCanvas() {
        const dpr = window.devicePixelRatio || 1;
        tamanhoCanvas = canvas.clientWidth || canvas.width;

        canvas.width = tamanhoCanvas * dpr;
        canvas.height = tamanhoCanvas * dpr;

        // Faz com que todos os comandos de desenho continuem usando
        // as coordenadas "lógicas" (em pixels de CSS), independente do dpr
        contexto.setTransform(dpr, 0, 0, dpr, 0, 0);
    }


    // ===================== DESENHO DA ROLETA =====================

    // Redesenha a roleta no canvas de acordo com as opções cadastradas
    function desenharRoleta() {
        const tamanho = tamanhoCanvas;
        const raio = tamanho / 2;

        contexto.clearRect(0, 0, tamanho, tamanho);

        // Enquanto não houver opções, mostra um círculo neutro com uma mensagem
        if (opcoes.length === 0) {
            contexto.beginPath();
            contexto.arc(raio, raio, raio - 4, 0, Math.PI * 2);
            contexto.fillStyle = "#f1f3f5";
            contexto.fill();

            contexto.fillStyle = "#adb5bd";
            contexto.font = "600 16px 'Segoe UI', sans-serif";
            contexto.textAlign = "center";
            contexto.fillText("Adicione opções", raio, raio);
            return;
        }

        const anguloFatia = (Math.PI * 2) / opcoes.length;

        // Tamanho da fonte proporcional ao raio, para ficar bem legível
        // em qualquer quantidade de opções (com um teto para não exagerar)
        const tamanhoFonte = Math.round(Math.min(raio * 0.16, 30));

        opcoes.forEach(function (opcao, indice) {
            const anguloInicial = indice * anguloFatia;
            const anguloFinal = anguloInicial + anguloFatia;

            // Desenha a fatia (um "pedaço de pizza") correspondente à opção
            contexto.beginPath();
            contexto.moveTo(raio, raio);
            contexto.arc(raio, raio, raio - 4, anguloInicial, anguloFinal);
            contexto.closePath();
            contexto.fillStyle = paletaCores[indice % paletaCores.length];
            contexto.fill();

            // Linha divisória branca entre fatias, para um acabamento mais nítido
            contexto.lineWidth = 3;
            contexto.strokeStyle = "rgba(255, 255, 255, 0.9)";
            contexto.stroke();

            // Escreve o nome da opção centralizado na fatia, próximo à borda externa
            // (deixa o texto maior e mais fácil de ler que centralizado no meio do raio)
            contexto.save();
            contexto.translate(raio, raio);
            contexto.rotate(anguloInicial + anguloFatia / 2);
            contexto.textAlign = "center";
            contexto.textBaseline = "middle";
            contexto.font = "700 " + tamanhoFonte + "px 'Segoe UI', sans-serif";
            contexto.fillStyle = "#ffffff";
            contexto.lineWidth = 4;
            contexto.strokeStyle = "rgba(0, 0, 0, 0.45)";
            contexto.strokeText(recortarTexto(opcao), raio * 0.62, 0);
            contexto.fillText(recortarTexto(opcao), raio * 0.62, 0);
            contexto.restore();
        });

        // Anel branco decorativo entre as fatias e a borda externa do canvas
        contexto.beginPath();
        contexto.arc(raio, raio, raio - 4, 0, Math.PI * 2);
        contexto.lineWidth = 4;
        contexto.strokeStyle = "#ffffff";
        contexto.stroke();
    }

    // Evita que textos muito longos "vazem" para fora da fatia
    function recortarTexto(texto) {
        return texto.length > 12 ? texto.slice(0, 11) + "…" : texto;
    }


    // ===================== LISTA DE OPÇÕES =====================

    // Atualiza a lista visual de opções e o estado dos botões
    function atualizarInterface() {
        lista.innerHTML = "";

        opcoes.forEach(function (opcao, indice) {
            const item = document.createElement("li");
            item.className = "list-group-item";
            item.innerHTML =
                '<span><span class="cor-indicador" style="background-color: ' +
                paletaCores[indice % paletaCores.length] + ';"></span>' + opcao + "</span>" +
                '<button type="button" class="btn btn-sm btn-outline-danger" data-indice="' + indice + '" title="Remover opção">' +
                '<i class="bi bi-x-lg"></i></button>';
            lista.appendChild(item);
        });

        mensagemVazia.classList.toggle("d-none", opcoes.length > 0);
        botaoGirar.disabled = opcoes.length < 2 || girando;

        desenharRoleta();
    }

    // Adiciona uma nova opção quando o formulário é enviado
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const valor = campoOpcao.value.trim();
        if (!valor) return;

        opcoes.push(valor);
        campoOpcao.value = "";
        campoOpcao.focus();
        atualizarInterface();
    });

    // Remove uma opção quando o botão de "x" correspondente é clicado
    lista.addEventListener("click", function (evento) {
        if (girando) return;

        const botaoRemover = evento.target.closest("button[data-indice]");
        if (!botaoRemover) return;

        const indice = Number(botaoRemover.getAttribute("data-indice"));
        opcoes.splice(indice, 1);
        atualizarInterface();
    });

    // Remove todas as opções cadastradas
    botaoLimpar.addEventListener("click", function () {
        if (girando) return;

        opcoes = [];
        mensagemResultado.textContent = "";
        atualizarInterface();
    });


    // ===================== GIRO DA ROLETA =====================

    botaoGirar.addEventListener("click", function () {
        if (girando || opcoes.length < 2) return;

        girando = true;
        botaoGirar.disabled = true;
        mensagemResultado.textContent = "";

        // Sorteia qual opção será a vencedora deste giro
        indiceVencedorAtual = Math.floor(Math.random() * opcoes.length);

        const anguloFatia = 360 / opcoes.length;
        const centroFatia = indiceVencedorAtual * anguloFatia + anguloFatia / 2;

        // Pequena variação para não parar sempre exatamente no centro da fatia
        const variacao = (Math.random() - 0.5) * (anguloFatia * 0.6);

        // O ponteiro fica fixo no topo da roleta (posição de -90°).
        // Este é o ângulo de rotação (0-360°) necessário para o centro da fatia
        // sorteada terminar exatamente sob o ponteiro.
        const anguloAlvo = ((-90 - centroFatia - variacao) % 360 + 360) % 360;

        // Ângulo atual do canvas, também normalizado entre 0 e 360°
        const anguloAtual = ((rotacaoTotal % 360) + 360) % 360;

        // Quantos graus faltam, girando sempre para frente, até atingir o ângulo alvo
        const distanciaAteAlvo = ((anguloAlvo - anguloAtual) % 360 + 360) % 360;

        // Soma voltas completas extras só para o giro parecer mais empolgante
        const voltasExtras = 5 * 360;

        rotacaoTotal += voltasExtras + distanciaAteAlvo;
        canvas.style.transform = "rotate(" + rotacaoTotal + "deg)";
    });

    // Quando a animação de giro termina, revela o resultado sorteado
    canvas.addEventListener("transitionend", function (evento) {
        if (evento.propertyName !== "transform" || !girando) return;

        girando = false;
        botaoGirar.disabled = opcoes.length < 2;

        const vencedor = opcoes[indiceVencedorAtual];
        mensagemResultado.textContent = "Resultado: " + vencedor;
        textoVencedor.textContent = vencedor;
        modalResultado.show();
    });


    // ===================== ESTADO INICIAL =====================

    ajustarResolucaoCanvas();
    atualizarInterface();

    // Reajusta a resolução se o tamanho exibido do canvas mudar
    // (por exemplo, ao redimensionar a janela ou girar o celular)
    window.addEventListener("resize", function () {
        ajustarResolucaoCanvas();
        desenharRoleta();
    });

});
