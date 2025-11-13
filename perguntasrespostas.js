const cards = document.querySelectorAll('.card');
const respostasErradas = [
  "Gato! 🐱", "Cachorro! 🐶", "Papagaio! 🦜", "Rato! 🐭", "Peixe! 🐠", 
  "Aranha! 🕷️", "Caracol! 🐌", "Cavalo! 🐴", "Urso! 🐻"
];

// Áudios únicos
const acertoAudio = new Audio('acerto.mp3');
const erroAudio = new Audio('erro.mp3');
// áudio de parabéns quando terminar todas as perguntas (usar .mp3)
const parabensAudio = new Audio('parabens.mp3');
let gameCompleted = false;

cards.forEach(card => {
  card.addEventListener('click', () => {
    // Se já mostrou a pergunta ou respondeu, não faz nada
    if(card.classList.contains('respondido') || card.classList.contains('mostrando')) return;

    // Mostra a pergunta
    card.textContent = card.getAttribute('data-pergunta');
    card.classList.add('mostrando');

    // Depois de 7 segundos, mostra opções
    setTimeout(() => {
      card.textContent = '';
      const respostaCorreta = card.getAttribute('data-resposta');

      // Escolhe resposta errada
      let err;
      do {
        err = respostasErradas[Math.floor(Math.random() * respostasErradas.length)];
      } while(err === respostaCorreta);

      // Mistura as opções
      const opcoes = [respostaCorreta, err].sort(() => Math.random() - 0.5);

      opcoes.forEach(opcao => {
        const btn = document.createElement('button');
        btn.textContent = opcao;
        btn.className = 'opcao';

        btn.addEventListener('click', () => {
          if(card.classList.contains('respondido')) return; // já respondeu

          // Marca como respondido e desativa todos os botões imediatamente
          card.classList.add('respondido');
          card.querySelectorAll('button').forEach(b => b.disabled = true);

          // Toca áudio apenas uma vez por cartão usando dataset
          if(!card.dataset.audioTocado) {
            if(opcao === respostaCorreta) {
              acertoAudio.currentTime = 0;
              acertoAudio.play();
            } else {
              erroAudio.currentTime = 0;
              erroAudio.play();
            }
            card.dataset.audioTocado = 'true';
          }

          // Atualiza cor do cartão conforme resposta
          card.style.backgroundColor = opcao === respostaCorreta ? '#4CAF50' : '#F44336';

          // Verifica se todas as perguntas já foram respondidas
          checkForCompletion();
        });

        card.appendChild(btn);
      });

    }, 7000);
  });
});

// Função para verificar se todas as cartas/perguntas foram respondidas e tocar parabéns
function checkForCompletion() {
  const total = document.querySelectorAll('.card').length;
  const responded = document.querySelectorAll('.card.respondido').length;
  if (!gameCompleted && responded === total) {
    gameCompleted = true;
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
