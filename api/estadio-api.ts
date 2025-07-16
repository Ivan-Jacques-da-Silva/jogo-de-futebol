/**
 * API para gerenciamento de estádios
 * Fornece funções para buscar e atualizar estádios
 */
import { v4 as uuidv4 } from "uuid"

// Tipos
export interface Estadio {
  id: string
  time_id: string | null
  capacidade: number
  nivel_estrutura: number
  nivel_gramado: number
  nivel_iluminacao: number
  nivel_seguranca: number
  nivel_vestiarios: number
  ultima_reforma: string | null
  preco_ingresso: number
}

// Dados exemplares
const estadiosExemplares: Estadio[] = [
  {
    id: "1",
    time_id: "1",
    capacidade: 45000,
    nivel_estrutura: 3,
    nivel_gramado: 4,
    nivel_iluminacao: 3,
    nivel_seguranca: 3,
    nivel_vestiarios: 4,
    ultima_reforma: "2022-05-15",
    preco_ingresso: 45.0,
  },
]

// Funções da API
export async function buscarEstadioPorTimeId(timeId: string): Promise<Estadio | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 250))

  const estadio = estadiosExemplares.find((e) => e.time_id === timeId)
  return estadio || null
}

export async function criarEstadio(estadio: Omit<Estadio, "id">): Promise<Estadio> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const novoEstadio: Estadio = {
    ...estadio,
    id: uuidv4(),
  }

  // Em uma implementação real, salvaria no banco de dados
  // estadiosExemplares.push(novoEstadio)

  return novoEstadio
}

export async function atualizarEstadio(id: string, estadio: Partial<Estadio>): Promise<Estadio | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = estadiosExemplares.findIndex((e) => e.id === id)
  if (index === -1) return null

  // Em uma implementação real, atualizaria no banco de dados
  const estadioAtualizado = { ...estadiosExemplares[index], ...estadio }

  return estadioAtualizado
}

export async function realizarReformaEstadio(
  id: string,
  tipo: "capacidade" | "estrutura" | "gramado" | "iluminacao" | "seguranca" | "vestiarios",
  custo: number,
  timeId: string,
): Promise<Estadio | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 600))

  const estadio = await buscarEstadioPorTimeId(timeId)
  if (!estadio) return null

  // Calcular melhorias com base no tipo
  const atualizacoes: Partial<Estadio> = {
    ultima_reforma: new Date().toISOString().split("T")[0],
  }

  switch (tipo) {
    case "capacidade":
      atualizacoes.capacidade = Math.floor(estadio.capacidade * 1.1) // +10%
      break
    case "estrutura":
      atualizacoes.nivel_estrutura = Math.min(estadio.nivel_estrutura + 1, 5)
      break
    case "gramado":
      atualizacoes.nivel_gramado = Math.min(estadio.nivel_gramado + 1, 5)
      break
    case "iluminacao":
      atualizacoes.nivel_iluminacao = Math.min(estadio.nivel_iluminacao + 1, 5)
      break
    case "seguranca":
      atualizacoes.nivel_seguranca = Math.min(estadio.nivel_seguranca + 1, 5)
      break
    case "vestiarios":
      atualizacoes.nivel_vestiarios = Math.min(estadio.nivel_vestiarios + 1, 5)
      break
  }

  return atualizarEstadio(id, atualizacoes)
}
