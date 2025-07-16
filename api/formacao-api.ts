/**
 * API para gerenciamento de formações táticas
 * Fornece funções para buscar e atualizar formações
 */
import { v4 as uuidv4 } from "uuid"

// Tipos
export interface Formacao {
  id: string
  time_id: string
  nome: string
  estilo_jogo: string | null
  nivel_pressao: string | null
  tipo_marcacao: string | null
  tipo_passe: string | null
  ativa: boolean
}

export interface PosicaoFormacao {
  id: string
  formacao_id: string
  jogador_id: string | null
  posicao_x: number
  posicao_y: number
  ordem: number
}

// Dados exemplares
const formacoesExemplares: Formacao[] = [
  {
    id: "1",
    time_id: "1",
    nome: "4-4-2",
    estilo_jogo: "equilibrado",
    nivel_pressao: "média",
    tipo_marcacao: "por zona",
    tipo_passe: "curto",
    ativa: true,
  },
  {
    id: "2",
    time_id: "1",
    nome: "4-3-3",
    estilo_jogo: "ofensivo",
    nivel_pressao: "alta",
    tipo_marcacao: "individual",
    tipo_passe: "misto",
    ativa: false,
  },
]

const posicoesFormacaoExemplares: PosicaoFormacao[] = [
  // Posições para 4-4-2
  { id: "1", formacao_id: "1", jogador_id: "1", posicao_x: 50, posicao_y: 5, ordem: 1 },
  { id: "2", formacao_id: "1", jogador_id: "2", posicao_x: 30, posicao_y: 15, ordem: 2 },
  { id: "3", formacao_id: "1", jogador_id: "3", posicao_x: 70, posicao_y: 15, ordem: 3 },
  { id: "4", formacao_id: "1", jogador_id: "4", posicao_x: 10, posicao_y: 20, ordem: 4 },
  { id: "5", formacao_id: "1", jogador_id: "5", posicao_x: 90, posicao_y: 20, ordem: 5 },
  { id: "6", formacao_id: "1", jogador_id: "6", posicao_x: 30, posicao_y: 40, ordem: 6 },
  { id: "7", formacao_id: "1", jogador_id: null, posicao_x: 50, posicao_y: 35, ordem: 7 },
  { id: "8", formacao_id: "1", jogador_id: null, posicao_x: 70, posicao_y: 40, ordem: 8 },
  { id: "9", formacao_id: "1", jogador_id: null, posicao_x: 50, posicao_y: 50, ordem: 9 },
  { id: "10", formacao_id: "1", jogador_id: null, posicao_x: 35, posicao_y: 75, ordem: 10 },
  { id: "11", formacao_id: "1", jogador_id: null, posicao_x: 65, posicao_y: 75, ordem: 11 },
]

// Coordenadas para diferentes formações
export const coordenadasFormacoes: Record<string, { x: number; y: number }[]> = {
  "4-4-2": [
    // Goleiro
    { x: 50, y: 5 },
    // Zagueiros
    { x: 30, y: 15 },
    { x: 70, y: 15 },
    // Laterais
    { x: 10, y: 20 },
    { x: 90, y: 20 },
    // Meio-campistas
    { x: 30, y: 40 },
    { x: 50, y: 35 },
    { x: 70, y: 40 },
    { x: 50, y: 50 },
    // Atacantes
    { x: 35, y: 75 },
    { x: 65, y: 75 },
  ],
  "4-3-3": [
    // Goleiro
    { x: 50, y: 5 },
    // Zagueiros
    { x: 30, y: 15 },
    { x: 70, y: 15 },
    // Laterais
    { x: 10, y: 20 },
    { x: 90, y: 20 },
    // Meio-campistas
    { x: 30, y: 40 },
    { x: 50, y: 35 },
    { x: 70, y: 40 },
    // Atacantes
    { x: 20, y: 75 },
    { x: 50, y: 80 },
    { x: 80, y: 75 },
  ],
  "3-5-2": [
    // Goleiro
    { x: 50, y: 5 },
    // Zagueiros
    { x: 30, y: 15 },
    { x: 50, y: 15 },
    { x: 70, y: 15 },
    // Meio-campistas
    { x: 10, y: 30 },
    { x: 30, y: 40 },
    { x: 50, y: 35 },
    { x: 70, y: 40 },
    { x: 90, y: 30 },
    // Atacantes
    { x: 35, y: 75 },
    { x: 65, y: 75 },
  ],
  "5-3-2": [
    // Goleiro
    { x: 50, y: 5 },
    // Zagueiros
    { x: 30, y: 15 },
    { x: 50, y: 15 },
    { x: 70, y: 15 },
    // Laterais
    { x: 10, y: 20 },
    { x: 90, y: 20 },
    // Meio-campistas
    { x: 30, y: 45 },
    { x: 50, y: 40 },
    { x: 70, y: 45 },
    // Atacantes
    { x: 35, y: 75 },
    { x: 65, y: 75 },
  ],
}

// Funções da API
export async function buscarFormacoesPorTimeId(timeId: string): Promise<Formacao[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  return formacoesExemplares.filter((f) => f.time_id === timeId)
}

export async function buscarFormacaoAtiva(timeId: string): Promise<Formacao | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 250))

  const formacao = formacoesExemplares.find((f) => f.time_id === timeId && f.ativa)
  return formacao || null
}

export async function criarFormacao(formacao: Omit<Formacao, "id">): Promise<Formacao> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const novaFormacao: Formacao = {
    ...formacao,
    id: uuidv4(),
  }

  // Em uma implementação real, salvaria no banco de dados
  // formacoesExemplares.push(novaFormacao)

  return novaFormacao
}

export async function atualizarFormacao(id: string, formacao: Partial<Formacao>): Promise<Formacao | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = formacoesExemplares.findIndex((f) => f.id === id)
  if (index === -1) return null

  // Em uma implementação real, atualizaria no banco de dados
  const formacaoAtualizada = { ...formacoesExemplares[index], ...formacao }

  return formacaoAtualizada
}

export async function buscarPosicoesFormacao(formacaoId: string): Promise<PosicaoFormacao[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  return posicoesFormacaoExemplares.filter((p) => p.formacao_id === formacaoId)
}

export async function definirJogadorNaPosicao(
  posicaoId: string,
  jogadorId: string | null,
): Promise<PosicaoFormacao | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 250))

  const index = posicoesFormacaoExemplares.findIndex((p) => p.id === posicaoId)
  if (index === -1) return null

  // Em uma implementação real, atualizaria no banco de dados
  const posicaoAtualizada = { ...posicoesFormacaoExemplares[index], jogador_id: jogadorId }

  return posicaoAtualizada
}

export async function criarPosicoesParaFormacao(formacaoId: string, nomeFormacao: string): Promise<PosicaoFormacao[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const coordenadas = coordenadasFormacoes[nomeFormacao]
  if (!coordenadas) {
    throw new Error(`Formação ${nomeFormacao} não suportada`)
  }

  const posicoes: PosicaoFormacao[] = coordenadas.map((coord, index) => ({
    id: uuidv4(),
    formacao_id: formacaoId,
    posicao_x: coord.x,
    posicao_y: coord.y,
    ordem: index + 1,
    jogador_id: null,
  }))

  // Em uma implementação real, salvaria no banco de dados

  return posicoes
}
