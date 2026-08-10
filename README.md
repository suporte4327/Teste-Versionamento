# Teste Versionamento
Primeiro repositório de treino de git

Repositório criado visando em treino de git.

Comandos importantes:

git init
- iniciar novo projeto com git

git add <nome-arquivo>/.
- add os arquivos que estão prontos para serem commitados

git commit -m "mensagem commit"
- commit os arquivos no historico

git log
- mostra os ultimos commit, log de alterações

git status
- como está o estado da nossa ramificações

git diff
- que mostra o que foi alterado
- o que tem de alteração na ramificação

git merge
- merge de ramificações, mescla ramificações

git branch
- mostra a branch atual

git checkout <nome-branch>
- muda pra essa branch

git checkout -b <nome-da-branch>
- criar uma nova branch a partir da branch atual que estamos

git remote add <nome>(por padrão é origin) <url>
- add um novo repositorio remoto

git push <nome>(por padrão é origin) <nome-da-branch>
- manda nossas alterações locais para o repositório remoto, pra cada branch

git pull <nome>(por padrão é origin) <nome-da-branch> geralmente a default(main/master)
- pega as alterações do repositório remoto, e joga pra nossa maquina

git fetch
- atualiza o novo historico local de acordo com o historico salvo la no repositório, exemplo novas branchs adicionadas são adicionadas no local
- sincronização do local com o remoto
