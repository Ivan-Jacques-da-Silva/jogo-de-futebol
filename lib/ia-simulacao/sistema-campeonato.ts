import { v4 as uuidv4 } from "uuid"

// Tipos
export interface TimeTabela {
  id: string
  nome: string
  pontos: number
  jogos: number
  vitorias: number
  empates: number
  derrotas: number
  gols_pro: number
  gols_contra: number
  saldo_gols: number
  forca: number
  moral: number
  divisao: string
}

export interface EventoPartida {
  minuto: number
  tipo: "gol" | "cartao_amarelo" | "cartao_vermelho" | "substituicao" | "narracao"
  time_id: string
  jogador_id?: string
  jogador_nome?: string
  descricao: string
}

export interface ResultadoPartida {
  posseBola: { casa: number; visitante: number }
  chutes: { casa: number; visitante: number }
  chutesNoGol: { casa: number; visitante: number }
  escanteios: { casa: number; visitante: number }
  faltas: { casa: number; visitante: number }
  eventos: EventoPartida[]
}

export interface Partida {
  id: string
  time_casa_id: string
  time_visitante_id: string
  rodada: number
  temporada: number
  divisao: string
  gols_casa: number
  gols_visitante: number
  finalizada: boolean
  resultado?: ResultadoPartida
}

export interface Campeonato {
  id: string
  divisao: string
  temporada: number
  times: TimeTabela[]
  partidas: Partida[]
  rodadaAtual: number
  finalizado: boolean
}

// Nomes de times para geração aleatória
const nomesTimes = [
  "Atlético Vencedor",
  "Cruzeiro Celeste",
  "Palmeiras Alviverde",
  "Flamengo Rubro-Negro",
  "São Paulo Tricolor",
  "Corinthians Alvinegro",
  "Grêmio Imortal",
  "Internacional Colorado",
  "Fluminense Tricolor",
  "Vasco da Gama",
  "Botafogo Glorioso",
  "Santos Peixe",
  "Bahia Tricolor",
  "Vitória Rubro-Negro",
  "Fortaleza Leão",
  "Ceará Vozão",
  "Athletico Furacão",
  "Coritiba Coxa",
  "Goiás Esmeraldino",
  "Sport Leão",
  "Chapecoense Verdão",
  "Ponte Preta Macaca",
  "Guarani Bugre",
  "Criciúma Tigre",
  "América Coelho",
  "Avaí Leão",
  "Figueirense Furacão",
  "Juventude Alviverde",
  "Náutico Timbu",
  "Paraná Clube",
  "Bragantino Massa Bruta",
  "CSA Azulão",
  "CRB Galo",
  "Operário Fantasma",
  "Cuiabá Dourado",
  "Vila Nova Tigrão",
  "Londrina Tubarão",
  "Brasil de Pelotas",
  "Oeste Rubrão",
  "Sampaio Corrêa Bolívia",
  "Remo Leão",
  "Paysandu Papão",
  "Santa Cruz Cobra Coral",
  "Botafogo-PB Belo",
  "Ferroviária Locomotiva",
  "Tombense Gavião",
  "Volta Redonda Voltaço",
  "Ituano Galo",
]

// Função para iniciar um campeonato
export function iniciarCampeonato(divisao: string, temporada: number, timeUsuario: TimeTabela): Campeonato {
  // Criar times para o campeonato (15 times aleatórios + time do usuário)
  const times: TimeTabela[] = [timeUsuario]

  // Adicionar times aleatórios
  const timesDisponiveis = [...nomesTimes]
  for (let i = 0; i < 15; i++) {
    const indiceAleatorio = Math.floor(Math.random() * timesDisponiveis.length)
    const nomeTime = timesDisponiveis.splice(indiceAleatorio, 1)[0]

    times.push({
      id: uuidv4(),
      nome: nomeTime,
      pontos: 0,
      jogos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      gols_pro: 0,
      gols_contra: 0,
      saldo_gols: 0,
      forca: Math.floor(Math.random() * 20) + 65, // Força entre 65 e 85
      moral: Math.floor(Math.random() * 20) + 70, // Moral entre 70 e 90
      divisao: divisao,
    })
  }

  // Criar partidas do campeonato (turno único)
  const partidas: Partida[] = []
  const rodadaAtual = 1

  // Para cada rodada
  for (let rodada = 1; rodada <= 15; rodada++) {
    const timesRodada = [...times]

    // Embaralhar times para criar confrontos aleatórios
    for (let i = timesRodada.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[timesRodada[i], timesRodada[j]] = [timesRodada[j], timesRodada[i]]
    }

    // Criar partidas da rodada
    for (let i = 0; i < timesRodada.length; i += 2) {
      if (i + 1 < timesRodada.length) {
        partidas.push({
          id: uuidv4(),
          time_casa_id: timesRodada[i].id,
          time_visitante_id: timesRodada[i + 1].id,
          rodada: rodada,
          temporada: temporada,
          divisao: divisao,
          gols_casa: 0,
          gols_visitante: 0,
          finalizada: false,
        })
      }
    }
  }

  // Ordenar partidas por rodada
  partidas.sort((a, b) => a.rodada - b.rodada)

  return {
    id: uuidv4(),
    divisao,
    temporada,
    times,
    partidas,
    rodadaAtual,
    finalizado: false,
  }
}

