/**
 * Serviço para gerenciamento de estádios
 * Fornece funções para criar, buscar e atualizar estádios
 */
import { obterClienteSupabase } from "@/lib/supabase/cliente"
import type { Database } from "@/lib/supabase/tipos-banco"

type Estadio = Database["public"]["Tables"]["estadios"]["Row"]
type EstadioInsert = Database["public"]["Tables"]["estadios"]["Insert"]
type EstadioUpdate = Database["public"]["Tables"]["estadios"]["Update"]

export async function buscarEstadioPorTimeId(timeId: string) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("estadios").select("*").eq("time_id", timeId).single()

  if (error) {
    console.error(`Erro ao buscar estádio do time ${timeId}:`, error)
    throw error
  }

  return data
}

export async function criarEstadio(estadio: EstadioInsert) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("estadios").insert(estadio).select().single()

  if (error) {
    console.error("Erro ao criar estádio:", error)
    throw error
  }

  return data
}

export async function atualizarEstadio(id: string, estadio: EstadioUpdate) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("estadios").update(estadio).eq("id", id).select().single()

  if (error) {
    console.error(`Erro ao atualizar estádio com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function realizarReformaEstadio(
  id: string,
  tipo: "capacidade" | "estrutura" | "gramado" | "iluminacao" | "seguranca" | "vestiarios",
  custo: number,
  timeId: string,
) {
  // Primeiro, verificamos se o time tem saldo suficiente
  const supabase = obterClienteSupabase()
  const { data: time, error: timeError } = await supabase
    .from("times")
    .select("saldo_financeiro")
    .eq("id", timeId)
    .single()

  if (timeError) {
    console.error(`Erro ao buscar saldo do time ${timeId}:`, timeError)
    throw timeError
  }

  if (time.saldo_financeiro < custo) {
    throw new Error("Saldo insuficiente para realizar a reforma")
  }

  // Buscar dados do estádio atual
  const { data: estadioAtual, error: estadioError } = await supabase.from("estadios").select("*").eq("id", id).single()

  if (estadioError) {
    console.error(`Erro ao buscar estádio com ID ${id}:`, estadioError)
    throw estadioError
  }

  // Iniciar transação para atualizar o estádio e registrar a despesa
  const atualizacoes: Record<string, any> = {
    ultima_reforma: new Date().toISOString().split("T")[0],
  }

  // Definir qual campo será atualizado com base no tipo de reforma
  switch (tipo) {
    case "capacidade":
      // Aumentar capacidade em 10%
      atualizacoes.capacidade = Math.floor(estadioAtual.capacidade * 1.1)
      break
    case "estrutura":
      atualizacoes.nivel_estrutura = Math.min(estadioAtual.nivel_estrutura + 1, 5)
      break
    case "gramado":
      atualizacoes.nivel_gramado = Math.min(estadioAtual.nivel_gramado + 1, 5)
      break
    case "iluminacao":
      atualizacoes.nivel_iluminacao = Math.min(estadioAtual.nivel_iluminacao + 1, 5)
      break
    case "seguranca":
      atualizacoes.nivel_seguranca = Math.min(estadioAtual.nivel_seguranca + 1, 5)
      break
    case "vestiarios":
      atualizacoes.nivel_vestiarios = Math.min(estadioAtual.nivel_vestiarios + 1, 5)
      break
  }

  // Atualizar o estádio
  const { data: estadioAtualizado, error: atualizacaoError } = await supabase
    .from("estadios")
    .update(atualizacoes)
    .eq("id", id)
    .select()
    .single()

  if (atualizacaoError) {
    console.error(`Erro ao atualizar estádio com ID ${id}:`, atualizacaoError)
    throw atualizacaoError
  }

  // Registrar a despesa financeira
  const { error: financaError } = await supabase.from("financas").insert({
    time_id: timeId,
    tipo: "despesa",
    categoria: "reforma_estadio",
    valor: custo,
    descricao: `Reforma de ${tipo} no estádio`,
  })

  if (financaError) {
    console.error("Erro ao registrar despesa de reforma:", financaError)
    throw financaError
  }

  // Atualizar o saldo do time
  const { error: saldoError } = await supabase
    .from("times")
    .update({
      saldo_financeiro: time.saldo_financeiro - custo,
    })
    .eq("id", timeId)

  if (saldoError) {
    console.error(`Erro ao atualizar saldo do time ${timeId}:`, saldoError)
    throw saldoError
  }

  return estadioAtualizado
}
