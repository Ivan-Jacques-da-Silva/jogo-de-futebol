/**
 * API para gerenciamento de partidas
 * Fornece funções para buscar, criar e simular partidas
 */
import { v4 as uuidv4 } from "uuid"

// Tipos
export interface Partida {
  id: string
  time_casa_id: string
  time_visitante_id: string
  gols_casa: number
  gols_visitante: number
  data_partida: string
  campeonato: string
  rodada: number
  finalizada: boolean
  estadio_id: string | null
  publico: number | null
  renda: number | null
}

export interface EventoPartida {
  id: string
  partida_id: string
  minuto: number
  tipo: string
  descricao: string
  jogador_id: string | null
  time_id: string | null
}

// Dados exemplares
const partidasExemplares: Partida[] = [
  {
    id: "1",
    time_casa_id: "1",
    time_visitante_id: "2",
    gols_casa: 2,
    gols_visitante: 1,
    data_partida: "2023-08-15T15:00:00Z",
    campeonato: "Divisão D",
    rodada: 1,
    finalizada: true,
    estadio_id: null,
    publico: 15000,
    renda: 450000,
  },
  {
    id: "2",
    time_casa_id: "3",
    time_visitante_id: "1",
    gols_casa: 0,
    gols_visitante: 3,
    data_partida: "2023-08-22T15:00:00Z",
    campeonato: "Divisão D",
    rodada: 2,
    finalizada: true,
    estadio_id: null,
    publico: 12000,
    renda: 360000,
  },
  {
    id: "3",
    time_casa_id: "1",
    time_visitante_id: "4",
    gols_casa: 1,
    gols_visitante: 1,
    data_partida: "2023-08-29T15:00:00Z",
    campeonato: "Divisão D",
    rodada: 3,
    finalizada: true,
    estadio_id: null,
    publico: 18000,
    renda: 540000,
  },
]

const eventosPartidaExemplares: EventoPartida[] = [
  {
    id: "1",
    partida_id: "1",
    minuto: 23,
    tipo: "gol",
    descricao: "Gol de Paulo Henrique para o Fúria FC!",
    jogador_id: "6",
    time_id: "1",
  },
  {
    id: "2",
    partida_id: "1",
    minuto: 45,
    tipo: "gol",
    descricao: "Gol de Marcos Pereira para o Fúria FC!",
    jogador_id: "5",
    time_id: "1",
  },
  {
    id: "3",
    partida_id: "1",
    minuto: 78,
    tipo: "gol",
    descricao: "Gol de João Silva para o Estrela SC!",
    jogador_id: null,
    time_id: "2",
  },
]

// Funções da API
export async function buscarPartidas(temporada?: number, divisao?: string): Promise<Partida[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  let partidas = [...partidasExemplares]

  if (divisao) {
    partidas = partidas.filter((p) => p.campeonato === `Divisão ${divisao}`)
  }

  return partidas
}

export async function buscarPartidaPorId(id: string): Promise<Partida | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 200))

  const partida = partidasExemplares.find((p) => p.id === id)
  return partida || null
}

export async function buscarPartidaPorRodada(
  timeId: string,
  rodada: number,
  temporada: number,
  divisao: string,
): Promise<Partida | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 250))

  const partida = partidasExemplares.find(
    (p) =>
      (p.time_casa_id === timeId || p.time_visitante_id === timeId) &&
      p.rodada === rodada &&
      p.campeonato === `Divisão ${divisao}`,
  )

  return partida || null
}

export async function criarPartida(partida: Omit<Partida, "id">): Promise<Partida> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const novaPartida: Partida = {
    ...partida,
    id: uuidv4(),
  }

  // Em uma implementação real, salvaria no banco de dados
  // partidasExemplares.push(novaPartida)

  return novaPartida
}

export async function finalizarPartida(
  partidaId: string,
  placarCasa: number,
  placarVisitante: number,
): Promise<Partida | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = partidasExemplares.findIndex((p) => p.id === partidaId)
  if (index === -1) return null

  // Em uma implementação real, atualizaria no banco de dados
  const partidaAtualizada = {
    ...partidasExemplares[index],
    gols_casa: placarCasa,
    gols_visitante: placarVisitante,
    finalizada: true,
  }

  return partidaAtualizada
}

export async function simularMinutoPartida(
  partidaId: string,
  minuto: number,
  timeCasaId: string,
  timeVisitanteId: string,
  placar: { casa: number; visitante: number },
): Promise<{
  narracao?: string
  gol?: boolean
  timeGol?: string | null
  jogadorId?: string | null
  estatisticas?: any
}> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Lógica de simulação simplificada
  let narracao = null
  let gol = false
  let timeGol = null
  let jogadorId = null

  // Simular evento de gol (5% de chance)
  if (Math.random() < 0.05) {
    gol = true
    timeGol = Math.random() < 0.5 ? timeCasaId : timeVisitanteId

    // Buscar jogador aleatório para marcar o gol
    const jogadores = await buscarJogadoresPorTimeId(timeGol)
    if (jogadores.length > 0) {
      const jogador = jogadores[Math.floor(Math.random() * jogadores.length)]
      jogadorId = jogador.id
      narracao = `${minuto}' GOOOOL! ${jogador.nome} marca para o ${timeGol === timeCasaId ? "time da casa" : "time visitante"}!`
    } else {
      narracao = `${minuto}' GOOOOL do ${timeGol === timeCasaId ? "time da casa" : "time visitante"}!`
    }
  } else if (Math.random() < 0.2) {
    // Outros eventos aleatórios
    const eventos = [
      `${minuto}' Escanteio para o ${Math.random() < 0.5 ? "time da casa" : "time visitante"}.`,
      `${minuto}' Falta dura no meio de campo.`,
      `${minuto}' Boa jogada pela lateral.`,
      `${minuto}' Chute de fora da área, mas a bola vai para fora.`,
      `${minuto}' O goleiro faz uma boa defesa!`,
    ]
    narracao = eventos[Math.floor(Math.random() * eventos.length)]
  }

  // Estatísticas simuladas
  const estatisticas = {
    posseBola: {
      casa: Math.max(0, Math.min(100, 50 + (Math.random() - 0.5) * 10)),
      visitante: Math.max(0, Math.min(100, 50 + (Math.random() - 0.5) * 10)),
    },
    chutes: {
      casa: Math.floor(Math.random() * 2),
      visitante: Math.floor(Math.random() * 2),
    },
    chutesNoGol: {
      casa: Math.floor(Math.random() * 1),
      visitante: Math.floor(Math.random() * 1),
    },
    escanteios: {
      casa: Math.floor(Math.random() * 1),
      visitante: Math.floor(Math.random() * 1),
    },
    faltas: {
      casa: Math.floor(Math.random() * 3),
      visitante: Math.floor(Math.random() * 3),
    },
    cartoes: {
      casa: { amarelos: 0, vermelhos: 0 },
      visitante: { amarelos: 0, vermelhos: 0 },
    },
  }

  return {
    narracao,
    gol,
    timeGol,
    jogadorId,
    estatisticas,
  }
}

// Função auxiliar para simular busca de jogadores por time
async function buscarJogadoresPorTimeId(timeId: string) {
  // Retorna jogadores fictícios para simulação
  return [
    { id: "j1", nome: "Jogador 1" },
    { id: "j2", nome: "Jogador 2" },
    { id: "j3", nome: "Jogador 3" },
  ]
}
