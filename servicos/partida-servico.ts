/**
 * Serviço para gerenciamento de partidas
 * Contém funções para criar, simular e finalizar partidas
 */
import { v4 as uuidv4 } from "uuid"
import { obterClienteSupabase } from "@/lib/supabase/cliente"
import { buscarTimePorId } from "./time-servico"
import { buscarJogadoresPorTimeId } from "./jogador-servico"

/**
 * Cria uma nova partida no banco de dados
 */
export async function criarPartida(dados: {
  time_casa_id: string
  time_visitante_id: string
  data: string
  estadio_id: string | null
  campeonato: string
  rodada: number
  temporada: number // We'll keep this in the signature but not use it in the DB operation
  publico: number
  renda: number
}) {
  try {
    // Verificar se os IDs são válidos
    if (!dados.time_casa_id || !dados.time_visitante_id) {
      console.error("IDs de times inválidos:", dados.time_casa_id, dados.time_visitante_id)
      throw new Error("IDs de times inválidos")
    }

    const supabase = obterClienteSupabase()
    const id = uuidv4()
    const { data, error } = await supabase
      .from("partidas")
      .insert({
        id,
        time_casa_id: dados.time_casa_id,
        time_visitante_id: dados.time_visitante_id,
        data_partida: dados.data,
        estadio_id: dados.estadio_id,
        campeonato: dados.campeonato,
        rodada: dados.rodada,
        // Removed temporada field as it doesn't exist in the database
        gols_casa: 0,
        gols_visitante: 0,
        finalizada: false,
        publico: dados.publico,
        renda: dados.renda,
      })
      .select()

    if (error) {
      console.error("Erro ao criar partida:", error)
      throw error
    }

    return data[0]
  } catch (erro) {
    console.error("Erro ao criar partida:", erro)
    throw erro
  }
}

/**
 * Busca partidas por divisão
 */
export async function buscarPartidas(temporada: number, divisao: string) {
  try {
    const supabase = obterClienteSupabase()
    const { data, error } = await supabase
      .from("partidas")
      .select("*")
      // Removed temporada filter as the column doesn't exist in the database
      .eq("campeonato", `Divisão ${divisao}`)
      .order("rodada", { ascending: true })

    if (error) {
      console.error("Erro ao buscar partidas:", error)
      throw error
    }

    return data || []
  } catch (erro) {
    console.error("Erro ao buscar partidas:", erro)
    throw erro
  }
}

/**
 * Busca partida por rodada e divisão para um time específico
 */
export async function buscarPartidaPorRodada(timeId: string, rodada: number, temporada: number, divisao: string) {
  try {
    const supabase = obterClienteSupabase()
    const { data, error } = await supabase
      .from("partidas")
      .select("*")
      .eq("rodada", rodada)
      // Removed temporada filter as the column doesn't exist in the database
      .eq("campeonato", `Divisão ${divisao}`)
      .or(`time_casa_id.eq.${timeId},time_visitante_id.eq.${timeId}`)
      .single()

    if (error && error.code !== "PGRST116") {
      // Ignorar erro de "não encontrado"
      console.error("Erro ao buscar partida por rodada:", error)
      throw error
    }

    return data
  } catch (erro) {
    console.error("Erro ao buscar partida por rodada:", erro)
    throw erro
  }
}

/**
 * Simula um minuto da partida
 */
