/**
 * Serviço para gerenciamento de jogadores
 * Fornece funções para criar, buscar e atualizar jogadores
 */
import { obterClienteSupabase } from "@/lib/supabase/cliente"
import type { Database } from "@/lib/supabase/tipos-banco"
import { validate as isUuid } from "uuid"

type Jogador = Database["public"]["Tables"]["jogadores"]["Row"]
type JogadorInsert = Database["public"]["Tables"]["jogadores"]["Insert"]
type JogadorUpdate = Database["public"]["Tables"]["jogadores"]["Update"]

export async function buscarJogadoresPorTimeId(timeId: string) {
  // Validate if timeId is a proper UUID
  if (!timeId || (timeId && !isUuid(timeId))) {
    console.warn(`ID do time inválido ou não é um UUID: ${timeId}`)
    return [] // Return empty array instead of throwing an error
  }

  const supabase = obterClienteSupabase()
  const { data, error } = await supabase
    .from("jogadores")
    .select("*")
    .eq("time_id", timeId)
    .order("forca", { ascending: false })

  if (error) {
    console.error(`Erro ao buscar jogadores do time ${timeId}:`, error)
    throw error
  }

  return data || []
}

export async function buscarJogadorPorId(id: string) {
  if (!id || (id && !isUuid(id))) {
    console.warn(`ID do jogador inválido ou não é um UUID: ${id}`)
    return null
  }

  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("jogadores").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar jogador com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function criarJogador(jogador: JogadorInsert) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("jogadores").insert(jogador).select().single()

  if (error) {
    console.error("Erro ao criar jogador:", error)
    throw error
  }

  return data
}

export async function atualizarJogador(id: string, jogador: JogadorUpdate) {
  if (!id || (id && !isUuid(id))) {
    console.warn(`ID do jogador inválido ou não é um UUID: ${id}`)
    return null
  }

  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("jogadores").update(jogador).eq("id", id).select().single()

  if (error) {
    console.error(`Erro ao atualizar jogador com ID ${id}:`, error)
    throw error
  }

  return data
}

export async function definirTitular(id: string, titular: boolean) {
  return atualizarJogador(id, { titular })
}

export async function gerarJogadoresAleatorios(timeId: string, quantidade = 22) {
  if (!timeId || (timeId && !isUuid(timeId))) {
    console.warn(`ID do time inválido ou não é um UUID: ${timeId}`)
    throw new Error(`ID do time inválido: ${timeId}`)
  }

  const jogadores: JogadorInsert[] = []

  // Nomes para gerar aleatoriamente
  const nomesPrimeiro = [
    "João",
    "Pedro",
    "Carlos",
    "Lucas",
    "Marcos",
    "Rafael",
    "André",
    "Gustavo",
    "Thiago",
    "Roberto",
    "Felipe",
    "Rodrigo",
    "Bruno",
    "Matheus",
    "Vitor",
    "Leonardo",
    "Gabriel",
    "Diego",
    "Alexandre",
    "Leandro",
    "Ricardo",
    "Fernando",
    "Marcelo",
    "Fábio",
  ]

  const nomesSobrenome = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Lima",
    "Pereira",
    "Costa",
    "Martins",
    "Ferreira",
    "Almeida",
    "Rodrigues",
    "Gomes",
    "Ribeiro",
    "Carvalho",
    "Lopes",
    "Dias",
    "Nascimento",
    "Andrade",
    "Barbosa",
    "Rocha",
    "Moreira",
    "Alves",
    "Teixeira",
    "Correia",
  ]

  // Posições e quantidades aproximadas para um elenco equilibrado
  const posicoes = [
    { posicao: "GOL", quantidade: 3 },
    { posicao: "ZAG", quantidade: 4 },
    { posicao: "LD", quantidade: 2 },
    { posicao: "LE", quantidade: 2 },
    { posicao: "VOL", quantidade: 3 },
    { posicao: "MC", quantidade: 3 },
    { posicao: "MEI", quantidade: 2 },
    { posicao: "PE", quantidade: 1 },
    { posicao: "PD", quantidade: 1 },
    { posicao: "ATA", quantidade: 3 },
  ]

  let jogadoresCriados = 0
  let posicaoIndex = 0

  // Data atual para contratos
  const dataAtual = new Date()
  const anoAtual = dataAtual.getFullYear()

  while (jogadoresCriados < quantidade) {
    const posicaoAtual = posicoes[posicaoIndex]
    const posicao = posicaoAtual.posicao

    // Gerar atributos baseados na posição
    const idade = Math.floor(Math.random() * 15) + 18 // 18 a 32 anos
    const forca = Math.floor(Math.random() * 15) + 70 // 70 a 84 de força
    const moral = Math.floor(Math.random() * 20) + 75 // 75 a 94 de moral
    const condicao = Math.floor(Math.random() * 15) + 85 // 85 a 99 de condição

    // Salário baseado na força e idade
    const salarioBase = 5000 + forca * 1000
    const salario = idade > 30 ? salarioBase * 0.8 : salarioBase

    // Valor de mercado baseado na força, idade e posição
    let multiplicadorPosicao = 1
    if (posicao === "ATA" || posicao === "MEI") multiplicadorPosicao = 1.5
    if (posicao === "GOL" && idade > 30) multiplicadorPosicao = 0.8

    const valorMercado = salario * 24 * multiplicadorPosicao * (idade < 25 ? 1.3 : 1)

    // Gerar datas de contrato (1-4 anos)
    const duracaoContrato = Math.floor(Math.random() * 3) + 1
    const contratoInicio = new Date(dataAtual)
    const contratoFim = new Date(dataAtual)
    contratoFim.setFullYear(anoAtual + duracaoContrato)

    // Gerar nome aleatório
    const nomePrimeiro = nomesPrimeiro[Math.floor(Math.random() * nomesPrimeiro.length)]
    const nomeSobrenome = nomesSobrenome[Math.floor(Math.random() * nomesSobrenome.length)]
    const nome = `${nomePrimeiro} ${nomeSobrenome}`

    // Criar jogador
    jogadores.push({
      nome,
      idade,
      posicao,
      forca,
      moral,
      condicao,
      salario,
      valor_mercado: valorMercado,
      time_id: timeId,
      titular: jogadoresCriados < 11, // Primeiros 11 são titulares
      contrato_inicio: contratoInicio.toISOString().split("T")[0],
      contrato_fim: contratoFim.toISOString().split("T")[0],
    })

    jogadoresCriados++

    // Avançar para a próxima posição se já criamos o suficiente desta
    if (jogadoresCriados % posicaoAtual.quantidade === 0) {
      posicaoIndex = (posicaoIndex + 1) % posicoes.length
    }
  }

  // Inserir todos os jogadores no banco
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("jogadores").insert(jogadores).select()

  if (error) {
    console.error("Erro ao criar jogadores aleatórios:", error)
    throw error
  }

  return data
}
