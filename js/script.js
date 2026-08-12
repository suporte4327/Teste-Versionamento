// Espera o conteúdo HTML da página ser totalmente carregado antes de rodar o script
document.addEventListener("DOMContentLoaded", function () {

    // ===================== PARTE 1: CONTADOR =====================

    // Variável que guarda o valor atual do contador, começando em 0
    let contador = 0;

    // Busca no HTML o elemento <span> onde o número do contador é exibido
    const elementoValor = document.getElementById("valorContador");

    // Busca no HTML o botão de aumentar (+)
    const botaoAumentar = document.getElementById("btnAumentar");

    // Busca no HTML o botão de diminuir (-)
    const botaoDiminuir = document.getElementById("btnDiminuir");

    // Busca no HTML o botão de zerar
    const botaoZerar = document.getElementById("btnZerar");

    // Função que atualiza o texto na tela com o valor atual do contador
    function atualizarTela() {
        // Troca o conteúdo de texto do <span> pelo valor da variável "contador"
        elementoValor.textContent = contador;
    }

    // Quando o botão de aumentar for clicado, executa a função dentro dos parênteses
    botaoAumentar.addEventListener("click", function () {
        contador = contador + 1; // soma 1 ao valor atual do contador
        atualizarTela();         // atualiza o número mostrado na tela
    });

    // Quando o botão de diminuir for clicado, executa a função dentro dos parênteses
    botaoDiminuir.addEventListener("click", function () {
        contador = contador - 1; // subtrai 1 do valor atual do contador
        atualizarTela();         // atualiza o número mostrado na tela
    });

    // Quando o botão de zerar for clicado, executa a função dentro dos parênteses
    botaoZerar.addEventListener("click", function () {
        contador = 0;     // volta o contador para o valor inicial (0)
        atualizarTela();  // atualiza o número mostrado na tela
    });


    // ===================== PARTE 2: TROCAR COR DE FUNDO =====================

    // Busca no HTML todos os elementos que têm a classe "botao-cor"
    // (o resultado é uma lista de botões, não apenas um)
    const botoesCor = document.querySelectorAll(".botao-cor");

    // "forEach" percorre cada botão da lista, um por um
    botoesCor.forEach(function (botao) {

        // Para cada botão, adiciona um "ouvinte" de evento de clique
        botao.addEventListener("click", function () {

            // Lê o valor guardado no atributo "data-cor" do botão que foi clicado
            const corEscolhida = botao.getAttribute("data-cor");

            // Aplica a cor escolhida como cor de fundo do <body> da página
            document.body.style.backgroundColor = corEscolhida;
        });
    });

});
