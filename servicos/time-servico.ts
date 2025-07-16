/**
 * Serviço para gerenciamento de times
 * Fornece funções para criar, buscar e atualizar times
 */
import { obterClienteSupabase } from "@/lib/supabase/cliente"
import type { Database } from "@/lib/supabase/tipos-banco"

type Time = Database["public"]["Tables"]["times"]["Row"]
type TimeInsert = Database["public"]["Tables"]["times"]["Insert"]
type TimeUpdate = Database["public"]["Tables"]["times"]["Update"]

export async function buscarTimes(divisao?: string) {
  try {
    const supabase = obterClienteSupabase()
    let query = supabase.from("times").select("*")

    if (divisao) {
      query = query.eq("divisao", divisao)
    }

    const { data, error } = await query

    if (error) {
      console.error("Erro ao buscar times:", error)
      throw error
    }

    // Ensure we always return an array, even if data is null
    return data || []
  } catch (erro) {
    console.error("Erro ao buscar times:", erro)
    // Return empty array instead of throwing to make the app more resilient
    return []
  }
}

export async function buscarTimePorId(id: string) {
  if (!id) {
    throw new Error(`ID do time não fornecido: ${id}`)
  }

  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("times").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar time com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function criarTime(time: TimeInsert) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("times").insert(time).select().single()

  if (error) {
    console.error("Erro ao criar time:", error)
    throw error
  }

  return data
}

export async function atualizarTime(id: string, time: TimeUpdate) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("times").update(time).eq("id", id).select().single()

  if (error) {
    console.error(`Erro ao atualizar time com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function criarTimeAdversario(nomeTime: string, divisao = "D") {
  const supabase = obterClienteSupabase()

  const novoTime: TimeInsert = {
    nome: nomeTime,
    saldo_financeiro: 1000000,
    divisao: divisao,
    reputacao: 75,
    cidade: "Cidade Genérica",
    pais: "País Genérico",
    cor_primaria: "#" + Math.floor(Math.random() * 16777215).toString(16),
    cor_secundaria: "#" + Math.floor(Math.random() * 16777215).toString(16),
    fundacao: "1900",
    nome_estadio: `Estádio de ${nomeTime}`,
  }

  const { data, error } = await supabase.from("times").insert(novoTime).select().single()

  if (error) {
    console.error("Erro ao criar time adversário:", error)
    throw error
  }

  return data
}

export async function gerarNomeTimeAleatorio(): Promise<string> {
  const nomes = ["Fúria", "Estrela", "Raio", "Trovão", "Águia", "Leão", "Tigre", "Dragão", "Guerreiro", "Invencível"]
  const sufixos = ["FC", "SC", "EC", "AC", "United", "City", "Real", "Nacional", "Internacional", "Atlético"]

  const nomeAleatorio = `${nomes[Math.floor(Math.random() * nomes.length)]} ${sufixos[Math.floor(Math.random() * sufixos.length)]}`
  return nomeAleatorio
}

/**
 * Atualiza a divisão de um time
 */
export async function atualizarDivisaoTime(id: string, novaDivisao: string) {
  return atualizarTime(id, { divisao: novaDivisao })
}
