"use client"

/**
 * Componente da seção de Partida
 * Permite ao usuário jogar partidas contra outros times
 */
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Users, StickerIcon as Stadium, Clock, ArrowRight, Shirt, BarChart, Play, Loader2 } from "lucide-react"

import { buscarJogadoresPorTimeId } from "@/servicos/jogador-servico"
import {
  calcularForcaTime,
  gerarEventosPartida,
  processarEventosAteMinuto,
  type Time,
  type EventoPartida,
  type Jogador as JogadorSimulacao,
} from "@/lib/ia-simulacao/simulador-partidas"

interface PropsPartida {
  timeId: string | null
  dadosTime: {
    nome_time: string
    cores: {
      primaria: string
      secundaria: string
    }
  }
}

export default function Partida({ timeId, dadosTime }: PropsPartida) {
  // Estados para controle da partida
  const [adversarios, definirAdversarios] = useState<any[]>([])
  const [adversarioSelecionado, definirAdversarioSelecionado] = useState<string | null>(null)
  const [adversario, definirAdversario] = useState<any | null>(null)
  const [estadio, definirEstadio] = useState<any | null>(null)
  const [jogadoresTime, definirJogadoresTime] = useState<any[]>([])
  const [jogadoresAdversario, definirJogadoresAdversario] = useState<any[]>([])
  const [carregando, definirCarregando] = useState(false)
  const [partidaEmAndamento, definirPartidaEmAndamento] = useState(false)
  const [partidaFinalizada, definirPartidaFinalizada] = useState(false)
  const [minutoAtual, definirMinutoAtual] = useState(0)
  const [placar, definirPlacar] = useState({ casa: 0, visitante: 0 })
  const [narracao, definirNarracao] = useState<string[]>([])
  const [estatisticas, definirEstatisticas] = useState({
    posseBola: { casa: 50, visitante: 50 },
    chutes: { casa: 0, visitante: 0 },
    chutesNoGol: { casa: 0, visitante: 0 },
    escanteios: { casa: 0, visitante: 0 },
    faltas: { casa: 0, visitante: 0 },
    cartoes: { casa: { amarelos: 0, vermelhos: 0 }, visitante: { amarelos: 0, vermelhos: 0 } },
  })
  const [abaAtiva, definirAbaAtiva] = useState("escalacao")
  const [substituicoes, definirSubstituicoes] = useState({ casa: 0, visitante: 0 })
  const [jogadoresSelecionados, definirJogadoresSelecionados] = useState<{ [key: string]: boolean }>({})
  const [jogadorParaSubstituir, definirJogadorParaSubstituir] = useState<string | null>(null)
  const [rendaPartida, definirRendaPartida] = useState(0)
  const [eventosPartida, definirEventosPartida] = useState<EventoPartida[]>([])
  const [eventosProcessados, definirEventosProcessados] = useState<number>(0)
  const [simulando, definirSimulando] = useState(false)
  const [velocidadeSimulacao, definirVelocidadeSimulacao] = useState(500) // ms por minuto

  const narracaoRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Carregar dados iniciais
  useEffect(() => {
    if (timeId) {
      carregarDados()
    }
  }, [timeId])

  // Função para carregar dados
  async function carregarDados() {
    if (!timeId) return

    try {
      definirCarregando(true)

      // Carregar jogadores do time
      try {
        const jogadoresData = await buscarJogadoresPorTimeId(timeId)
        definirJogadoresTime(jogadoresData || [])
      } catch (erroJogadores) {
        console.error("Erro ao carregar jogadores:", erroJogadores)
        definirJogadoresTime([])
      }

      // Gerar adversários aleatórios
      const adversariosGerados = gerarAdversariosAleatorios(5)
      definirAdversarios(adversariosGerados)
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro)
    } finally {
      definirCarregando(false)
    }
  }

  // Rolar a narração para o final quando novos eventos forem adicionados
  useEffect(() => {
    if (narracaoRef.current) {
      narracaoRef.current.scrollTop = narracaoRef.current.scrollHeight
    }
  }, [narracao])

  // Limpar o intervalo quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Função para gerar adversários aleatórios
  function gerarAdversariosAleatorios(quantidade: number) {
    const nomesPrimeiro = [
      "Fúria",
      "Estrela",
      "Raio",
      "Trovão",
      "Águia",
      "Leão",
      "Tigre",
      "Dragão",
      "Guerreiro",
      "Invencível",
      "Atlético",
      "Real",
      "Sporting",
      "Nacional",
      "Internacional",
      "União",
      "Cruzeiro",
      "Flamengo",
      "Palmeiras",
      "Santos",
    ]

    const nomesSufixo = [
      "FC",
      "SC",
      "EC",
      "AC",
      "United",
      "City",
      "Real",
      "Nacional",
      "Internacional",
      "Atlético",
      "Esporte Clube",
      "Futebol Clube",
      "Athletic",
      "Sporting",
      "Wanderers",
      "Rangers",
      "Rovers",
      "Town",
      "County",
      "Juniors",
    ]

    return Array.from({ length: quantidade }, (_, i) => {
      const nomePrimeiro = nomesPrimeiro[Math.floor(Math.random() * nomesPrimeiro.length)]
      const nomeSufixo = nomesSufixo[Math.floor(Math.random() * nomesSufixo.length)]
      const nome = `${nomePrimeiro} ${nomeSufixo}`

      return {
        id: `adv-${i}`,
        nome,
        forca: 70 + Math.floor(Math.random() * 15),
        moral: 70 + Math.floor(Math.random() * 20),
        logo: "/placeholder.svg?height=64&width=64",
      }
    })
  }

  // Função para gerar jogadores aleatórios para o adversário
  function gerarJogadoresAdversario(time: any) {
    const posicoes = ["GOL", "ZAG", "LD", "LE", "VOL", "MC", "MEI", "PE", "PD", "ATA"]
    const nomes = [
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
    ]
    const sobrenomes = [
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
    ]

    return Array.from({ length: 11 }, (_, i) => {
      const nome = `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]}`
      const posicao = posicoes[i % posicoes.length]

      return {
        id: `jog-adv-${i}`,
        nome,
        posicao,
        forca: Math.max(60, Math.min(90, time.forca + Math.floor(Math.random() * 10) - 5)),
        moral: time.moral,
        condicao: 80 + Math.floor(Math.random() * 20),
        time_id: time.id,
        titular: true,
      }
    })
  }

  // Função para selecionar um adversário
  function selecionarAdversario(adv: any) {
    definirAdversarioSelecionado(adv.id)
    definirAdversario(adv)

    // Gerar jogadores para o adversário
    const jogadores = gerarJogadoresAdversario(adv)
    definirJogadoresAdversario(jogadores)
  }

  // Função para iniciar a partida
  async function iniciarPartida() {
    if (!timeId || !adversario) return

    try {
      definirSimulando(true)
      definirPartidaEmAndamento(false)
      definirPartidaFinalizada(false)
      definirMinutoAtual(0)
      definirPlacar({ casa: 0, visitante: 0 })
      definirNarracao([])
      definirAbaAtiva("partida")
      definirEventosProcessados(0)

      // Calcular a renda da partida
      const capacidade = 30000
      const ocupacao = Math.floor(Math.random() * 30) + 70 // 70% a 100% de ocupação
      const publico = Math.floor((capacidade * ocupacao) / 100)
      const precoMedioIngresso = 30 // R$ 30,00
      const renda = publico * precoMedioIngresso
      definirRendaPartida(renda)

      // Preparar times para simulação
      const timeCasa: Time = {
        id: `casa-${timeId}`,
        nome: dadosTime.nome_time,
        forca: calcularForcaTime(jogadoresTime),
        moral: 80,
        jogoCasa: true,
      }

      const timeVisitante: Time = {
        id: `visitante-${adversario.id}`,
        nome: adversario.nome,
        forca: adversario.forca,
        moral: adversario.moral,
        jogoCasa: false,
      }

      // Converter jogadores para o formato da simulação
      const jogadoresCasaSimulacao: JogadorSimulacao[] = jogadoresTime.map((j) => ({
        id: j.id,
        nome: j.nome,
        posicao: j.posicao,
        forca: j.forca,
        moral: j.moral,
        condicao: j.condicao,
        time_id: timeCasa.id,
        titular: j.titular,
      }))

      const jogadoresVisitanteSimulacao: JogadorSimulacao[] = jogadoresAdversario.map((j) => ({
        id: j.id,
        nome: j.nome,
        posicao: j.posicao,
        forca: j.forca,
        moral: j.moral,
        condicao: j.condicao,
        time_id: timeVisitante.id,
        titular: j.titular,
      }))

      // Gerar eventos para toda a partida
      const eventos = gerarEventosPartida(timeCasa, timeVisitante, jogadoresCasaSimulacao, jogadoresVisitanteSimulacao)

      definirEventosPartida(eventos)

      // Iniciar a simulação visual
      definirPartidaEmAndamento(true)
      let minuto = 0

      // Configurar o intervalo para simular os minutos
      intervalRef.current = setInterval(() => {
        minuto++
        definirMinutoAtual(minuto)

        // Processar eventos até o minuto atual
        const eventosAteMinuto = eventos.filter((e) => e.minuto <= minuto && e.minuto > eventosProcessados)
        definirEventosProcessados(minuto)

        // Atualizar narração com o tempo correto
        if (eventosAteMinuto.length > 0) {
          definirNarracao((prev) => [
            ...prev,
            ...eventosAteMinuto.map((e) => {
              // Garantir que o tempo na narração corresponda ao minuto atual
              const textoOriginal = e.descricao
              const textoComTempoAtualizado = `${minuto}' ${textoOriginal.substring(textoOriginal.indexOf(" ") + 1)}`
              return textoComTempoAtualizado
            }),
          ])
        }

        // Atualizar placar e estatísticas em tempo real
        const estadoAtual = processarEventosAteMinuto(eventos, minuto)
        definirPlacar(estadoAtual.placar)

        // Atualizar estatísticas em tempo real
        definirEstatisticas({
          posseBola: estadoAtual.estatisticas.posseBola,
          chutes: estadoAtual.estatisticas.chutes,
          chutesNoGol: estadoAtual.estatisticas.chutesNoGol,
          escanteios: estadoAtual.estatisticas.escanteios,
          faltas: estadoAtual.estatisticas.faltas,
          cartoes: {
            casa: {
              amarelos: estadoAtual.estatisticas.cartoesAmarelos.casa,
              vermelhos: estadoAtual.estatisticas.cartoesVermelhos.casa,
            },
            visitante: {
              amarelos: estadoAtual.estatisticas.cartoesAmarelos.visitante,
              vermelhos: estadoAtual.estatisticas.cartoesVermelhos.visitante,
            },
          },
        })

        // Verificar se a partida terminou
        if (minuto >= 90) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          definirPartidaEmAndamento(false)
          definirPartidaFinalizada(true)
        }
      }, velocidadeSimulacao) // Velocidade da simulação
    } catch (erro) {
      console.error("Erro ao iniciar partida:", erro)
      alert(`Erro ao iniciar partida: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`)
    } finally {
      definirSimulando(false)
    }
  }

  /**
   * Realiza uma substituição durante a partida
   */
  function fazerSubstituicao() {
    if (
      !jogadorParaSubstituir ||
      Object.keys(jogadoresSelecionados).filter((id) => jogadoresSelecionados[id]).length === 0
    )
      return

    // Verificar se ainda há substituições disponíveis
    if (substituicoes.casa >= 3) {
      alert("Você já realizou o número máximo de substituições!")
      return
    }

    // Encontrar o jogador que sai e o que entra
    const jogadorSai = jogadoresTime.find((j) => j.id === jogadorParaSubstituir)
    const jogadorEntraId = Object.keys(jogadoresSelecionados).find((id) => jogadoresSelecionados[id])
    const jogadorEntra = jogadoresTime.find((j) => j.id === jogadorEntraId)

    if (!jogadorSai || !jogadorEntra) return

    // Atualizar a narração
    definirNarracao((prev) => [
      ...prev,
      `${minutoAtual}' Substituição no ${dadosTime.nome_time}: Sai ${jogadorSai.nome} e entra ${jogadorEntra.nome}.`,
    ])

    // Atualizar o número de substituições
    definirSubstituicoes((prev) => ({
      ...prev,
      casa: prev.casa + 1,
    }))

    // Limpar a seleção
    definirJogadorParaSubstituir(null)
    definirJogadoresSelecionados({})
  }

  /**
   * Seleciona um jogador para substituição
   */
  function selecionarJogador(jogadorId: string, tipo: "sai" | "entra") {
    if (tipo === "sai") {
      definirJogadorParaSubstituir(jogadorId)
    } else {
      definirJogadoresSelecionados((prev) => ({
        ...prev,
        [jogadorId]: !prev[jogadorId],
      }))
    }
  }

  // Função para alterar a velocidade da simulação
  function alterarVelocidadeSimulacao(velocidade: number) {
    definirVelocidadeSimulacao(velocidade)

    // Reiniciar o intervalo com a nova velocidade se a partida estiver em andamento
    if (partidaEmAndamento && intervalRef.current) {
      clearInterval(intervalRef.current)

      intervalRef.current = setInterval(() => {
        const novoMinuto = minutoAtual + 1
        definirMinutoAtual(novoMinuto)

        // Processar eventos até o minuto atual
        const eventosAteMinuto = eventosPartida.filter((e) => e.minuto <= novoMinuto && e.minuto > eventosProcessados)
        definirEventosProcessados(novoMinuto)

        // Atualizar narração com o tempo correto
        if (eventosAteMinuto.length > 0) {
          definirNarracao((prev) => [
            ...prev,
            ...eventosAteMinuto.map((e) => {
              // Garantir que o tempo na narração corresponda ao minuto atual
              const textoOriginal = e.descricao
              const textoComTempoAtualizado = `${novoMinuto}' ${textoOriginal.substring(textoOriginal.indexOf(" ") + 1)}`
              return textoComTempoAtualizado
            }),
          ])
        }

        // Atualizar placar e estatísticas em tempo real
        const estadoAtual = processarEventosAteMinuto(eventosPartida, novoMinuto)
        definirPlacar(estadoAtual.placar)

        // Atualizar estatísticas em tempo real
        definirEstatisticas({
          posseBola: estadoAtual.estatisticas.posseBola,
          chutes: estadoAtual.estatisticas.chutes,
          chutesNoGol: estadoAtual.estatisticas.chutesNoGol,
          escanteios: estadoAtual.estatisticas.escanteios,
          faltas: estadoAtual.estatisticas.faltas,
          cartoes: {
            casa: {
              amarelos: estadoAtual.estatisticas.cartoesAmarelos.casa,
              vermelhos: estadoAtual.estatisticas.cartoesVermelhos.casa,
            },
            visitante: {
              amarelos: estadoAtual.estatisticas.cartoesAmarelos.visitante,
              vermelhos: estadoAtual.estatisticas.cartoesVermelhos.visitante,
            },
          },
        })

        // Verificar se a partida terminou
        if (novoMinuto >= 90) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          definirPartidaEmAndamento(false)
          definirPartidaFinalizada(true)
        }
      }, velocidade)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Partidas Amistosas</h2>
        <p className="text-muted-foreground">Jogue partidas amistosas contra outros times</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de adversários */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Adversários Disponíveis</CardTitle>
            <CardDescription>Selecione um time para jogar contra</CardDescription>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="text-center py-4">Carregando adversários...</div>
            ) : (
              <div className="space-y-4">
                {adversarios.map((adv) => (
                  <div
                    key={adv.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      adversarioSelecionado === adv.id ? "bg-primary/10" : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => selecionarAdversario(adv)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center overflow-hidden">
                        <img
                          src={adv.logo || "/placeholder.svg"}
                          alt={adv.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{adv.nome}</div>
                        <div className="text-xs text-muted-foreground">Força: {adv.forca}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {adversarios.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">Nenhum adversário disponível</div>
                )}

                {adversario && (
                  <Button onClick={iniciarPartida} className="w-full mt-4" disabled={partidaEmAndamento || simulando}>
                    {simulando ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Preparando partida...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Jogar contra {adversario.nome}
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Área da partida */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {partidaEmAndamento || partidaFinalizada
                ? `${dadosTime.nome_time} vs ${adversario?.nome}`
                : "Partida Amistosa"}
            </CardTitle>
            <CardDescription>
              {partidaEmAndamento
                ? `Minuto: ${minutoAtual}`
                : partidaFinalizada
                  ? "Partida finalizada"
                  : "Selecione um adversário para jogar"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {(partidaEmAndamento || partidaFinalizada) && (
              <Tabs value={abaAtiva} onValueChange={definirAbaAtiva} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="escalacao">
                    <Users className="h-4 w-4 mr-2" />
                    Escalação
                  </TabsTrigger>
                  <TabsTrigger value="partida">
                    <Shirt className="h-4 w-4 mr-2" />
                    Partida
                  </TabsTrigger>
                  <TabsTrigger value="estatisticas">
                    <BarChart className="h-4 w-4 mr-2" />
                    Estatísticas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="escalacao" className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {dadosTime.nome_time}
                      </h3>
                      <div className="space-y-2">
                        {jogadoresTime
                          .filter((j) => j.titular)
                          .map((jogador) => (
                            <div
                              key={jogador.id}
                              className={`p-2 rounded flex justify-between items-center ${
                                jogadorParaSubstituir === jogador.id ? "bg-amber-100 dark:bg-amber-900" : "bg-muted"
                              }`}
                              onClick={() => partidaEmAndamento && selecionarJogador(jogador.id, "sai")}
                            >
                              <div>
                                <span className="font-medium">{jogador.nome}</span>
                                <span className="text-xs text-muted-foreground ml-2">{jogador.posicao}</span>
                              </div>
                              <Badge variant="outline">{jogador.forca}</Badge>
                            </div>
                          ))}

                        <Separator className="my-2" />

                        <h4 className="text-sm font-medium">Reservas</h4>
                        <div className="space-y-2">
                          {jogadoresTime
                            .filter((j) => !j.titular)
                            .map((jogador) => (
                              <div
                                key={jogador.id}
                                className={`p-2 rounded flex justify-between items-center ${
                                  jogadoresSelecionados[jogador.id] ? "bg-green-100 dark:bg-green-900" : "bg-muted"
                                }`}
                                onClick={() => partidaEmAndamento && selecionarJogador(jogador.id, "entra")}
                              >
                                <div>
                                  <span className="font-medium">{jogador.nome}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{jogador.posicao}</span>
                                </div>
                                <Badge variant="outline">{jogador.forca}</Badge>
                              </div>
                            ))}
                        </div>

                        {partidaEmAndamento && (
                          <div className="mt-4">
                            <Button
                              onClick={fazerSubstituicao}
                              disabled={
                                !jogadorParaSubstituir ||
                                Object.keys(jogadoresSelecionados).filter((id) => jogadoresSelecionados[id]).length ===
                                  0
                              }
                              className="w-full"
                            >
                              Fazer Substituição ({substituicoes.casa}/3)
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {adversario?.nome || "Adversário"}
                      </h3>
                      <div className="space-y-2">
                        {jogadoresAdversario.length > 0 ? (
                          jogadoresAdversario
                            .filter((j) => j.titular)
                            .map((jogador) => (
                              <div key={jogador.id} className="p-2 rounded bg-muted flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{jogador.nome}</span>
                                  <span className="text-xs text-muted-foreground ml-2">{jogador.posicao}</span>
                                </div>
                                <Badge variant="outline">{jogador.forca}</Badge>
                              </div>
                            ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">Carregando jogadores...</div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="partida" className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-center flex-1">
                        <div className="font-bold text-lg">{dadosTime.nome_time}</div>
                        <div
                          className="w-8 h-8 rounded-full mx-auto"
                          style={{
                            backgroundColor: dadosTime.cores.primaria,
                          }}
                        ></div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-3xl font-bold">
                          {placar.casa} - {placar.visitante}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {partidaFinalizada ? "90'" : `${minutoAtual}'`}
                          {partidaEmAndamento && (
                            <span className="ml-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                          )}
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="font-bold text-lg">{adversario?.nome}</div>
                        <div className="w-8 h-8 rounded-full mx-auto bg-zinc-400"></div>
                      </div>
                    </div>

                    {/* Controles de velocidade da simulação */}
                    {partidaEmAndamento && (
                      <div className="flex justify-center gap-2 my-2">
                        <Button
                          size="sm"
                          variant={velocidadeSimulacao === 1000 ? "default" : "outline"}
                          onClick={() => alterarVelocidadeSimulacao(1000)}
                        >
                          1x
                        </Button>
                        <Button
                          size="sm"
                          variant={velocidadeSimulacao === 500 ? "default" : "outline"}
                          onClick={() => alterarVelocidadeSimulacao(500)}
                        >
                          2x
                        </Button>
                        <Button
                          size="sm"
                          variant={velocidadeSimulacao === 250 ? "default" : "outline"}
                          onClick={() => alterarVelocidadeSimulacao(250)}
                        >
                          4x
                        </Button>
                      </div>
                    )}

                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">Estádio</div>
                        <div className="flex items-center">
                          <Stadium className="h-4 w-4 mr-1" />
                          Arena da Fúria
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">Público</div>
                        <div>{Math.floor(rendaPartida / 30).toLocaleString()} espectadores</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">Renda</div>
                        <div>R$ {rendaPartida.toLocaleString()}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Narração</h3>
                      <ScrollArea className="h-[200px] border rounded-md p-4" ref={narracaoRef}>
                        <div className="space-y-2">
                          {narracao.map((texto, index) => (
                            <div key={index} className="text-sm">
                              {texto}
                            </div>
                          ))}
                          {partidaEmAndamento && (
                            <div className="text-sm text-muted-foreground animate-pulse">
                              {minutoAtual}' Aguardando próximos lances...
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="estatisticas" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{Math.round(estatisticas.posseBola.casa)}%</span>
                        <span className="text-sm">Posse de Bola</span>
                        <span className="text-sm font-medium">{Math.round(estatisticas.posseBola.visitante)}%</span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded bg-muted">
                        <div
                          className="bg-primary"
                          style={{ width: `${Math.round(estatisticas.posseBola.casa)}%` }}
                        ></div>
                        <div
                          className="bg-secondary"
                          style={{ width: `${Math.round(estatisticas.posseBola.visitante)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="font-medium">{estatisticas.chutes.casa}</div>
                      <div className="text-muted-foreground">Finalizações</div>
                      <div className="font-medium">{estatisticas.chutes.visitante}</div>

                      <div className="font-medium">{estatisticas.chutesNoGol.casa}</div>
                      <div className="text-muted-foreground">Finalizações no Gol</div>
                      <div className="font-medium">{estatisticas.chutesNoGol.visitante}</div>

                      <div className="font-medium">{estatisticas.escanteios.casa}</div>
                      <div className="text-muted-foreground">Escanteios</div>
                      <div className="font-medium">{estatisticas.escanteios.visitante}</div>

                      <div className="font-medium">{estatisticas.faltas.casa}</div>
                      <div className="text-muted-foreground">Faltas</div>
                      <div className="font-medium">{estatisticas.faltas.visitante}</div>

                      <div className="font-medium">
                        {estatisticas.cartoes.casa.amarelos}
                        <span className="text-amber-500 ml-1">●</span>
                        {estatisticas.cartoes.casa.vermelhos > 0 && <span className="text-red-500 ml-1">●</span>}
                      </div>
                      <div className="text-muted-foreground">Cartões</div>
                      <div className="font-medium">
                        {estatisticas.cartoes.visitante.amarelos}
                        <span className="text-amber-500 ml-1">●</span>
                        {estatisticas.cartoes.visitante.vermelhos > 0 && <span className="text-red-500 ml-1">●</span>}
                      </div>
                    </div>

                    {/* Adicionar indicador de atualização em tempo real */}
                    {partidaEmAndamento && (
                      <div className="text-center text-sm text-muted-foreground mt-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        Estatísticas atualizadas em tempo real
                      </div>
                    )}

                    {partidaFinalizada && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Trophy className="h-4 w-4 mr-2" />
                          Resultado Final
                        </h3>
                        <div className="text-center">
                          <div className="text-xl font-bold">
                            {dadosTime.nome_time} {placar.casa} - {placar.visitante} {adversario?.nome}
                          </div>
                          <div className="mt-2">
                            {placar.casa > placar.visitante ? (
                              <Badge className="bg-green-500">Vitória</Badge>
                            ) : placar.casa === placar.visitante ? (
                              <Badge className="bg-amber-500">Empate</Badge>
                            ) : (
                              <Badge className="bg-red-500">Derrota</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {!partidaEmAndamento && !partidaFinalizada && (
              <div className="p-6 text-center">
                <div className="mb-4">
                  <Stadium className="h-12 w-12 mx-auto text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Nenhuma partida em andamento</h3>
                <p className="text-muted-foreground mt-1">
                  {adversario ? "Clique em 'Jogar' para iniciar a partida" : "Selecione um adversário para jogar"}
                </p>
              </div>
            )}
          </CardContent>
          {partidaFinalizada && (
            <CardFooter>
              <Button
                onClick={() => {
                  definirPartidaFinalizada(false)
                  definirPartidaEmAndamento(false)
                  definirMinutoAtual(0)
                  definirPlacar({ casa: 0, visitante: 0 })
                  definirNarracao([])
                  definirEstatisticas({
                    posseBola: { casa: 50, visitante: 50 },
                    chutes: { casa: 0, visitante: 0 },
                    chutesNoGol: { casa: 0, visitante: 0 },
                    escanteios: { casa: 0, visitante: 0 },
                    faltas: { casa: 0, visitante: 0 },
                    cartoes: { casa: { amarelos: 0, vermelhos: 0 }, visitante: { amarelos: 0, vermelhos: 0 } },
                  })
                  definirSubstituicoes({ casa: 0, visitante: 0 })
                  definirJogadoresSelecionados({})
                  definirJogadorParaSubstituir(null)
                  definirEventosPartida([])
                  definirEventosProcessados(0)
                }}
                className="w-full"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuar
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
