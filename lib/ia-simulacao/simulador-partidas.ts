// Tipos
export interface Time {
  id: string
  nome: string
  forca: number
  moral: number
  jogoCasa: boolean
  tatica?: string
  estiloJogo?: string
  condicaoFisica?: number
  rivalidade?: string[]
}

export interface Jogador {
  id: string
  nome: string
  posicao: string
  forca: number
  moral: number
  condicao: number
  time_id: string
  titular?: boolean
  habilidades?: {
    finalizacao?: number
    passe?: number
    marcacao?: number
    velocidade?: number
    resistencia?: number
    lideranca?: number
  }
  caracteristicas?: string[]
  cartoes?: {
    amarelos: number
    vermelhos: number
  }
  estatisticas?: {
    jogos: number
    gols: number
    assistencias: number
    minutosJogados: number
  }
}

export interface EventoPartida {
  minuto: number
  tipo:
    | "gol"
    | "cartao_amarelo"
    | "cartao_vermelho"
    | "substituicao"
    | "escanteio"
    | "falta"
    | "defesa"
    | "narracao"
    | "lesao"
    | "impedimento"
    | "var"
    | "penalti"
  time_id: string
  jogador_id?: string
  jogador_assistencia_id?: string
  descricao: string
  detalhes?: any
}

export interface ResultadoPartida {
  golsTimeCasa: number
  golsTimeVisitante: number
  eventos: EventoPartida[]
  posseBola: { casa: number; visitante: number }
  chutes: { casa: number; visitante: number }
  chutesNoGol: { casa: number; visitante: number }
  escanteios: { casa: number; visitante: number }
  faltas: { casa: number; visitante: number }
  cartoesAmarelos: { casa: number; visitante: number }
  cartoesVermelhos: { casa: number; visitante: number }
  impedimentos: { casa: number; visitante: number }
  passes: { casa: number; visitante: number }
  passesCompletos: { casa: number; visitante: number }
  jogadoresDestaques: { casa: Jogador | null; visitante: Jogador | null }
}

export interface CondicoesPartida {
  clima: "ensolarado" | "nublado" | "chuvoso" | "tempestade" | "neve"
  temperatura: number
  estadio: {
    qualidadeGramado: number
    capacidade: number
    publico: number
  }
  importancia: "amistoso" | "campeonato" | "copa" | "final" | "classico"
  rivalidade: number
}

// Táticas disponíveis e seus modificadores
export const TATICAS = {
  "4-4-2": { ataque: 0, meioCampo: 0, defesa: 0, descricao: "Formação equilibrada" },
  "4-3-3": { ataque: 1, meioCampo: 0, defesa: -0.5, descricao: "Formação ofensiva" },
  "5-3-2": { ataque: -0.5, meioCampo: 0, defesa: 1, descricao: "Formação defensiva" },
  "3-5-2": { ataque: 0.5, meioCampo: 1, defesa: -0.5, descricao: "Formação com foco no meio-campo" },
  "4-5-1": { ataque: -1, meioCampo: 1, defesa: 0.5, descricao: "Formação defensiva com meio-campo reforçado" },
  "4-2-3-1": { ataque: 0.5, meioCampo: 0.5, defesa: 0, descricao: "Formação moderna e versátil" },
  "3-4-3": { ataque: 1.5, meioCampo: -0.5, defesa: -1, descricao: "Formação ultra-ofensiva" },
}

// Estilos de jogo e seus modificadores
export const ESTILOS_JOGO = {
  posse: { posseBola: 1.5, precisaoPasses: 1.2, chanceGol: 0.9, descricao: "Foco em manter a posse de bola" },
  "contra-ataque": { posseBola: 0.7, precisaoPasses: 0.9, chanceGol: 1.3, descricao: "Foco em contra-ataques rápidos" },
  "pressao-alta": {
    posseBola: 1.2,
    precisaoPasses: 0.8,
    chanceGol: 1.1,
    descricao: "Pressão alta para recuperar a bola",
  },
  defensivo: { posseBola: 0.6, precisaoPasses: 1.0, chanceGol: 0.7, descricao: "Foco na defesa e segurança" },
  direto: { posseBola: 0.8, precisaoPasses: 0.7, chanceGol: 1.2, descricao: "Jogo direto com bolas longas" },
}

// Condições climáticas e seus efeitos
export const CLIMAS = {
  ensolarado: {
    passePrecisao: 1.0,
    finalizacaoPrecisao: 1.0,
    velocidadeJogo: 1.0,
    fadiga: 1.2,
    descricao: "Condições ideais",
  },
  nublado: {
    passePrecisao: 1.0,
    finalizacaoPrecisao: 1.0,
    velocidadeJogo: 1.0,
    fadiga: 1.0,
    descricao: "Condições normais",
  },
  chuvoso: {
    passePrecisao: 0.8,
    finalizacaoPrecisao: 0.9,
    velocidadeJogo: 0.9,
    fadiga: 1.1,
    descricao: "Campo molhado, passes mais difíceis",
  },
  tempestade: {
    passePrecisao: 0.7,
    finalizacaoPrecisao: 0.7,
    velocidadeJogo: 0.8,
    fadiga: 1.3,
    descricao: "Condições adversas, jogo imprevisível",
  },
  neve: {
    passePrecisao: 0.6,
    finalizacaoPrecisao: 0.8,
    velocidadeJogo: 0.7,
    fadiga: 1.4,
    descricao: "Campo pesado, jogo lento",
  },
}

