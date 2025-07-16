/**
 * API para gerenciamento de times
 * Fornece funções para buscar, criar e atualizar times
 */
import { v4 as uuidv4 } from "uuid"

// Tipos
export interface Time {
  id: string
  nome: string
  logo?: string | null
  nome_estadio?: string | null
  cor_primaria?: string | null
  cor_secundaria?: string | null
  fundacao?: string | null
  cidade?: string | null
  pais?: string | null
  saldo_financeiro: number
  divisao: string
  reputacao?: number
}

// Dados exemplares
const timesExemplares: Time[] = [
  {
    id: "1",
    nome: "Fúria FC",
    logo: "/placeholder.svg?height=64&width=64",
    nome_estadio: "Arena da Fúria",
    cor_primaria: "#FF0000",
    cor_secundaria: "#000000",
    fundacao: "2002",
    cidade: "São Paulo",
    pais: "Brasil",
    saldo_financeiro: 25000000,
    divisao: "D",
    reputacao: 75,
  },
  {
    id: "2",
    nome: "Estrela SC",
    logo: "/placeholder.svg?height=64&width=64",
    nome_estadio: "Estádio Estelar",
    cor_primaria: "#0000FF",
    cor_secundaria: "#FFFFFF",
    fundacao: "1998",
    cidade: "Rio de Janeiro",
    pais: "Brasil",
    saldo_financeiro: 18000000,
    divisao: "D",
    reputacao: 70,
  },
  {
    id: "3",
    nome: "Raio FC",
    logo: "/placeholder.svg?height=64&width=64",
    nome_estadio: "Estádio Relâmpago",
    cor_primaria: "#FFFF00",
    cor_secundaria: "#000000",
    fundacao: "2005",
    cidade: "Belo Horizonte",
    pais: "Brasil",
    saldo_financeiro: 15000000,
    divisao: "D",
    reputacao: 65,
  },
  {
    id: "4",
    nome: "Trovão United",
    logo: "/placeholder.svg?height=64&width=64",
    nome_estadio: "Arena Trovão",
    cor_primaria: "#800080",
    cor_secundaria: "#FFFFFF",
    fundacao: "2001",
    cidade: "Porto Alegre",
    pais: "Brasil",
    saldo_financeiro: 20000000,
    divisao: "D",
    reputacao: 72,
  },
]

// Funções da API
export async function buscarTimes(divisao?: string): Promise<Time[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (divisao) {
    return timesExemplares.filter((time) => time.divisao === divisao)
  }

  return timesExemplares
}

export async function buscarTimePorId(id: string): Promise<Time | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 200))

  const time = timesExemplares.find((t) => t.id === id)
  return time || null
}

export async function criarTime(time: Omit<Time, "id">): Promise<Time> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const novoTime: Time = {
    ...time,
    id: uuidv4(),
  }

  // Em uma implementação real, salvaria no banco de dados
  // timesExemplares.push(novoTime)

  return novoTime
}

export async function atualizarTime(id: string, time: Partial<Time>): Promise<Time | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = timesExemplares.findIndex((t) => t.id === id)
  if (index === -1) return null

  // Em uma implementação real, atualizaria no banco de dados
  // const timeAtualizado = { ...timesExemplares[index], ...time }
  // timesExemplares[index] = timeAtualizado

  return { ...timesExemplares[index], ...time }
}

export async function gerarNomeTimeAleatorio(): Promise<string> {
  const nomes = ["Fúria", "Estrela", "Raio", "Trovão", "Águia", "Leão", "Tigre", "Dragão", "Guerreiro", "Invencível"]
  const sufixos = ["FC", "SC", "EC", "AC", "United", "City", "Real", "Nacional", "Internacional", "Atlético"]

  const nomeAleatorio = `${nomes[Math.floor(Math.random() * nomes.length)]} ${sufixos[Math.floor(Math.random() * sufixos.length)]}`
  return nomeAleatorio
}