// Função para simular uma rodada
export function simularRodada(campeonato: Campeonato, timeUsuarioId: string, jogadoresUsuario: any[]): Campeonato {
  const campeonatoAtualizado = { ...campeonato }
  const { rodadaAtual, partidas, times } = campeonatoAtualizado

  // Filtrar partidas da rodada atual
  const partidasRodada = partidas.filter((p) => p.rodada === rodadaAtual && !p.finalizada)

  // Simular cada partida da rodada
  for (const partida of partidasRodada) {
    const timeCasa = times.find((t) => t.id === partida.time_casa_id)
    const timeVisitante = times.find((t) => t.id === partida.time_visitante_id)

    if (!timeCasa || !timeVisitante) continue

    // Simular resultado
    const resultado = simularPartida(
      timeCasa,
      timeVisitante,
      partida.time_casa_id === timeUsuarioId ? jogadoresUsuario : [],
      partida.time_visitante_id === timeUsuarioId ? jogadoresUsuario : [],
    )

    // Atualizar partida
    partida.gols_casa = resultado.gols_casa
    partida.gols_visitante = resultado.gols_visitante
    partida.finalizada = true
    partida.resultado = resultado.detalhes

    // Atualizar estatísticas dos times
    atualizarEstatisticasTime(timeCasa, resultado.gols_casa, resultado.gols_visitante, true)
    atualizarEstatisticasTime(timeVisitante, resultado.gols_visitante, resultado.gols_casa, false)
  }

  // Ordenar times por pontos, vitórias, saldo de gols, gols pró
  campeonatoAtualizado.times.sort((a, b) => {
    if (a.pontos !== b.pontos) return b.pontos - a.pontos
    if (a.vitorias !== b.vitorias) return b.vitorias - a.vitorias
    if (a.saldo_gols !== b.saldo_gols) return b.saldo_gols - a.saldo_gols
    return b.gols_pro - a.gols_pro
  })

  // Avançar para a próxima rodada
  campeonatoAtualizado.rodadaAtual++

  // Verificar se o campeonato terminou
  if (campeonatoAtualizado.rodadaAtual > 15) {
    campeonatoAtualizado.finalizado = true
  }

  return campeonatoAtualizado
}

// Função para atualizar estatísticas de um time
function atualizarEstatisticasTime(time: TimeTabela, golsMarcados: number, golsSofridos: number, mandante: boolean) {
  time.jogos++
  time.gols_pro += golsMarcados
  time.gols_contra += golsSofridos
  time.saldo_gols = time.gols_pro - time.gols_contra

  if (golsMarcados > golsSofridos) {
    // Vitória
    time.vitorias++
    time.pontos += 3
    time.moral = Math.min(100, time.moral + 5)
  } else if (golsMarcados === golsSofridos) {
    // Empate
    time.empates++
    time.pontos += 1
    time.moral = Math.min(100, time.moral + 1)
  } else {
    // Derrota
    time.derrotas++
    time.moral = Math.max(50, time.moral - 3)
  }
}

