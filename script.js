let cartas = [];
let cartasViradas = [];
let nivelDificuldade = '';
let erros = 0;
let tempo = 0;
let temporizadorInterval;
let jogadorAtual = 1;
let pontuacaoJogador1 = 0;
let pontuacaoJogador2 = 0;
let modoDeJogo = 'solo';
let jogadas = [];
let paresRestantes = 0;

const cartasIcones = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍓', '🍍', '🍑', '🥥', '🥝'];

function selecionarDificuldade(modo) {
  modoDeJogo = modo;
  document.getElementById('menu-principal').style.display = 'none';
  document.getElementById('menu-dificuldade').style.display = 'block';
}

function iniciarJogo(dificuldade) {
  nivelDificuldade = dificuldade;
  document.getElementById('menu-dificuldade').style.display = 'none';
  document.getElementById('jogo').style.display = 'block';
  
  erros = 0;
  tempo = 0;
  pontuacaoJogador1 = 0;
  pontuacaoJogador2 = 0;
  jogadorAtual = 1;
  cartasViradas = [];

  let gridSize = dificuldade === 'facil' ? 4 : dificuldade === 'medio' ? 6 : 8;
  paresRestantes = (gridSize * gridSize) / 2;
  
  document.getElementById('temporizador').textContent = 'Tempo: 0s';
  document.getElementById('erros').textContent = 'Erros: 0';
  document.getElementById('pontuacao-jogador1').textContent = 'Jogador 1: 0 pontos';
  document.getElementById('pontuacao-jogador2').style.display = modoDeJogo === 'dupla' ? 'block' : 'none';
  document.getElementById('pontuacao-jogador2').textContent = 'Jogador 2: 0 pontos';
  document.getElementById('modo').textContent = modoDeJogo === 'dupla' ? 'Modo Dupla' : 'Modo Solo';

  gerarCartas(gridSize);
  iniciarTemporizador();
}

function gerarCartas(tamanho) {
  cartas = [];
  const iconesDuplicados = [...cartasIcones.slice(0, (tamanho * tamanho) / 2), ...cartasIcones.slice(0, (tamanho * tamanho) / 2)];
  iconesDuplicados.sort(() => Math.random() - 0.5);

  const tabuleiro = document.getElementById('tabuleiro');
  tabuleiro.innerHTML = '';
  tabuleiro.style.gridTemplateColumns = `repeat(${tamanho}, 80px)`;

  iconesDuplicados.forEach((icone, index) => {
    const carta = document.createElement('div');
    carta.classList.add('card');
    carta.dataset.icone = icone;
    carta.dataset.index = index;
    carta.addEventListener('click', () => virarCarta(carta));
    tabuleiro.appendChild(carta);
    cartas.push(carta);
  });
}

function virarCarta(carta) {
  if (cartasViradas.length < 2 && !carta.classList.contains('virada')) {
    carta.classList.add('virada');
    carta.textContent = carta.dataset.icone;
    cartasViradas.push(carta);

    if (cartasViradas.length === 2) {
      setTimeout(verificarPar, 800);
    }
  }
}

function verificarPar() {
  const [carta1, carta2] = cartasViradas;

  if (carta1.dataset.icone === carta2.dataset.icone) {
    paresRestantes--;
    atualizarPontuacao();
    if (paresRestantes === 0) {
      finalizarJogo();
    }
  } else {
    carta1.classList.remove('virada');
    carta1.textContent = '';
    carta2.classList.remove('virada');
    carta2.textContent = '';
    erros++;
    document.getElementById('erros').textContent = `Erros: ${erros}`;
    if (modoDeJogo === 'dupla') {
      jogadorAtual = jogadorAtual === 1 ? 2 : 1;
    }
  }
  cartasViradas = [];
}

function atualizarPontuacao() {
  if (modoDeJogo === 'dupla') {
    if (jogadorAtual === 1) {
      pontuacaoJogador1++;
      document.getElementById('pontuacao-jogador1').textContent = `Jogador 1: ${pontuacaoJogador1} pontos`;
    } else {
      pontuacaoJogador2++;
      document.getElementById('pontuacao-jogador2').textContent = `Jogador 2: ${pontuacaoJogador2} pontos`;
    }
  }
}

function iniciarTemporizador() {
  temporizadorInterval = setInterval(() => {
    tempo++;
    document.getElementById('temporizador').textContent = `Tempo: ${tempo}s`;
  }, 1000);
}

function finalizarJogo() {
  clearInterval(temporizadorInterval);
  const dataAtual = new Date().toLocaleString();
  const resultado = {
    data: dataAtual,
    tempo: `${tempo}s`,
    dificuldade: nivelDificuldade,
    erros: erros,
    pontuacaoJogador1: pontuacaoJogador1,
    pontuacaoJogador2: modoDeJogo === 'dupla' ? pontuacaoJogador2 : 'N/A'
  };
  jogadas.push(resultado);
  salvarHistorico();
  alert('Fim de jogo!');
  voltarMenu();
}

function salvarHistorico() {
  localStorage.setItem('historico', JSON.stringify(jogadas));
}

function mostrarHistorico() {
  document.getElementById('menu-principal').style.display = 'none';
  document.getElementById('historico').style.display = 'block';

  const tabelaHistorico = document.getElementById('tabela-historico');
  tabelaHistorico.innerHTML = '';

  const historico = JSON.parse(localStorage.getItem('historico')) || [];
  historico.forEach((jogo) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${jogo.data}</td>
      <td>${jogo.tempo}</td>
      <td>${jogo.dificuldade}</td>
      <td>${jogo.erros}</td>
      <td>${jogo.pontuacaoJogador1}</td>
      <td>${jogo.pontuacaoJogador2}</td>
    `;
    tabelaHistorico.appendChild(linha);
  });
}

function voltarMenu() {
  document.getElementById('menu-principal').style.display = 'block';
  document.getElementById('menu-dificuldade').style.display = 'none';
  document.getElementById('jogo').style.display = 'none';
  document.getElementById('historico').style.display = 'none';
}
