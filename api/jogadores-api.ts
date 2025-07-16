/**
 * API para gerenciamento de jogadores
 * Fornece funções para buscar, criar e atualizar jogadores
 */
import { v4 as uuidv4 } from "uuid"

// Tipos
export interface Jogador {
  id: string
  nome: string
  idade: number
  posicao: string
  forca: number
  moral: number
  condicao: number
  salario: number
  valor_mercado: number
  time_id: string | null
  titular: boolean
  contrato_inicio: string
  contrato_fim: string
}

// Dados exemplares
const jogadoresExemplares: Jogador[] = [
  {
    id: "1",
    nome: "Carlos Silva",
    idade: 25,
    posicao: "GOL",
    forca: 82,
    moral: 90,
    condicao: 95,
    salario: 120000,
    valor_mercado: 8500000,
    time_id: "1",
    titular: true,
    contrato_inicio: "2023-01-01",
    contrato_fim: "2025-12-31",
  },
  {
    id: "2",
    nome: "Roberto Almeida",
    idade: 28,
    posicao: "ZAG",
    forca: 80,
    moral: 85,
    condicao: 90,
    salario: 100000,
    valor_mercado: 7200000,
    time_id: "1",
    titular: true,
    contrato_inicio: "2022-06-01",
    contrato_fim: "2024-05-31",
  },
  {
    id: "3",
    nome: "Lucas Oliveira",
    idade: 22,
    posicao: "LD",
    forca: 78,
    moral: 88,
    condicao: 92,
    salario: 85000,
    valor_mercado: 6500000,
    time_id: "1",
    titular: true,
    contrato_inicio: "2023-01-15",
    contrato_fim: "2026-01-14",
  },
  {
    id: "4",
    nome: "Fernando Santos",
    idade: 30,
    posicao: "VOL",
    forca: 83,
    moral: 87,
    condicao: 88,
    salario: 130000,
    valor_mercado: 9000000,
    time_id: "1",
    titular: true,
    contrato_inicio: "2021-07-01",
    contrato_fim: "2024-06-30",
  },
  {
    id: "5",
    nome: "Marcos Pereira",
    idade: 24,
    posicao: "MEI",
    forca: 85,
    moral: 92,
    condicao: 94,
    salario: 150000,
    valor_mercado: 12000000,
    time_id: "1",
    titular: true,
    contrato_inicio: "2022-01-01",
    contrato_fim: "2025-12-31",
  },
  {
    id: "6",
    nome: "Paulo Henrique",
    idade: 26,
    posicao: "ATA",
    forca: 87,
    moral: 90,
    condicao: 93,
    salario: 180000,
    valor_mercado: 15000000,
    time_id: "1",
    titular: true,
    contrato_inicio: "2022-08-15",
    contrato_fim: "2026-08-14",
  },
]

// Jogadores no mercado
export const jogadoresMercado = [
  {
    id: "101",
    nome: "Ricardo Oliveira",
    idade: 24,
    posicao: "ATA",
    forca: 82,
    valor: 12500000,
    time: "Libertad",
  },
  {
    id: "102",
    nome: "Fernando Gomes",
    idade: 22,
    posicao: "MEI",
    forca: 78,
    valor: 8700000,
    time: "River Plate",
  },
  {
    id: "103",
    nome: "Júlio César",
    idade: 26,
    posicao: "ZAG",
    forca: 80,
    valor: 9200000,
    time: "Peñarol",
  },
  {
    id: "104",
    nome: "Marcelo Santos",
    idade: 21,
    posicao: "LD",
    forca: 76,
    valor: 6500000,
    time: "Nacional",
  },
  {
    id: "105",
    nome: "Paulo Henrique",
    idade: 25,
    posicao: "GOL",
    forca: 81,
    valor: 10000000,
    time: "Olimpia",
  },
]

// Funções da API
export async function buscarJogadoresPorTimeId(timeId: string): Promise<Jogador[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  return jogadoresExemplares.filter((jogador) => jogador.time_id === timeId)
}

export async function buscarJogadorPorId(id: string): Promise<Jogador | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 200))

  const jogador = jogadoresExemplares.find((j) => j.id === id)
  return jogador || null
}

export async function criarJogador(jogador: Omit<Jogador, "id">): Promise<Jogador> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const novoJogador: Jogador = {
    ...jogador,
    id: uuidv4(),
  }

  // Em uma implementação real, salvaria no banco de dados
  // jogadoresExemplares.push(novoJogador)

  return novoJogador
}

export async function atualizarJogador(id: string, jogador: Partial<Jogador>): Promise<Jogador | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = jogadoresExemplares.findIndex((j) => j.id === id)
  if (index === -1) return null

  // Em uma implementação real, atualizaria no banco de dados
  // const jogadorAtualizado = { ...jogadoresExemplares[index], ...jogador }
  // jogadoresExemplares[index] = jogadorAtualizado

  return { ...jogadoresExemplares[index], ...jogador }
}

export async function buscarJogadoresNoMercado(termo?: string): Promise<typeof jogadoresMercado> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!termo) return jogadoresMercado

  const termoBusca = termo.toLowerCase()
  return jogadoresMercado.filter(
    (jogador) => jogador.nome.toLowerCase().includes(termoBusca) || jogador.posicao.toLowerCase().includes(termoBusca),
  )
}

export async function gerarJogadoresAleatorios(timeId: string): Promise<Jogador[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const nomes = ["João", "Pedro", "Maria", "Ana", "Carlos", "Lucas", "Sofia", "Isabela"]
  const sobrenomes = ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Rodrigues", "Almeida", "Machado"]
  const posicoes = ["GOL", "ZAG", "LAT", "VOL", "MEI", "ATA"]

  const novosJogadores: Jogador[] = Array.from({ length: 11 }, (_, i) => {
    const nome = `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]}`
    const posicao = posicoes[Math.floor(Math.random() * posicoes.length)]
    const forca = Math.floor(Math.random() * 30) + 70
    const valor_mercado = forca * 100000

    return {
      id: uuidv4(),
      nome,
      idade: Math.floor(Math.random() * 15) + 20,
      posicao,
      forca,
      moral: Math.floor(Math.random() * 100),
      condicao: Math.floor(Math.random() * 100),
      salario: Math.floor(Math.random() * 100000),
      valor_mercado,
      time_id: timeId,
      titular: i < 11,
      contrato_inicio: new Date().toISOString().slice(0, 10),
      contrato_fim: new Date(new Date().getTime() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    }
  })

  return novosJogadores
}