// Função para simular uma partida
function simularPartida(
  timeCasa: TimeTabela,
  timeVisitante: TimeTabela,
  jogadoresCasa: any[] = [],
  jogadoresVisitante: any[] = [],
) {
  // Calcular força efetiva dos times (considerando fator casa e moral)
  const forcaEfetivaCasa = timeCasa.forca * 1.1 * (timeCasa.moral / 80)
  const forcaEfetivaVisitante = timeVisitante.forca * (timeVisitante.moral / 80)

  // Calcular probabilidades de gol
  const probGolCasa = forcaEfetivaCasa / 20
  const probGolVisitante = forcaEfetivaVisitante / 25

  // Simular gols
  let golsCasa = 0
  let golsVisitante = 0

  // Simular 90 minutos
  const eventos: EventoPartida[] = []
  const chutes = { casa: 0, visitante: 0 }
  const chutesNoGol = { casa: 0, visitante: 0 }
  const escanteios = { casa: 0, visitante: 0 }
  const faltas = { casa: 0, visitante: 0 }

  // Adicionar narração inicial
  eventos.push({
    minuto: 0,
    tipo: "narracao",
    time_id: "",
    descricao: `A partida entre ${timeCasa.nome} e ${timeVisitante.nome} vai começar!`,
  })

  for (let minuto = 1; minuto <= 90; minuto++) {
    // Simular chutes
    if (Math.random() < probGolCasa / 3) {
      chutes.casa++

      // Simular chute no gol
      if (Math.random() < 0.6) {
        chutesNoGol.casa++

        // Narração de chute
        if (Math.random() < 0.3) {
          eventos.push({
            minuto,
            tipo: "narracao",
            time_id: timeCasa.id,
            descricao: `${minuto}' Boa finalização do ${timeCasa.nome}!`,
          })
        }

        // Simular gol
        if (Math.random() < probGolCasa / 10) {
          golsCasa++

          // Narração de gol
          eventos.push({
            minuto,
            tipo: "gol",
            time_id: timeCasa.id,
            descricao: `${minuto}' GOOOOL do ${timeCasa.nome}! ${timeCasa.nome} ${golsCasa} x ${golsVisitante} ${timeVisitante.nome}`,
          })
        } else if (Math.random() < 0.4) {
          // Narração de defesa
          eventos.push({
            minuto,
            tipo: "narracao",
            time_id: timeVisitante.id,
            descricao: `${minuto}' Grande defesa do goleiro do ${timeVisitante.nome}!`,
          })
        }
      } else if (Math.random() < 0.3) {
        // Narração de chute para fora
        eventos.push({
          minuto,
          tipo: "narracao",
          time_id: timeCasa.id,
          descricao: `${minuto}' Chute para fora do ${timeCasa.nome}.`,
        })
      }
    }

    // Simular chutes do visitante
    if (Math.random() < probGolVisitante / 3) {
      chutes.visitante++

      // Simular chute no gol
      if (Math.random() < 0.55) {
        chutesNoGol.visitante++

        // Narração de chute
        if (Math.random() < 0.3) {
          eventos.push({
            minuto,
            tipo: "narracao",
            time_id: timeVisitante.id,
            descricao: `${minuto}' Boa finalização do ${timeVisitante.nome}!`,
          })
        }

        // Simular gol
        if (Math.random() < probGolVisitante / 10) {
          golsVisitante++

          // Narração de gol
          eventos.push({
            minuto,
            tipo: "gol",
            time_id: timeVisitante.id,
            descricao: `${minuto}' GOOOOL do ${timeVisitante.nome}! ${timeCasa.nome} ${golsCasa} x ${golsVisitante} ${timeVisitante.nome}`,
          })
        } else if (Math.random() < 0.4) {
          // Narração de defesa
          eventos.push({
            minuto,
            tipo: "narracao",
            time_id: timeCasa.id,
            descricao: `${minuto}' Grande defesa do goleiro do ${timeCasa.nome}!`,
          })
        }
      } else if (Math.random() < 0.3) {
        // Narração de chute para fora
        eventos.push({
          minuto,
          tipo: "narracao",
          time_id: timeVisitante.id,
          descricao: `${minuto}' Chute para fora do ${timeVisitante.nome}.`,
        })
      }
    }

    // Simular escanteios
    if (Math.random() < 0.05) {
      if (Math.random() < 0.6) {
        escanteios.casa++
        if (Math.random() < 0.3) {
          eventos.push({
            minuto,
            tipo: "narracao",
            time_id: timeCasa.id,
            descricao: `${minuto}' Escanteio para o ${timeCasa.nome}.`,
          })
        }
      } else {
        escanteios.visitante++
        if (Math.random() < 0.3) {
          eventos.push({
            minuto,
            tipo: "narracao",
            time_id: timeVisitante.id,
            descricao: `${minuto}' Escanteio para o ${timeVisitante.nome}.`,
          })
        }
      }
    }

    // Simular faltas
    if (Math.random() < 0.08) {
      if (Math.random() < 0.5) {
        faltas.casa++
        if (Math.random() < 0.3) {
          eventos.push({
            minuto,
            tipo: "narracao",
            time_id: timeCasa.id,
            descricao: `${minuto}' Falta cometida pelo ${timeCasa.nome}.`,
          })
        }
      } else {
        faltas.visitante++
        if (Math.random() < 0.3) {
          eventos.push({
            minuto,
            tipo: "narracao",
            time_id: timeVisitante.id,
            descricao: `${minuto}' Falta cometida pelo ${timeVisitante.nome}.`,
          })
        }
      }
    }

    // Narrações contextuais
    if (minuto === 45) {
      eventos.push({
        minuto,
        tipo: "narracao",
        time_id: "",
        descricao: `${minuto}' Fim do primeiro tempo! ${timeCasa.nome} ${golsCasa} x ${golsVisitante} ${timeVisitante.nome}`,
      })
    } else if (minuto === 46) {
      eventos.push({
        minuto,
        tipo: "narracao",
        time_id: "",
        descricao: `${minuto}' Começa o segundo tempo!`,
      })
    } else if (minuto === 90) {
      eventos.push({
        minuto,
        tipo: "narracao",
        time_id: "",
        descricao: `${minuto}' Fim de jogo! ${timeCasa.nome} ${golsCasa} x ${golsVisitante} ${timeVisitante.nome}`,
      })
    } else if (Math.random() < 0.02) {
      // Narrações aleatórias
      const narracoes = [
        `${minuto}' O time pressiona no ataque!`,
        `${minuto}' A torcida está empolgada!`,
        `${minuto}' Boa troca de passes.`,
        `${minuto}' O técnico orienta da beira do campo.`,
        `${minuto}' Jogada perigosa!`,
      ]

      const narracao = narracoes[Math.floor(Math.random() * narracoes.length)]
      const timeNarracao = Math.random() < 0.5 ? timeCasa.id : timeVisitante.id

      eventos.push({
        minuto,
        tipo: "narracao",
        time_id: timeNarracao,
        descricao: narracao,
      })
    }
  }

  // Calcular posse de bola baseada na força dos times
  const posseTotalPontos = forcaEfetivaCasa + forcaEfetivaVisitante
  const posseCasa = Math.round((forcaEfetivaCasa / posseTotalPontos) * 100)
  const posseVisitante = 100 - posseCasa

  return {
    gols_casa: golsCasa,
    gols_visitante: golsVisitante,
    detalhes: {
      posseBola: { casa: posseCasa, visitante: posseVisitante },
      chutes,
      chutesNoGol,
      escanteios,
      faltas,
      eventos,
    },
  }
}

