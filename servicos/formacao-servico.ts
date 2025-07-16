/**
 * Serviço para gerenciamento de formações táticas
 * Fornece funções para criar e atualizar formações e posições dos jogadores
 */
import { obterClienteSupabase } from "@/lib/supabase/cliente"
import type { Database } from "@/lib/supabase/tipos-banco"
import { v4 as uuidv4 } from "uuid"

type Formacao = Database["public"]["Tables"]["formacoes"]["Row"]
type FormacaoInsert = Database["public"]["Tables"]["formacoes"]["Insert"]
type FormacaoUpdate = Database["public"]["Tables"]["formacoes"]["Update"]
type PosicaoFormacao = Database["public"]["Tables"]["posicoes_formacao"]["Row"]
type PosicaoFormacaoInsert = Database["public"]["Tables"]["posicoes_formacao"]["Insert"]
type PosicaoFormacaoUpdate = Database["public"]["Tables"]["posicoes_formacao"]["Update"]

export async function buscarFormacoesPorTimeId(timeId: string) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("formacoes").select("*").eq("time_id", timeId)

  if (error) {
    console.error(`Erro ao buscar formações do time ${timeId}:`, error)
    throw error
  }

  return data
}

export async function buscarFormacaoAtiva(timeId: string) {
  const supabase = obterClienteSupabase()

  // Buscar todas as formações ativas para o time
  const { data, error } = await supabase.from("formacoes").select("*").eq("time_id", timeId).eq("ativa", true)

  if (error) {
    console.error(`Erro ao buscar formação ativa do time ${timeId}:`, error)
    throw error
  }

  // Se não houver formação ativa, criar uma padrão
  if (!data || data.length === 0) {
    console.log(`Nenhuma formação ativa encontrada para o time ${timeId}. Criando formação padrão.`)
    return await criarFormacaoPadrao(timeId)
  }

  // Se houver múltiplas formações ativas, manter apenas a primeira
  if (data.length > 1) {
    console.log(`Múltiplas formações ativas encontradas para o time ${timeId}. Mantendo apenas a primeira.`)

    // Desativar todas as outras formações
    const formacoesParaDesativar = data.slice(1).map((f) => f.id)

    if (formacoesParaDesativar.length > 0) {
      await supabase.from("formacoes").update({ ativa: false }).in("id", formacoesParaDesativar)
    }
  }

  // Retornar a primeira formação ativa
  return data[0]
}

// Função para criar uma formação padrão quando não existe nenhuma
async function criarFormacaoPadrao(timeId: string) {
  const formacaoPadrao: FormacaoInsert = {
    id: uuidv4(),
    time_id: timeId,
    nome: "4-4-2",
    ativa: true,
    criado_em: new Date().toISOString(),
  }

  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("formacoes").insert(formacaoPadrao).select().single()

  if (error) {
    console.error(`Erro ao criar formação padrão para o time ${timeId}:`, error)
    throw error
  }

  // Criar posições para a formação
  await criarPosicoesParaFormacao(data.id, data.nome)

  return data
}

export async function criarFormacao(formacao: FormacaoInsert) {
  const supabase = obterClienteSupabase()

  // Se a formação for ativa, desativar todas as outras
  if (formacao.ativa) {
    await supabase.from("formacoes").update({ ativa: false }).eq("time_id", formacao.time_id)
  }

  const { data, error } = await supabase.from("formacoes").insert(formacao).select().single()

  if (error) {
    console.error("Erro ao criar formação:", error)
    throw error
  }

  return data
}

export async function atualizarFormacao(id: string, formacao: FormacaoUpdate) {
  const supabase = obterClienteSupabase()

  // Se a formação for ativa, desativar todas as outras
  if (formacao.ativa) {
    const { data: formacaoAtual } = await supabase.from("formacoes").select("time_id").eq("id", id).single()

    await supabase.from("formacoes").update({ ativa: false }).eq("time_id", formacaoAtual.time_id).neq("id", id)
  }

  const { data, error } = await supabase.from("formacoes").update(formacao).eq("id", id).select().single()

  if (error) {
    console.error(`Erro ao atualizar formação com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function buscarPosicoesFormacao(formacaoId: string) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase
    .from("posicoes_formacao")
    .select("*, jogador:jogador_id(*)")
    .eq("formacao_id", formacaoId)
    .order("ordem", { ascending: true })

  if (error) {
    console.error(`Erro ao buscar posições da formação ${formacaoId}:`, error)
    throw error
  }

  return data
}

export async function criarPosicaoFormacao(posicao: PosicaoFormacaoInsert) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("posicoes_formacao").insert(posicao).select().single()

  if (error) {
    console.error("Erro ao criar posição na formação:", error)
    throw error
  }

  return data
}

export async function atualizarPosicaoFormacao(id: string, posicao: PosicaoFormacaoUpdate) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("posicoes_formacao").update(posicao).eq("id", id).select().single()

  if (error) {
    console.error(`Erro ao atualizar posição com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function definirJogadorNaPosicao(posicaoId: string, jogadorId: string | null) {
  return atualizarPosicaoFormacao(posicaoId, { jogador_id: jogadorId })
}

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

// Criar posições para uma formação
export async function criarPosicoesParaFormacao(formacaoId: string, nomeFormacao: string) {
  const coordenadas = coordenadasFormacoes[nomeFormacao]

  if (!coordenadas) {
    throw new Error(`Formação ${nomeFormacao} não suportada`)
  }

  const posicoes: PosicaoFormacaoInsert[] = coordenadas.map((coord, index) => ({
    formacao_id: formacaoId,
    posicao_x: coord.x,
    posicao_y: coord.y,
    ordem: index + 1,
    jogador_id: null,
  }))

  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("posicoes_formacao").insert(posicoes).select()

  if (error) {
    console.error(`Erro ao criar posições para formação ${formacaoId}:`, error)
    throw error
  }

  return data
}
