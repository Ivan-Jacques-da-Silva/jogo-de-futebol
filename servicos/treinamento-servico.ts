/**
 * Serviço para gerenciamento de treinamentos
 * Fornece funções para criar e gerenciar sessões de treinamento
 */
import { obterClienteSupabase } from "@/lib/supabase/cliente"
import type { Database } from "@/lib/supabase/tipos-banco"

type Treinamento = Database["public"]["Tables"]["treinamentos"]["Row"]
type TreinamentoInsert = Database["public"]["Tables"]["treinamentos"]["Insert"]
type JogadorTreinamento = Database["public"]["Tables"]["jogadores_treinamento"]["Row"]
type JogadorTreinamentoInsert = Database["public"]["Tables"]["jogadores_treinamento"]["Insert"]

export async function buscarTreinamentos(timeId: string) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase
    .from("treinamentos")
    .select("*")
    .eq("time_id", timeId)
    .order("data_inicio", { ascending: false })

  if (error) {
    console.error(`Erro ao buscar treinamentos do time ${timeId}:`, error)
    throw error
  }

  return data
}

export async function buscarTreinamentoPorId(id: string) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("treinamentos").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar treinamento com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function criarTreinamento(treinamento: TreinamentoInsert) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("treinamentos").insert(treinamento).select().single()

  if (error) {
    console.error("Erro ao criar treinamento:", error)
    throw error
  }

  return data
}

export async function finalizarTreinamento(id: string) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase
    .from("treinamentos")
    .update({
      data_fim: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Erro ao finalizar treinamento com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function buscarJogadoresEmTreinamento(treinamentoId: string) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase
    .from("jogadores_treinamento")
    .select("*, jogador:jogador_id(*)")
    .eq("treinamento_id", treinamentoId)

  if (error) {
    console.error(`Erro ao buscar jogadores do treinamento ${treinamentoId}:`, error)
    throw error
  }

  return data
}

export async function adicionarJogadorAoTreinamento(jogadorTreinamento: JogadorTreinamentoInsert) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("jogadores_treinamento").insert(jogadorTreinamento).select().single()

  if (error) {
    console.error("Erro ao adicionar jogador ao treinamento:", error)
    throw error
  }

  return data
}

export async function adicionarJogadoresAoTreinamento(treinamentoId: string, jogadorIds: string[]) {
  const jogadoresTreinamento = jogadorIds.map((jogadorId) => ({
    treinamento_id: treinamentoId,
    jogador_id: jogadorId,
    ganho_atributo: 0,
    perda_condicao: 0,
  }))

  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("jogadores_treinamento").insert(jogadoresTreinamento).select()

  if (error) {
    console.error("Erro ao adicionar jogadores ao treinamento:", error)
    throw error
  }

  return data
}

export async function aplicarResultadosTreinamento(treinamentoId: string) {
  const supabase = obterClienteSupabase()

  // Buscar dados do treinamento
  const { data: treinamento, error: erroTreinamento } = await supabase
    .from("treinamentos")
    .select("*")
    .eq("id", treinamentoId)
    .single()

  if (erroTreinamento) {
    console.error(`Erro ao buscar treinamento com ID ${treinamentoId}:`, erroTreinamento)
    throw erroTreinamento
  }

  // Buscar jogadores no treinamento
  const { data: jogadoresTreinamento, error: erroJogadores } = await supabase
    .from("jogadores_treinamento")
    .select("*, jogador:jogador_id(*)")
    .eq("treinamento_id", treinamentoId)

  if (erroJogadores) {
    console.error(`Erro ao buscar jogadores do treinamento ${treinamentoId}:`, erroJogadores)
    throw erroJogadores
  }

  // Calcular ganhos e perdas com base no tipo e intensidade do treinamento
  const intensidade = treinamento.intensidade

  // Para cada jogador, calcular ganhos e atualizar atributos
  for (const jogadorTreinamento of jogadoresTreinamento) {
    const jogador = jogadorTreinamento.jogador

    // Calcular ganho de atributo (1-3 pontos dependendo da intensidade)
    const ganhoBase = Math.floor(intensidade / 2)
    const ganhoAleatorio = Math.floor(Math.random() * 2)
    const ganhoAtributo = ganhoBase + ganhoAleatorio

    // Calcular perda de condição (2-10 pontos dependendo da intensidade)
    const perdaCondicao = intensidade * 2

    // Atualizar jogador_treinamento com os ganhos/perdas
    await supabase
      .from("jogadores_treinamento")
      .update({
        ganho_atributo: ganhoAtributo,
        perda_condicao: perdaCondicao,
      })
      .eq("id", jogadorTreinamento.id)

    // Atualizar o jogador
    let novaForca = jogador.forca
    let novaCondicao = Math.max(jogador.condicao - perdaCondicao, 50)

    // Aplicar ganho de atributo com base no tipo de treinamento
    switch (treinamento.tipo) {
      case "fisico":
        // Aumenta principalmente a condição física
        novaCondicao = Math.min(novaCondicao + ganhoAtributo * 2, 100)
        novaForca = Math.min(novaForca + Math.floor(ganhoAtributo / 2), 100)
        break
      case "tecnico":
        // Aumenta principalmente a força técnica
        novaForca = Math.min(novaForca + ganhoAtributo, 100)
        break
      case "tatico":
        // Aumenta um pouco de tudo
        novaForca = Math.min(novaForca + Math.floor(ganhoAtributo / 2), 100)
        novaCondicao = Math.min(novaCondicao + Math.floor(ganhoAtributo / 2), 100)
        break
    }

    // Atualizar o jogador
    await supabase
      .from("jogadores")
      .update({
        forca: novaForca,
        condicao: novaCondicao,
      })
      .eq("id", jogador.id)
  }

  // Finalizar o treinamento
  return finalizarTreinamento(treinamentoId)
}