// Função para processar o fim da temporada
export function processarFimTemporada(campeonatos: Record<string, Campeonato>, timeUsuarioId: string) {
  let novaDivisaoUsuario = "D"
  let promovido = false
  let rebaixado = false

  // Encontrar a divisão atual do time do usuário
  let divisaoAtual = "D"
  for (const [divisao, campeonato] of Object.entries(campeonatos)) {
    const timeUsuario = campeonato.times.find((t) => t.id === timeUsuarioId)
    if (timeUsuario) {
      divisaoAtual = divisao
      break
    }
  }

  // Verificar posição do time do usuário
  const campeonatoAtual = campeonatos[divisaoAtual]
  if (campeonatoAtual) {
    const posicaoUsuario = campeonatoAtual.times.findIndex((t) => t.id === timeUsuarioId) + 1

    // Verificar promoção
    if (posicaoUsuario <= 4 && divisaoAtual !== "A") {
      if (divisaoAtual === "D") novaDivisaoUsuario = "C"
      else if (divisaoAtual === "C") novaDivisaoUsuario = "B"
      else if (divisaoAtual === "B") novaDivisaoUsuario = "A"

      promovido = true
    }
    // Verificar rebaixamento
    else if (posicaoUsuario > campeonatoAtual.times.length - 4 && divisaoAtual !== "D") {
      if (divisaoAtual === "A") novaDivisaoUsuario = "B"
      else if (divisaoAtual === "B") novaDivisaoUsuario = "C"
      else if (divisaoAtual === "C") novaDivisaoUsuario = "D"

      rebaixado = true
    }
    // Manter na mesma divisão
    else {
      novaDivisaoUsuario = divisaoAtual
    }
  }

  return { novaDivisaoUsuario, promovido, rebaixado }
}
