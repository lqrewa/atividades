const container = document.getElementById('gameContainer');

// audios de acerto e erro
const acertoAudio = new Audio('acerto.mp3');
const erroAudio = new Audio('erro.mp3');

// áudio de parabéns quando o jogo terminar
const parabensAudio = new Audio('parabens.mp3');
let gameCompleted = false;

// Letras ou símbolos para os 8 pares (16 cartas) - agora com animais
const symbols = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
let cards = [...symbols, ...symbols]; // duplicar para pares

// Embaralhar cartas
cards.sort(() => 0.5 - Math.random());

// Variáveis de controle
let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Criar cartas no HTML
cards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.innerText = ''; // inicialmente vazio
    card.addEventListener('click', flipCard);
    container.appendChild(card);
});

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // não clicar na mesma carta

    this.classList.add('mostrando');
    this.innerText = this.dataset.symbol;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        // prevenir sobreposição de áudio
        erroAudio.pause(); erroAudio.currentTime = 0;
        acertoAudio.pause(); acertoAudio.currentTime = 0;
        acertoAudio.play();

        firstCard.classList.add('respondido');
        secondCard.classList.add('respondido');

        // remover listener para evitar que a carta seja clicada novamente
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        // checa se todas as cartas já foram respondidas
        checkForCompletion();

        resetBoard();
    } else {
        // tocar som de erro (apenas uma vez)
        acertoAudio.pause(); acertoAudio.currentTime = 0;
        erroAudio.pause(); erroAudio.currentTime = 0;
        erroAudio.play();

        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('mostrando');
            secondCard.classList.remove('mostrando');
            firstCard.innerText = '';
            secondCard.innerText = '';
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Função para verificar se o jogo terminou e tocar parabéns
function checkForCompletion() {
    const total = container.querySelectorAll('.card').length;
    const responded = container.querySelectorAll('.card.respondido').length;
    if (!gameCompleted && responded === total) {
        gameCompleted = true;
        // aguarda 3 segundos, toca por 6 segundos
        setTimeout(() => {
            // garante que nenhum outro som esteja tocando
            acertoAudio.pause(); acertoAudio.currentTime = 0;
            erroAudio.pause(); erroAudio.currentTime = 0;

            parabensAudio.currentTime = 0;
            parabensAudio.play();
            setTimeout(() => {
                parabensAudio.pause();
                parabensAudio.currentTime = 0;
            }, 6000);
        }, 3000);
    }
}