// Frases para narração contextual
const frasesNarracao = {
  inicioJogo: [
    "A partida começa!",
    "E a bola rola no gramado!",
    "Começa o jogo!",
    "A partida está em andamento!",
    "O árbitro apita e a bola começa a rolar!",
  ],
  ataque: [
    "O time pressiona no ataque!",
    "Boa jogada ofensiva!",
    "Avançando pelo campo!",
    "Construindo uma jogada perigosa!",
    "Atacando com intensidade!",
    "Boa troca de passes no ataque!",
    "Movimentação interessante no setor ofensivo!",
  ],
  defesa: [
    "Grande defesa!",
    "A defesa está sólida!",
    "Interceptação importante!",
    "Defesa bem posicionada!",
    "Cortou o perigo!",
    "Excelente trabalho defensivo!",
    "Defesa impecável neste momento!",
  ],
  gol: [
    "GOOOOOL!",
    "É GOL! Que belo gol!",
    "GOLAÇO! Impressionante!",
    "GOL! A torcida vai à loucura!",
    "É GOL! Que momento para o time!",
    "GOOOOOL! Incrível finalização!",
    "É GOL! Comemoração efusiva dos jogadores!",
  ],
  golGrande: [
    "GOLAAAAÇO! QUE PINTURA!",
    "GOOOOOL ESPETACULAR! DE OUTRO MUNDO!",
    "QUE GOLAÇO INACREDITÁVEL! UM GOL PARA A HISTÓRIA!",
    "OBRA DE ARTE! QUE GOL SENSACIONAL!",
    "GOLAÇO DE PLACA! ISSO É FUTEBOL DE OUTRO PLANETA!",
  ],
  quaseGol: [
    "Quase gol! Por pouco!",
    "Passou perto! Que chance desperdiçada!",
    "Incrível! A bola passou raspando a trave!",
    "Que chance perdida! Estava quase lá!",
    "Por centímetros! Quase um golaço!",
    "Bateu na trave! Que azar!",
    "O goleiro fez um milagre! Incrível defesa!",
  ],
  falta: [
    "Falta marcada!",
    "O árbitro apita a falta!",
    "Falta dura no meio de campo!",
    "Jogada perigosa, falta marcada!",
    "Falta clara, o juiz não hesitou!",
    "Entrada forte, falta para o time!",
    "O árbitro marca falta após o contato!",
  ],
  cartaoAmarelo: [
    "Cartão amarelo!",
    "O juiz mostra o cartão amarelo!",
    "Advertência com cartão amarelo!",
    "Falta dura, cartão amarelo para o jogador!",
    "Amarelo merecido após essa jogada!",
    "Cartão amarelo por reclamação!",
    "O árbitro não perdoa e mostra o amarelo!",
  ],
  cartaoVermelho: [
    "Cartão vermelho! Expulso!",
    "Expulsão! Cartão vermelho direto!",
    "O juiz não perdoa! Cartão vermelho!",
    "Falta gravíssima, vermelho direto!",
    "Expulso do jogo após receber o cartão vermelho!",
    "Entrada criminosa! Vermelho direto e merecido!",
    "Segundo amarelo e consequente cartão vermelho! Expulso!",
  ],
  escanteio: [
    "Escanteio para o time!",
    "A bola sai pela linha de fundo, escanteio!",
    "Mais um escanteio nesta partida!",
    "Chance de gol com este escanteio!",
    "Bola afastada para escanteio!",
    "Defesa afasta para escanteio!",
    "Oportunidade de cruzamento com este escanteio!",
  ],
  substituicao: [
    "Substituição no time!",
    "O técnico faz uma alteração!",
    "Mudança tática com esta substituição!",
    "Jogador deixa o campo para a entrada de sangue novo!",
    "Alteração no time para buscar um novo ritmo!",
    "Substituição estratégica neste momento do jogo!",
    "O treinador mexe no time com esta substituição!",
  ],
  meioCampo: [
    "Jogo disputado no meio-campo!",
    "Muita disputa pela posse de bola!",
    "Times estudando-se no meio-campo!",
    "Partida equilibrada no setor central!",
    "Batalha intensa pela bola no meio-campo!",
    "Disputa acirrada no círculo central!",
    "Meio-campo congestionado neste momento!",
  ],
  finalJogo: [
    "Fim de jogo!",
    "O árbitro apita o final da partida!",
    "Termina o jogo!",
    "Acabou! Final de partida!",
    "O juiz encerra a partida!",
    "Apita o árbitro! Fim de jogo!",
    "E termina assim a partida de hoje!",
  ],
  primeiroTempo: [
    "Fim do primeiro tempo!",
    "O árbitro apita e encerra o primeiro tempo!",
    "Intervalo! Os times vão para o vestiário!",
    "45 minutos jogados, fim do primeiro tempo!",
    "Termina a primeira etapa do jogo!",
    "Fim da primeira etapa! Times vão ao vestiário!",
    "O árbitro encerra o primeiro tempo!",
  ],
  segundoTempo: [
    "Começa o segundo tempo!",
    "A bola rola para a segunda etapa!",
    "Os times voltam a campo para o segundo tempo!",
    "Início do segundo tempo!",
    "A partida recomeça para os 45 minutos finais!",
    "Bola rolando para o segundo tempo!",
    "Começa a etapa final da partida!",
  ],
  pressao: [
    "O time aumenta a pressão!",
    "Momento de pressão total!",
    "Intensificando o ataque em busca do gol!",
    "Pressão crescente sobre a defesa adversária!",
    "Momento de sufoco no campo de defesa!",
    "Pressão intensa neste momento do jogo!",
    "O time todo avança em busca do gol!",
  ],
  contraAtaque: [
    "Contra-ataque perigoso!",
    "Saída rápida em contra-ataque!",
    "Transição veloz para o ataque!",
    "Contra-ataque fulminante!",
    "Resposta rápida com um contra-ataque!",
    "Contra-ataque mortal em velocidade!",
    "Saída em velocidade após recuperar a bola!",
  ],
  impedimento: [
    "Impedimento marcado!",
    "O bandeirinha levanta a bandeira! Impedimento!",
    "Jogador em posição irregular, impedimento!",
    "Ataque parado por impedimento!",
    "O assistente marca impedimento na jogada!",
    "Posição irregular, impedimento assinalado!",
    "Impedimento claro nesta jogada!",
  ],
  var: [
    "O VAR está analisando a jogada!",
    "Revisão do VAR em andamento!",
    "O árbitro vai conferir o monitor do VAR!",
    "Jogada sob revisão do árbitro de vídeo!",
    "O VAR recomenda revisão da jogada!",
    "Decisão sendo revisada pelo VAR!",
    "Momento de tensão com a análise do VAR!",
  ],
  penalti: [
    "Pênalti marcado!",
    "O árbitro aponta para a marca da cal!",
    "Pênalti claro para o time!",
    "Infração na área! Pênalti!",
    "O juiz não hesita e marca o pênalti!",
    "Falta dentro da área! Pênalti assinalado!",
    "Chance de ouro com este pênalti!",
  ],
  lesao: [
    "Jogador caído no gramado!",
    "Parece que temos um problema de lesão!",
    "O médico é chamado para atender o jogador!",
    "Jogador sente dores após o lance!",
    "Preocupação com possível lesão do jogador!",
    "Atendimento médico solicitado para o jogador!",
    "Momento de apreensão com a possível lesão!",
  ],
  clima: [
    "A chuva intensifica neste momento da partida!",
    "O campo está ficando pesado devido às condições climáticas!",
    "O vento forte está influenciando a trajetória da bola!",
    "O sol forte atrapalha a visão dos jogadores!",
    "As condições do gramado pioram com a chuva!",
    "O clima adverso dificulta o controle da bola!",
    "As poças d'água no campo afetam o rolamento da bola!",
  ],
  torcida: [
    "A torcida faz a festa nas arquibancadas!",
    "Que atmosfera incrível no estádio hoje!",
    "Os torcedores empurram o time neste momento!",
    "A torcida não para de cantar e apoiar!",
    "Clima fantástico nas arquibancadas!",
    "O apoio da torcida é fundamental neste momento!",
    "Os torcedores estão em êxtase com o desempenho do time!",
  ],
  rivalidade: [
    "O clima esquenta neste clássico!",
    "A rivalidade histórica está evidente em campo!",
    "Jogo tenso como se espera de um grande clássico!",
    "A temperatura do jogo sobe com esta rivalidade!",
    "O clássico está correspondendo às expectativas!",
    "Muita disputa e intensidade neste duelo de rivais!",
    "A história deste clássico ganha mais um capítulo emocionante!",
  ],
  jogadorDestaque: [
    "Que atuação impressionante deste jogador hoje!",
    "O craque está decidindo a partida!",
    "Jogador inspirado nesta tarde/noite!",
    "Atuação de gala do camisa {numero}!",
    "O talento individual está fazendo a diferença!",
    "Que partida espetacular deste jogador!",
    "O craque mostra por que é considerado um dos melhores!",
  ],
  tatica: [
    "A estratégia do treinador está funcionando perfeitamente!",
    "Mudança tática surtindo efeito no desempenho do time!",
    "A formação escolhida está dando resultado!",
    "O esquema tático surpreende o adversário!",
    "Ajuste tático inteligente do treinador!",
    "A disposição tática está sendo fundamental para o time!",
    "O treinador acertou na estratégia para esta partida!",
  ],
}