export async function simularMinutoPartida(
  partidaId: string,
  minuto: number,
  timeCasaId: string,
  timeVisitanteId: string,
  placar: { casa: number; visitante: number },
) {
  try {
    const eventos = []
    let gol = false
    let timeGol = null
    let jogadorId = null
    let narracao = null
    let estatisticas = null

    // Simular evento de gol
    if (Math.random() < 0.01) {
      gol = true
      timeGol = Math.random() < 0.5 ? timeCasaId : timeVisitanteId
      const jogadores = await buscarJogadoresPorTimeId(timeGol)
      jogadorId = jogadores[Math.floor(Math.random() * jogadores.length)].id
      narracao = `${minuto}' GOOOOL!`
    }

    // Simular estatísticas
    estatisticas = {
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
  } catch (erro) {
    console.error("Erro ao simular minuto da partida:", erro)
    throw erro
  }
}

/**
 * Simula uma partida completa
 */
export async function simularPartida(partidaId: string) {
  try {
    const supabase = obterClienteSupabase()

    // Buscar dados da partida
    const { data: partida, error: partidaError } = await supabase
      .from("partidas")
      .select("*")
      .eq("id", partidaId)
      .single()

    if (partidaError) {
      console.error("Erro ao buscar partida:", partidaError)
      throw partidaError
    }

    // Buscar dados dos times
    const timeCasa = await buscarTimePorId(partida.time_casa_id)
    const timeVisitante = await buscarTimePorId(partida.time_visitante_id)

    // Buscar jogadores dos times
    const jogadoresCasa = await buscarJogadoresPorTimeId(partida.time_casa_id)
    const jogadoresVisitante = await buscarJogadoresPorTimeId(partida.time_visitante_id)

    // Calcular a força dos times
    const forcaCasa = calcularForcaTime(jogadoresCasa)
    const forcaVisitante = calcularForcaTime(jogadoresVisitante)

    // Simular o resultado
    const fatorCasa = 1.2 // Vantagem de jogar em casa
    const forcaEfetivaCasa = forcaCasa * fatorCasa
    const forcaTotal = forcaEfetivaCasa + forcaVisitante

    // Probabilidade de vitória baseada na força
    const probCasa = forcaEfetivaCasa / forcaTotal

    // Simular gols
    const mediaGolsCasa = 1.5 * probCasa + 0.5
    const mediaGolsVisitante = 1.5 * (1 - probCasa) + 0.5

    // Gerar gols usando distribuição de Poisson (simplificada)
    const golsCasa = simularGols(mediaGolsCasa)
    const golsVisitante = simularGols(mediaGolsVisitante)

    // Atualizar a partida com o resultado
    const { error: updateError } = await supabase
      .from("partidas")
      .update({
        gols_casa: golsCasa,
        gols_visitante: golsVisitante,
        finalizada: true,
      })
      .eq("id", partidaId)

    if (updateError) {
      console.error("Erro ao atualizar partida:", updateError)
      throw updateError
    }

    // Registrar eventos de gols
    for (let i = 0; i < golsCasa; i++) {
      const minuto = Math.floor(Math.random() * 90) + 1
      const jogador = jogadoresCasa[Math.floor(Math.random() * jogadoresCasa.length)]

      await criarEventoPartida({
        partida_id: partidaId,
        tipo: "gol",
        minuto,
        time_id: partida.time_casa_id,
        jogador_id: jogador?.id || null,
        descricao: `${minuto}' GOOOOL do ${timeCasa.nome}! ${jogador?.nome || "Jogador"} marca para o time da casa!`,
      })
    }

    for (let i = 0; i < golsVisitante; i++) {
      const minuto = Math.floor(Math.random() * 90) + 1
      const jogador = jogadoresVisitante[Math.floor(Math.random() * jogadoresVisitante.length)]

      await criarEventoPartida({
        partida_id: partidaId,
        tipo: "gol",
        minuto,
        time_id: partida.time_visitante_id,
        jogador_id: jogador?.id || null,
        descricao: `${minuto}' GOOOOL do ${timeVisitante.nome}! ${jogador?.nome || "Jogador"} marca para o time visitante!`,
      })
    }

    // Registrar evento de fim de jogo
    await criarEventoPartida({
      partida_id: partidaId,
      tipo: "fim_jogo",
      minuto: 90,
      time_id: null,
      jogador_id: null,
      descricao: `Fim de jogo! ${timeCasa.nome} ${golsCasa} x ${golsVisitante} ${timeVisitante.nome}`,
    })

    // Atualizar a tabela de classificação
    await atualizarTabelaClassificacao(partida.campeonato.replace("Divisão ", ""), partida.temporada)

    return {
      golsCasa,
      golsVisitante,
      vencedor: golsCasa > golsVisitante ? timeCasa.id : golsVisitante > golsCasa ? timeVisitante.id : null,
    }
  } catch (erro) {
    console.error("Erro ao simular partida:", erro)
    throw erro
  }
}

/**
 * Simula um número de gols baseado em uma média
 */
function simularGols(media: number): number {
  // Simplificação da distribuição de Poisson
  let gols = 0
  const lambda = media

  // Limitar a no máximo 5 gols para simplificar
  for (let i = 0; i < 5; i++) {
    if (Math.random() < lambda / 5) {
      gols++
    }
  }

  return gols
}

/**
 * Calcula a força de um time com base nos jogadores
 */
function calcularForcaTime(jogadores: any[]) {
  if (!jogadores || jogadores.length === 0) return 70 // Valor padrão

  // Calcular a média da força dos jogadores titulares
  const titulares = jogadores.filter((j) => j.titular)
  if (titulares.length === 0) return 70

  const somaForca = titulares.reduce((soma, jogador) => soma + (jogador.forca || 70), 0)
  return somaForca / titulares.length
}

/**
 * Cria um evento de partida no banco de dados
 */
export async function criarEventoPartida(dados: {
  partida_id: string
  tipo: string
  minuto: number
  time_id: string | null
  jogador_id: string | null
  descricao: string
}) {
  try {
    const supabase = obterClienteSupabase()
    const id = uuidv4()
    const { data, error } = await supabase
      .from("eventos_partida")
      .insert({
        id,
        partida_id: dados.partida_id,
        tipo: dados.tipo,
        minuto: dados.minuto,
        time_id: dados.time_id,
        jogador_id: dados.jogador_id,
        descricao: dados.descricao,
      })
      .select()

    if (error) {
      console.error("Erro ao criar evento de partida:", error)
      throw error
    }

    return data[0]
  } catch (erro) {
    console.error("Erro ao criar evento de partida:", erro)
    throw erro
  }
}

/**
 * Alias para criarEventoPartida para compatibilidade
 */
export const registrarEventoPartida = criarEventoPartida

/**
 * Finaliza uma partida no banco de dados
 */
export async function finalizarPartida(partidaId: string, placarCasa: number, placarVisitante: number) {
  try {
    const supabase = obterClienteSupabase()
    const { data, error } = await supabase
      .from("partidas")
      .update({
        finalizada: true,
        gols_casa: placarCasa,
        gols_visitante: placarVisitante,
      })
      .eq("id", partidaId)
      .select()

    if (error) {
      console.error("Erro ao finalizar partida:", error)
      throw error
    }

    return data[0]
  } catch (erro) {
    console.error("Erro ao finalizar partida:", erro)
    throw erro
  }
}

/**
 * Atualiza a tabela de classificação para uma divisão
 */
export async function atualizarTabelaClassificacao(divisao: string, temporada: number) {
  try {
    const supabase = obterClienteSupabase()

    // Buscar todos os times da divisão
    const { data: times, error: timesError } = await supabase.from("times").select("*").eq("divisao", divisao)

    if (timesError) {
      console.error("Erro ao buscar times:", timesError)
      throw timesError
    }

    // Buscar todas as partidas da divisão
    const { data: partidas, error: partidasError } = await supabase
      .from("partidas")
      .select("*")
      // Removed temporada filter as the column doesn't exist in the database
      .eq("campeonato", `Divisão ${divisao}`)
      .eq("finalizada", true)

    if (partidasError) {
      console.error("Erro ao buscar partidas:", partidasError)
      throw partidasError
    }

    // Calcular estatísticas para cada time
    const tabelaClassificacao = times.map((time) => {
      // Partidas do time (casa e visitante)
      const partidasCasa = partidas.filter((p) => p.time_casa_id === time.id)
      const partidasVisitante = partidas.filter((p) => p.time_visitante_id === time.id)

      // Total de jogos
      const jogos = partidasCasa.length + partidasVisitante.length

      // Vitórias, empates e derrotas
      let vitorias = 0
      let empates = 0
      let derrotas = 0

      // Gols pró e contra
      let golsPro = 0
      let golsContra = 0

      // Calcular para jogos em casa
      partidasCasa.forEach((partida) => {
        golsPro += partida.gols_casa
        golsContra += partida.gols_visitante

        if (partida.gols_casa > partida.gols_visitante) vitorias++
        else if (partida.gols_casa === partida.gols_visitante) empates++
        else derrotas++
      })

      // Calcular para jogos fora
      partidasVisitante.forEach((partida) => {
        golsPro += partida.gols_visitante
        golsContra += partida.gols_casa

        if (partida.gols_visitante > partida.gols_casa) vitorias++
        else if (partida.gols_visitante === partida.gols_casa) empates++
        else derrotas++
      })

      // Calcular pontos (3 por vitória, 1 por empate)
      const pontos = vitorias * 3 + empates

      // Calcular saldo de gols
      const saldoGols = golsPro - golsContra

      return {
        ...time,
        jogos,
        pontos,
        vitorias,
        empates,
        derrotas,
        gols_pro: golsPro,
        gols_contra: golsContra,
        saldo_gols: saldoGols,
      }
    })

    // Ordenar a tabela por pontos, saldo de gols e gols pró
    tabelaClassificacao.sort((a, b) => {
      if (a.pontos !== b.pontos) return b.pontos - a.pontos
      if (a.saldo_gols !== b.saldo_gols) return b.saldo_gols - a.saldo_gols
      return b.gols_pro - a.gols_pro
    })

    return tabelaClassificacao
  } catch (erro) {
    console.error("Erro ao atualizar tabela de classificação:", erro)
    throw erro
  }
}