/**
 * Gera um número aleatório entre min e max (inclusive)
 */
function aleatorio(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Seleciona uma frase aleatória de uma categoria
 */
function selecionarFraseAleatoria(categoria: keyof typeof frasesNarracao): string {
  const frases = frasesNarracao[categoria]
  return frases[aleatorio(0, frases.length - 1)]
}

/**
 * Calcula a probabilidade de gol com base em múltiplos fatores
 */
function calcularProbabilidadeGol(
  timeAtacante: Time,
  timeDefensor: Time,
  jogadoresAtacando: Jogador[],
  jogadoresDefendendo: Jogador[],
  condicoes: CondicoesPartida,
  minuto: number,
): number {
  // Força base do time atacante (0-100)
  let probabilidade = timeAtacante.forca * 0.5

  // Ajuste pela moral do time (0-100)
  probabilidade += timeAtacante.moral * 0.2

  // Fator de jogo em casa (bônus de 10% se for em casa)
  if (timeAtacante.jogoCasa) {
    probabilidade *= 1.1

    // Bônus adicional baseado no público
    const percentualLotacao = condicoes.estadio.publico / condicoes.estadio.capacidade
    probabilidade *= 1 + percentualLotacao * 0.1
  }

  // Ajuste pela tática
  if (timeAtacante.tatica && TATICAS[timeAtacante.tatica as keyof typeof TATICAS]) {
    probabilidade *= 1 + TATICAS[timeAtacante.tatica as keyof typeof TATICAS].ataque * 0.1
  }

  // Ajuste pelo estilo de jogo
  if (timeAtacante.estiloJogo && ESTILOS_JOGO[timeAtacante.estiloJogo as keyof typeof ESTILOS_JOGO]) {
    probabilidade *= ESTILOS_JOGO[timeAtacante.estiloJogo as keyof typeof ESTILOS_JOGO].chanceGol
  }

  // Ajuste pela condição física
  if (timeAtacante.condicaoFisica) {
    probabilidade *= timeAtacante.condicaoFisica / 85
  }

  // Ajuste pelo clima
  if (condicoes.clima) {
    probabilidade *= CLIMAS[condicoes.clima].finalizacaoPrecisao
  }

  // Ajuste pela qualidade do gramado
  probabilidade *= 0.8 + condicoes.estadio.qualidadeGramado * 0.004

  // Ajuste pela importância da partida
  const importanciaFator = {
    amistoso: 1.0,
    campeonato: 1.1,
    copa: 1.2,
    final: 1.3,
    classico: 1.25,
  }
  probabilidade *= importanciaFator[condicoes.importancia]

  // Ajuste pela rivalidade
  probabilidade *= 1 + condicoes.rivalidade * 0.05

  // Ajuste pelo momento do jogo (mais gols no final das partidas)
  if (minuto > 75) {
    probabilidade *= 1.2
  } else if (minuto > 85) {
    probabilidade *= 1.3
  }

  // Redução baseada na força do time defensor
  probabilidade -= timeDefensor.forca * 0.3

  // Ajuste pela tática defensiva
  if (timeDefensor.tatica && TATICAS[timeDefensor.tatica as keyof typeof TATICAS]) {
    probabilidade *= 1 - TATICAS[timeDefensor.tatica as keyof typeof TATICAS].defesa * 0.1
  }

  // Normalizar para uma escala de 0-20%
  probabilidade = Math.max(0, Math.min(20, probabilidade / 10))

  // Adicionar fator de aleatoriedade (±5%)
  probabilidade += Math.random() * 10 - 5

  return Math.max(1, Math.min(25, probabilidade))
}

/**
 * Seleciona um jogador aleatório do time para um evento, com preferência para jogadores mais fortes
 */
function selecionarJogadorAleatorio(jogadores: Jogador[], posicao?: string, ponderado = true): Jogador | undefined {
  const jogadoresFiltrados = posicao ? jogadores.filter((j) => j.posicao === posicao) : jogadores

  if (jogadoresFiltrados.length === 0) {
    return jogadores[aleatorio(0, jogadores.length - 1)]
  }

  if (!ponderado) {
    return jogadoresFiltrados[aleatorio(0, jogadoresFiltrados.length - 1)]
  }

  // Seleção ponderada pela força do jogador
  const totalForca = jogadoresFiltrados.reduce((soma, jogador) => soma + jogador.forca, 0)
  const valorAleatorio = Math.random() * totalForca
  let somaAcumulada = 0

  for (const jogador of jogadoresFiltrados) {
    somaAcumulada += jogador.forca
    if (valorAleatorio <= somaAcumulada) {
      return jogador
    }
  }

  return jogadoresFiltrados[jogadoresFiltrados.length - 1]
}

/**
 * Gera um evento de narração contextual
 */
function gerarEventoNarracao(
  minuto: number,
  timeId: string,
  tipo: keyof typeof frasesNarracao,
  jogador?: Jogador,
): EventoPartida {
  let descricao = `${minuto}' ${selecionarFraseAleatoria(tipo)}`

  if (jogador) {
    descricao += ` ${jogador.nome} ${jogador.posicao === "GOL" ? "(goleiro)" : `(${jogador.posicao})`}`
  }

  return {
    minuto,
    tipo: "narracao",
    time_id: timeId,
    jogador_id: jogador?.id,
    descricao,
  }
}

/**
 * Verifica se dois times são rivais
 */
function saoRivais(time1: Time, time2: Time): boolean {
  if (!time1.rivalidade || !time2.rivalidade) return false
  return time1.rivalidade.includes(time2.id) || time2.rivalidade.includes(time1.id)
}

/**
 * Simula um minuto de jogo e retorna eventos que ocorreram
 */
export function simularMinutoJogo(
  minuto: number,
  timeCasa: Time,
  timeVisitante: Time,
  jogadoresCasa: Jogador[],
  jogadoresVisitante: Jogador[],
  placar: { casa: number; visitante: number },
  estatisticas: {
    posseBola: { casa: number; visitante: number }
    chutes: { casa: number; visitante: number }
    chutesNoGol: { casa: number; visitante: number }
    escanteios: { casa: number; visitante: number }
    faltas: { casa: number; visitante: number }
    cartoesAmarelos: { casa: number; visitante: number }
    cartoesVermelhos: { casa: number; visitante: number }
    impedimentos: { casa: number; visitante: number }
    passes: { casa: number; visitante: number }
    passesCompletos: { casa: number; visitante: number }
  },
  condicoes: CondicoesPartida,
): EventoPartida[] {
  const eventos: EventoPartida[] = []

  // Eventos especiais em momentos específicos do jogo
  if (minuto === 1) {
    // Narração inicial com informações sobre o clima e estádio
    let descricaoInicial = `${minuto}' ${selecionarFraseAleatoria("inicioJogo")} `

    // Adicionar informação sobre o clima
    descricaoInicial += `O jogo começa com clima ${condicoes.clima} e temperatura de ${condicoes.temperatura}°C. `

    // Adicionar informação sobre o público
    const percentualLotacao = Math.round((condicoes.estadio.publico / condicoes.estadio.capacidade) * 100)
    descricaoInicial += `Estádio com ${percentualLotacao}% de lotação, ${condicoes.estadio.publico.toLocaleString()} torcedores presentes.`

    eventos.push({
      minuto,
      tipo: "narracao",
      time_id: "",
      descricao: descricaoInicial,
    })

    // Se for um clássico ou partida importante, adicionar narração especial
    if (condicoes.importancia === "classico" || condicoes.rivalidade > 0.7) {
      eventos.push(gerarEventoNarracao(minuto, "", "rivalidade"))
    }

    return eventos
  }

  if (minuto === 45) {
    // Narração de fim do primeiro tempo com estatísticas
    let descricaoIntervalo = `${minuto}' ${selecionarFraseAleatoria("primeiroTempo")} `
    descricaoIntervalo += `Placar: ${timeCasa.nome} ${placar.casa} x ${placar.visitante} ${timeVisitante.nome}. `
    descricaoIntervalo += `Posse de bola: ${Math.round(estatisticas.posseBola.casa)}% x ${Math.round(estatisticas.posseBola.visitante)}%. `
    descricaoIntervalo += `Finalizações: ${estatisticas.chutes.casa} x ${estatisticas.chutes.visitante}.`

    eventos.push({
      minuto,
      tipo: "narracao",
      time_id: "",
      descricao: descricaoIntervalo,
    })
    return eventos
  }

  if (minuto === 46) {
    eventos.push(gerarEventoNarracao(minuto, "", "segundoTempo"))

    // Se o clima mudou no intervalo, adicionar narração
    if (Math.random() < 0.2) {
      eventos.push(gerarEventoNarracao(minuto, "", "clima"))
    }

    return eventos
  }

  if (minuto === 90) {
    // Narração de fim de jogo com estatísticas completas
    let descricaoFinal = `${minuto}' ${selecionarFraseAleatoria("finalJogo")} `
    descricaoFinal += `Placar final: ${timeCasa.nome} ${placar.casa} x ${placar.visitante} ${timeVisitante.nome}. `

    // Determinar o resultado
    if (placar.casa > placar.visitante) {
      descricaoFinal += `Vitória do ${timeCasa.nome} jogando em casa!`
    } else if (placar.visitante > placar.casa) {
      descricaoFinal += `Vitória do ${timeVisitante.nome} fora de casa!`
    } else {
      descricaoFinal += `Empate justo pelo que vimos em campo.`
    }

    eventos.push({
      minuto,
      tipo: "narracao",
      time_id: "",
      descricao: descricaoFinal,
    })

    // Adicionar resumo estatístico
    const resumoEstatistico =
      `${minuto}' Estatísticas finais: Posse (${Math.round(estatisticas.posseBola.casa)}%-${Math.round(estatisticas.posseBola.visitante)}%), ` +
      `Finalizações (${estatisticas.chutes.casa}-${estatisticas.chutes.visitante}), ` +
      `No gol (${estatisticas.chutesNoGol.casa}-${estatisticas.chutesNoGol.visitante}), ` +
      `Escanteios (${estatisticas.escanteios.casa}-${estatisticas.escanteios.visitante}), ` +
      `Faltas (${estatisticas.faltas.casa}-${estatisticas.faltas.visitante}).`

    eventos.push({
      minuto,
      tipo: "narracao",
      time_id: "",
      descricao: resumoEstatistico,
    })

    return eventos
  }

  // Determinar qual time está atacando (baseado em posse de bola e aleatoriedade)
  const posseCasa = estatisticas.posseBola.casa / 100
  const timeAtacando = Math.random() < posseCasa ? timeCasa : timeVisitante
  const timeDefendendo = timeAtacando === timeCasa ? timeVisitante : timeCasa
  const jogadoresAtacando = timeAtacando === timeCasa ? jogadoresCasa : jogadoresVisitante
  const jogadoresDefendendo = timeAtacando === timeCasa ? jogadoresVisitante : jogadoresCasa

  // Atualizar estatísticas de passes
  if (timeAtacando === timeCasa) {
    estatisticas.passes.casa += aleatorio(2, 5)
    estatisticas.passesCompletos.casa += aleatorio(1, 4)
  } else {
    estatisticas.passes.visitante += aleatorio(2, 5)
    estatisticas.passesCompletos.visitante += aleatorio(1, 4)
  }

  // Probabilidade de eventos
  const probGol =
    calcularProbabilidadeGol(timeAtacando, timeDefendendo, jogadoresAtacando, jogadoresDefendendo, condicoes, minuto) /
    100
  const probQuaseGol = 0.15
  let probFalta = 0.12
  let probCartaoAmarelo = 0.03
  let probCartaoVermelho = 0.005
  const probEscanteio = 0.08
  const probSubstituicao = minuto > 60 ? 0.04 : 0.01
  const probNarracaoGeral = 0.3
  const probImpedimento = 0.06
  const probPenalti = 0.01
  const probLesao = 0.005
  const probVAR = 0.02

  // Aumentar probabilidades em clássicos e jogos importantes
  if (condicoes.importancia === "classico" || condicoes.importancia === "final" || condicoes.rivalidade > 0.7) {
    probFalta *= 1.3
    probCartaoAmarelo *= 1.5
    probCartaoVermelho *= 1.5
  }

  // Gerar evento aleatório
  const random = Math.random()

  // Atualizar estatísticas de chutes
  if (timeAtacando === timeCasa) {
    estatisticas.chutes.casa += 1
  } else {
    estatisticas.chutes.visitante += 1
  }

  // Gol
  if (random < probGol) {
    // Selecionar jogador para marcar o gol, com preferência para atacantes e meias ofensivos
    const jogador =
      selecionarJogadorAleatorio(jogadoresAtacando, "ATA", true) ||
      selecionarJogadorAleatorio(jogadoresAtacando, "MEI", true) ||
      selecionarJogadorAleatorio(jogadoresAtacando, true)

    // Selecionar jogador para a assistência
    const jogadorAssistencia = selecionarJogadorAleatorio(
      jogadoresAtacando.filter((j) => j.id !== jogador?.id),
      undefined,
      true,
    )

    if (timeAtacando === timeCasa) {
      placar.casa += 1
      estatisticas.chutesNoGol.casa += 1
    } else {
      placar.visitante += 1
      estatisticas.chutesNoGol.visitante += 1
    }

    // Determinar se é um golaço (10% de chance)
    const ehGolaço = Math.random() < 0.1

    // Criar descrição do gol
    let descricaoGol = `${minuto}' ${ehGolaço ? selecionarFraseAleatoria("golGrande") : selecionarFraseAleatoria("gol")} `
    descricaoGol += `${jogador?.nome || "Jogador"} marca para o ${timeAtacando.nome}! `

    // Adicionar informação sobre assistência (70% dos gols têm assistência)
    if (jogadorAssistencia && Math.random() < 0.7) {
      descricaoGol += `Assistência de ${jogadorAssistencia.nome}. `
    }

    // Adicionar placar atual
    descricaoGol += `${placar.casa} x ${placar.visitante}`

    eventos.push({
      minuto,
      tipo: "gol",
      time_id: timeAtacando.id,
      jogador_id: jogador?.id,
      jogador_assistencia_id: jogadorAssistencia?.id,
      descricao: descricaoGol,
      detalhes: {
        ehGolaço,
        tipoGol: ehGolaço ? "golaço" : "normal",
        assistencia: jogadorAssistencia ? true : false,
      },
    })

    // Adicionar narração sobre a reação da torcida após o gol
    if (Math.random() < 0.7) {
      eventos.push(gerarEventoNarracao(minuto, "", "torcida"))
    }

    return eventos
  }
  // Quase gol
  else if (random < probGol + probQuaseGol) {
    const jogador = selecionarJogadorAleatorio(jogadoresAtacando, undefined, true)
    const goleiro = selecionarJogadorAleatorio(jogadoresDefendendo, "GOL", true)

    if (timeAtacando === timeCasa) {
      estatisticas.chutesNoGol.casa += 1
    } else {
      estatisticas.chutesNoGol.visitante += 1
    }

    if (Math.random() < 0.5) {
      // Defesa do goleiro
      eventos.push(gerarEventoNarracao(minuto, timeDefendendo.id, "defesa", goleiro))
    } else {
      // Quase gol
      eventos.push(gerarEventoNarracao(minuto, timeAtacando.id, "quaseGol", jogador))
    }
  }
  // Pênalti
  else if (random < probGol + probQuaseGol + probPenalti) {
    const jogadorFalta = selecionarJogadorAleatorio(jogadoresDefendendo, undefined, true)
    const jogadorSofreuFalta = selecionarJogadorAleatorio(jogadoresAtacando, undefined, true)

    // Narração do pênalti
    eventos.push({
      minuto,
      tipo: "penalti",
      time_id: timeAtacando.id,
      jogador_id: jogadorSofreuFalta?.id,
      descricao: `${minuto}' ${selecionarFraseAleatoria("penalti")} ${jogadorSofreuFalta?.nome || "Jogador"} sofreu a falta na área!`,
    })

    // Verificar se haverá revisão do VAR (30% de chance)
    if (Math.random() < 0.3) {
      eventos.push({
        minuto,
        tipo: "var",
        time_id: "",
        descricao: `${minuto}' ${selecionarFraseAleatoria("var")} Checando possível pênalti.`,
      })

      // 80% de chance do VAR confirmar o pênalti
      if (Math.random() < 0.8) {
        eventos.push({
          minuto: minuto + 1,
          tipo: "narracao",
          time_id: "",
          descricao: `${minuto + 1}' Após revisão do VAR, o árbitro confirma o pênalti!`,
        })

        // Cobrador do pênalti (geralmente o melhor batedor)
        const cobrador = selecionarJogadorAleatorio(jogadoresAtacando, undefined, true)
        const goleiro = selecionarJogadorAleatorio(jogadoresDefendendo, "GOL", true)

        // 75% de chance de converter o pênalti
        if (Math.random() < 0.75) {
          // Gol de pênalti
          if (timeAtacando === timeCasa) {
            placar.casa += 1
            estatisticas.chutesNoGol.casa += 1
          } else {
            placar.visitante += 1
            estatisticas.chutesNoGol.visitante += 1
          }

          eventos.push({
            minuto: minuto + 2,
            tipo: "gol",
            time_id: timeAtacando.id,
            jogador_id: cobrador?.id,
            descricao: `${minuto + 2}' GOOOOOL! ${cobrador?.nome || "Jogador"} converte o pênalti com categoria! ${placar.casa} x ${placar.visitante}`,
            detalhes: {
              tipoGol: "penalti",
              assistencia: false,
            },
          })
        } else {
          // Pênalti perdido
          if (timeAtacando === timeCasa) {
            estatisticas.chutesNoGol.casa += 1
          } else {
            estatisticas.chutesNoGol.visitante += 1
          }

          eventos.push({
            minuto: minuto + 2,
            tipo: "narracao",
            time_id: timeDefendendo.id,
            jogador_id: goleiro?.id,
            descricao: `${minuto + 2}' DEFENDEU! ${goleiro?.nome || "Goleiro"} faz uma defesa espetacular e salva o time!`,
          })
        }
      } else {
        // VAR anula o pênalti
        eventos.push({
          minuto: minuto + 1,
          tipo: "narracao",
          time_id: "",
          descricao: `${minuto + 1}' Após revisão do VAR, o árbitro volta atrás e anula o pênalti!`,
        })
      }

      // Retornar eventos já que este é um evento complexo que consome vários minutos
      return eventos
    } else {
      // Cobrador do pênalti (geralmente o melhor batedor)
      const cobrador = selecionarJogadorAleatorio(jogadoresAtacando, undefined, true)
      const goleiro = selecionarJogadorAleatorio(jogadoresDefendendo, "GOL", true)

      // 75% de chance de converter o pênalti
      if (Math.random() < 0.75) {
        // Gol de pênalti
        if (timeAtacando === timeCasa) {
          placar.casa += 1
          estatisticas.chutesNoGol.casa += 1
        } else {
          placar.visitante += 1
          estatisticas.chutesNoGol.visitante += 1
        }

        eventos.push({
          minuto: minuto + 1,
          tipo: "gol",
          time_id: timeAtacando.id,
          jogador_id: cobrador?.id,
          descricao: `${minuto + 1}' GOOOOOL! ${cobrador?.nome || "Jogador"} converte o pênalti com categoria! ${placar.casa} x ${placar.visitante}`,
          detalhes: {
            tipoGol: "penalti",
            assistencia: false,
          },
        })
      } else {
        // Pênalti perdido
        if (timeAtacando === timeCasa) {
          estatisticas.chutesNoGol.casa += 1
        } else {
          estatisticas.chutesNoGol.visitante += 1
        }

        eventos.push({
          minuto: minuto + 1,
          tipo: "narracao",
          time_id: timeDefendendo.id,
          jogador_id: goleiro?.id,
          descricao: `${minuto + 1}' DEFENDEU! ${goleiro?.nome || "Goleiro"} faz uma defesa espetacular e salva o time!`,
        })
      }

      return eventos
    }
  }
  // Impedimento
  else if (random < probGol + probQuaseGol + probPenalti + probImpedimento) {
    const jogador =
      selecionarJogadorAleatorio(jogadoresAtacando, "ATA", true) ||
      selecionarJogadorAleatorio(jogadoresAtacando, undefined, true)

    if (timeAtacando === timeCasa) {
      estatisticas.impedimentos.casa = (estatisticas.impedimentos.casa || 0) + 1
    } else {
      estatisticas.impedimentos.visitante = (estatisticas.impedimentos.visitante || 0) + 1
    }

    eventos.push({
      minuto,
      tipo: "impedimento",
      time_id: timeAtacando.id,
      jogador_id: jogador?.id,
      descricao: `${minuto}' ${selecionarFraseAleatoria("impedimento")} ${jogador?.nome || "Jogador"} estava adiantado.`,
    })

    // Verificar se haverá revisão do VAR (10% de chance)
    if (Math.random() < 0.1) {
      eventos.push({
        minuto: minuto + 1,
        tipo: "var",
        time_id: "",
        descricao: `${minuto + 1}' ${selecionarFraseAleatoria("var")} Checando possível impedimento.`,
      })

      // 20% de chance do VAR reverter o impedimento
      if (Math.random() < 0.2) {
        eventos.push({
          minuto: minuto + 2,
          tipo: "narracao",
          time_id: "",
          descricao: `${minuto + 2}' Após revisão do VAR, o árbitro volta atrás! Não havia impedimento, o jogo continua!`,
        })
      } else {
        eventos.push({
          minuto: minuto + 2,
          tipo: "narracao",
          time_id: "",
          descricao: `${minuto + 2}' Após revisão do VAR, o impedimento é confirmado.`,
        })
      }

      return eventos
    }
  }
  // Falta
  else if (random < probGol + probQuaseGol + probPenalti + probImpedimento + probFalta) {
    const jogador = selecionarJogadorAleatorio(jogadoresDefendendo, undefined, true)

    if (timeAtacando === timeCasa) {
      estatisticas.faltas.visitante += 1
    } else {
      estatisticas.faltas.casa += 1
    }

    eventos.push(gerarEventoNarracao(minuto, timeDefendendo.id, "falta", jogador))

    // Chance de cartão após falta
    if (Math.random() < probCartaoAmarelo / probFalta) {
      if (timeAtacando === timeCasa) {
        estatisticas.cartoesAmarelos.visitante += 1
      } else {
        estatisticas.cartoesAmarelos.casa += 1
      }
      eventos.push({
        minuto,
        tipo: "cartao_amarelo",
        time_id: timeDefendendo.id,
        jogador_id: jogador?.id,
        descricao: `${minuto}' ${selecionarFraseAleatoria("cartaoAmarelo")} ${jogador?.nome || "Jogador"} do ${timeDefendendo.nome}`,
      })

      // Verificar se é segundo amarelo (expulsão)
      if (jogador?.cartoes?.amarelos === 1) {
        if (timeAtacando === timeCasa) {
          estatisticas.cartoesVermelhos.visitante += 1
        } else {
          estatisticas.cartoesVermelhos.casa += 1
        }
        eventos.push({
          minuto,
          tipo: "cartao_vermelho",
          time_id: timeDefendendo.id,
          jogador_id: jogador?.id,
          descricao: `${minuto}' EXPULSO! Segundo cartão amarelo e consequente vermelho para ${jogador?.nome || "Jogador"} do ${timeDefendendo.nome}!`,
        })
      }
    } else if (Math.random() < probCartaoVermelho / probFalta) {
      if (timeAtacando === timeCasa) {
        estatisticas.cartoesVermelhos.visitante += 1
      } else {
        estatisticas.cartoesVermelhos.casa += 1
      }
      eventos.push({
        minuto,
        tipo: "cartao_vermelho",
        time_id: timeDefendendo.id,
        jogador_id: jogador?.id,
        descricao: `${minuto}' ${selecionarFraseAleatoria("cartaoVermelho")} ${jogador?.nome || "Jogador"} do ${timeDefendendo.nome}`,
      })
    }
  }
  // Escanteio
  else if (random < probGol + probQuaseGol + probPenalti + probImpedimento + probFalta + probEscanteio) {
    if (timeAtacando === timeCasa) {
      estatisticas.escanteios.casa += 1
    } else {
      estatisticas.escanteios.visitante += 1
    }

    eventos.push(gerarEventoNarracao(minuto, timeAtacando.id, "escanteio"))

    // Chance de gol de escanteio (5%)
    if (Math.random() < 0.05) {
      const jogador =
        selecionarJogadorAleatorio(jogadoresAtacando, "ZAG", true) ||
        selecionarJogadorAleatorio(jogadoresAtacando, undefined, true)
      const jogadorAssistencia = selecionarJogadorAleatorio(jogadoresAtacando, undefined, true)

      if (timeAtacando === timeCasa) {
        placar.casa += 1
        estatisticas.chutesNoGol.casa += 1
      } else {
        placar.visitante += 1
        estatisticas.chutesNoGol.visitante += 1
      }

      eventos.push({
        minuto: minuto + 1,
        tipo: "gol",
        time_id: timeAtacando.id,
        jogador_id: jogador?.id,
        jogador_assistencia_id: jogadorAssistencia?.id,
        descricao: `${minuto + 1}' GOOOOOL! ${jogador?.nome || "Jogador"} marca de cabeça após cobrança de escanteio! ${placar.casa} x ${placar.visitante}`,
        detalhes: {
          tipoGol: "escanteio",
          assistencia: true,
        },
      })

      return eventos
    }
  }
  // Lesão
  else if (random < probGol + probQuaseGol + probPenalti + probImpedimento + probFalta + probEscanteio + probLesao) {
    const jogador = selecionarJogadorAleatorio(
      Math.random() < 0.5 ? jogadoresCasa : jogadoresVisitante,
      undefined,
      false,
    )
    const timeJogador = jogadoresCasa.some((j) => j.id === jogador?.id) ? timeCasa : timeVisitante

    eventos.push({
      minuto,
      tipo: "lesao",
      time_id: timeJogador.id,
      jogador_id: jogador?.id,
      descricao: `${minuto}' ${selecionarFraseAleatoria("lesao")} ${jogador?.nome || "Jogador"} do ${timeJogador.nome} parece sentir dores.`,
    })

    // Determinar gravidade da lesão
    const gravidadeLesao = Math.random()

    if (gravidadeLesao < 0.3) {
      // Lesão leve, jogador continua
      eventos.push({
        minuto: minuto + 1,
        tipo: "narracao",
        time_id: timeJogador.id,
        jogador_id: jogador?.id,
        descricao: `${minuto + 1}' ${jogador?.nome || "Jogador"} recebe atendimento e parece que vai conseguir continuar na partida.`,
      })
    } else if (gravidadeLesao < 0.7) {
      // Lesão moderada, jogador é substituído
      const substituto = selecionarJogadorAleatorio(
        (timeJogador === timeCasa ? jogadoresCasa : jogadoresVisitante).filter((j) => !j.titular),
        jogador?.posicao,
        true,
      )

      eventos.push({
        minuto: minuto + 2,
        tipo: "substituicao",
        time_id: timeJogador.id,
        jogador_id: substituto?.id,
        descricao: `${minuto + 2}' Substituição forçada no ${timeJogador.nome}. ${jogador?.nome || "Jogador"} não tem condições de continuar e dá lugar a ${substituto?.nome || "Jogador"}.`,
      })
    } else {
      // Lesão grave
      const substituto = selecionarJogadorAleatorio(
        (timeJogador === timeCasa ? jogadoresCasa : jogadoresVisitante).filter((j) => !j.titular),
        jogador?.posicao,
        true,
      )

      eventos.push({
        minuto: minuto + 1,
        tipo: "narracao",
        time_id: timeJogador.id,
        jogador_id: jogador?.id,
        descricao: `${minuto + 1}' Situação preocupante! ${jogador?.nome || "Jogador"} parece ter sofrido uma lesão séria.`,
      })

      eventos.push({
        minuto: minuto + 3,
        tipo: "substituicao",
        time_id: timeJogador.id,
        jogador_id: substituto?.id,
        descricao: `${minuto + 3}' ${jogador?.nome || "Jogador"} deixa o campo de maca. ${substituto?.nome || "Jogador"} entra em seu lugar.`,
      })
    }

    return eventos
  }
  // Substituição
  else if (
    random <
    probGol + probQuaseGol + probPenalti + probImpedimento + probFalta + probEscanteio + probLesao + probSubstituicao
  ) {
    const time = Math.random() < 0.5 ? timeCasa : timeVisitante
    const jogadores = time === timeCasa ? jogadoresCasa : jogadoresVisitante

    // Selecionar jogador para sair (titular)
    const jogadorSai = selecionarJogadorAleatorio(
      jogadores.filter((j) => j.titular),
      undefined,
      false,
    )

    // Selecionar jogador para entrar (reserva)
    const jogadorEntra = selecionarJogadorAleatorio(
      jogadores.filter((j) => !j.titular),
      jogadorSai?.posicao,
      true,
    )

    if (jogadorSai && jogadorEntra) {
      eventos.push({
        minuto,
        tipo: "substituicao",
        time_id: time.id,
        jogador_id: jogadorEntra.id,
        descricao: `${minuto}' ${selecionarFraseAleatoria("substituicao")} ${jogadorSai.nome} sai para a entrada de ${jogadorEntra.nome}.`,
      })

      // Adicionar narração sobre a mudança tática (30% de chance)
      if (Math.random() < 0.3) {
        eventos.push(gerarEventoNarracao(minuto + 1, time.id, "tatica"))
      }
    } else {
      eventos.push(gerarEventoNarracao(minuto, time.id, "substituicao"))
    }
  }
  // Narração geral
  else if (
    random <
    probGol +
      probQuaseGol +
      probPenalti +
      probImpedimento +
      probFalta +
      probEscanteio +
      probLesao +
      probSubstituicao +
      probNarracaoGeral
  ) {
    // Tipos de narração possíveis
    const tiposNarracao: (keyof typeof frasesNarracao)[] = ["ataque", "meioCampo", "defesa", "pressao", "contraAtaque"]

    // Adicionar tipos de narração específicos baseados no contexto do jogo
    if (Math.abs(placar.casa - placar.visitante) >= 2) {
      // Se há uma diferença de 2 ou mais gols, adicionar narração sobre pressão
      tiposNarracao.push("pressao", "pressao")
    }

    if (minuto > 80) {
      // Nos minutos finais, mais narrações sobre pressão e ataques
      tiposNarracao.push("pressao", "ataque", "contraAtaque")
    }

    if (condicoes.importancia === "classico" || condicoes.importancia === "final") {
      // Em jogos importantes, adicionar narrações sobre rivalidade e torcida
      tiposNarracao.push("rivalidade", "torcida")
    }

    // Se o clima é adverso, adicionar narração sobre o clima
    if (condicoes.clima === "chuvoso" || condicoes.clima === "tempestade" || condicoes.clima === "neve") {
      tiposNarracao.push("clima")
    }

    // Selecionar um tipo aleatório de narração
    const tipoAleatorio = tiposNarracao[aleatorio(0, tiposNarracao.length - 1)]

    // Selecionar um jogador para destacar na narração (opcional)
    const jogadorDestaque =
      Math.random() < 0.5 ? selecionarJogadorAleatorio(jogadoresAtacando, undefined, true) : undefined

    eventos.push(gerarEventoNarracao(minuto, timeAtacando.id, tipoAleatorio, jogadorDestaque))
  }

  return eventos
}

/**
 * Gera eventos para uma partida completa, mas não calcula o resultado final
 * Isso permite que a simulação ocorra em tempo real
 */
export function gerarEventosPartida(
  timeCasa: Time,
  timeVisitante: Time,
  jogadoresCasa: Jogador[],
  jogadoresVisitante: Jogador[],
  condicoes?: Partial<CondicoesPartida>,
): EventoPartida[] {
  // Configurar condições padrão se não fornecidas
  const condicoesCompletas: CondicoesPartida = {
    clima: condicoes?.clima || (Math.random() < 0.7 ? "ensolarado" : Math.random() < 0.5 ? "nublado" : "chuvoso"),
    temperatura: condicoes?.temperatura || aleatorio(15, 30),
    estadio: condicoes?.estadio || {
      qualidadeGramado: aleatorio(70, 100),
      capacidade: aleatorio(20000, 60000),
      publico: aleatorio(10000, 50000),
    },
    importancia: condicoes?.importancia || "campeonato",
    rivalidade: condicoes?.rivalidade || (saoRivais(timeCasa, timeVisitante) ? 1 : 0.2),
  }

  // Inicializar estatísticas
  const estatisticas = {
    posseBola: { casa: 0, visitante: 0 },
    chutes: { casa: 0, visitante: 0 },
    chutesNoGol: { casa: 0, visitante: 0 },
    escanteios: { casa: 0, visitante: 0 },
    faltas: { casa: 0, visitante: 0 },
    cartoesAmarelos: { casa: 0, visitante: 0 },
    cartoesVermelhos: { casa: 0, visitante: 0 },
    impedimentos: { casa: 0, visitante: 0 },
    passes: { casa: 0, visitante: 0 },
    passesCompletos: { casa: 0, visitante: 0 },
  }

  // Calcular posse de bola inicial baseada na força dos times e estilos de jogo
  const posseCasa = 40 + (timeCasa.forca - timeVisitante.forca) / 2 + aleatorio(-5, 5)
  estatisticas.posseBola.casa = Math.max(30, Math.min(70, posseCasa))
  estatisticas.posseBola.visitante = 100 - estatisticas.posseBola.casa

  // Ajustar posse com base no estilo de jogo
  if (timeCasa.estiloJogo && ESTILOS_JOGO[timeCasa.estiloJogo as keyof typeof ESTILOS_JOGO]) {
    estatisticas.posseBola.casa *= ESTILOS_JOGO[timeCasa.estiloJogo as keyof typeof ESTILOS_JOGO].posseBola
  }
  if (timeVisitante.estiloJogo && ESTILOS_JOGO[timeVisitante.estiloJogo as keyof typeof ESTILOS_JOGO]) {
    estatisticas.posseBola.visitante *= ESTILOS_JOGO[timeVisitante.estiloJogo as keyof typeof ESTILOS_JOGO].posseBola
  }

  // Normalizar a posse de bola para que a soma seja 100%
  const totalPosse = estatisticas.posseBola.casa + estatisticas.posseBola.visitante
  estatisticas.posseBola.casa = (estatisticas.posseBola.casa / totalPosse) * 100
  estatisticas.posseBola.visitante = (estatisticas.posseBola.visitante / totalPosse) * 100

  // Placar atual
  const placar = { casa: 0, visitante: 0 }

  // Array para armazenar todos os eventos
  const todosEventos: EventoPartida[] = []

  // Gerar eventos para cada minuto
  for (let minuto = 1; minuto <= 90; minuto++) {
    const eventos = simularMinutoJogo(
      minuto,
      timeCasa,
      timeVisitante,
      jogadoresCasa,
      jogadoresVisitante,
      placar,
      estatisticas,
      condicoesCompletas,
    )

    // Adicionar eventos ao array
    todosEventos.push(...eventos)
  }

  return todosEventos
}

/**
 * Calcula a força de um time com base nos jogadores
 */
export function calcularForcaTime(jogadores: Jogador[], moral = 80): number {
  if (!jogadores || jogadores.length === 0) return 70 // Valor padrão

  // Calcular a média da força dos jogadores titulares
  const titulares = jogadores.filter((j) => j.titular)
  if (titulares.length === 0) return 70

  const somaForca = titulares.reduce((soma, jogador) => soma + (jogador.forca || 70), 0)
  const forcaMedia = somaForca / titulares.length

  // Ajustar com base na moral do time (±10%)
  const ajusteMoral = ((moral - 50) / 50) * 10

  return Math.max(50, Math.min(100, forcaMedia + ajusteMoral))
}

/**
 * Processa os eventos até um determinado minuto e retorna o estado atual da partida
 */
export function processarEventosAteMinuto(
  eventos: EventoPartida[],
  minutoAtual: number,
): {
  placar: { casa: number; visitante: number }
  estatisticas: {
    posseBola: { casa: number; visitante: number }
    chutes: { casa: number; visitante: number }
    chutesNoGol: { casa: number; visitante: number }
    escanteios: { casa: number; visitante: number }
    faltas: { casa: number; visitante: number }
    cartoesAmarelos: { casa: number; visitante: number }
    cartoesVermelhos: { casa: number; visitante: number }
    impedimentos?: { casa: number; visitante: number }
    passes?: { casa: number; visitante: number }
    passesCompletos?: { casa: number; visitante: number }
  }
  eventosProcessados: EventoPartida[]
} {
  // Filtrar eventos até o minuto atual
  const eventosAteMinuto = eventos.filter((e) => e.minuto <= minutoAtual)

  // Inicializar estatísticas
  const estatisticas = {
    posseBola: { casa: 50, visitante: 50 },
    chutes: { casa: 0, visitante: 0 },
    chutesNoGol: { casa: 0, visitante: 0 },
    escanteios: { casa: 0, visitante: 0 },
    faltas: { casa: 0, visitante: 0 },
    cartoesAmarelos: { casa: 0, visitante: 0 },
    cartoesVermelhos: { casa: 0, visitante: 0 },
    impedimentos: { casa: 0, visitante: 0 },
    passes: { casa: 0, visitante: 0 },
    passesCompletos: { casa: 0, visitante: 0 },
  }

  // Inicializar placar
  const placar = { casa: 0, visitante: 0 }

  // Processar eventos para atualizar placar e estatísticas
  eventosAteMinuto.forEach((evento) => {
    // Identificar se o evento é do time da casa ou visitante
    const timeCasa = evento.time_id.includes("casa") || (!evento.time_id.includes("visitante") && evento.time_id !== "")

    // Atualizar estatísticas com base no tipo de evento
    switch (evento.tipo) {
      case "gol":
        if (timeCasa) {
          placar.casa += 1
          estatisticas.chutesNoGol.casa += 1
          estatisticas.chutes.casa += 1
        } else {
          placar.visitante += 1
          estatisticas.chutesNoGol.visitante += 1
          estatisticas.chutes.visitante += 1
        }
        break

      case "falta":
        if (timeCasa) {
          estatisticas.faltas.casa += 1
        } else {
          estatisticas.faltas.visitante += 1
        }
        break

      case "cartao_amarelo":
        if (timeCasa) {
          estatisticas.cartoesAmarelos.casa += 1
        } else {
          estatisticas.cartoesAmarelos.visitante += 1
        }
        break

      case "cartao_vermelho":
        if (timeCasa) {
          estatisticas.cartoesVermelhos.casa += 1
        } else {
          estatisticas.cartoesVermelhos.visitante += 1
        }
        break

      case "escanteio":
        if (timeCasa) {
          estatisticas.escanteios.casa += 1
        } else {
          estatisticas.escanteios.visitante += 1
        }
        break

      case "impedimento":
        if (timeCasa) {
          estatisticas.impedimentos.casa = (estatisticas.impedimentos.casa || 0) + 1
        } else {
          estatisticas.impedimentos.visitante = (estatisticas.impedimentos.visitante || 0) + 1
        }
        break
    }
  })

  // Calcular posse de bola com base no minuto atual (simulação simplificada)
  // Quanto mais avançada a partida, mais precisa a posse de bola
  const fatorPrecisao = Math.min(1, minutoAtual / 45)
  const posseCasaBase = 50 + (Math.random() * 20 - 10) * (1 - fatorPrecisao)
  estatisticas.posseBola.casa = Math.max(30, Math.min(70, posseCasaBase))
  estatisticas.posseBola.visitante = 100 - estatisticas.posseBola.casa

  // Adicionar chutes aleatórios com base no minuto (simulação)
  if (minutoAtual > 0) {
    const chutesEsperados = minutoAtual * 0.15 // ~14 chutes por time em 90 minutos

    // Ajustar chutes para refletir o progresso da partida
    if (estatisticas.chutes.casa < chutesEsperados) {
      estatisticas.chutes.casa = Math.floor(chutesEsperados * (0.8 + Math.random() * 0.4))
    }

    if (estatisticas.chutes.visitante < chutesEsperados) {
      estatisticas.chutes.visitante = Math.floor(chutesEsperados * (0.8 + Math.random() * 0.4))
    }

    // Ajustar chutes no gol (aproximadamente 40% dos chutes são no gol)
    if (estatisticas.chutesNoGol.casa < estatisticas.chutes.casa * 0.4) {
      estatisticas.chutesNoGol.casa = Math.floor(estatisticas.chutes.casa * (0.3 + Math.random() * 0.2))
    }

    if (estatisticas.chutesNoGol.visitante < estatisticas.chutes.visitante * 0.4) {
      estatisticas.chutesNoGol.visitante = Math.floor(estatisticas.chutes.visitante * (0.3 + Math.random() * 0.2))
    }
  }

  return {
    placar,
    estatisticas,
    eventosProcessados: eventosAteMinuto,
  }
}
