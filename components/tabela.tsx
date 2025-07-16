"use client"

/**
 * Componente da seção de Tabela
 * Exibe tabelas de classificação dos campeonatos e cronograma de jogos
 */
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Trophy, ArrowUp, ArrowDown, Play, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { buscarJogadoresPorTimeId } from "@/servicos/jogador-servico"
import {
  iniciarCampeonato,
  simularRodada,
  processarFimTemporada,
  type TimeTabela,
  type Campeonato,
  type Partida as PartidaCampeonato,
} from "@/lib/ia-simulacao/sistema-campeonato"

interface PropsTabela {
  dadosTime: {
    nome_time: string
    cores: {
      primaria: string
      secundaria: string
    }
    divisao: string
  }
  timeId: string | null
}

export default function Tabela({ dadosTime, timeId }: PropsTabela) {
  const [divisaoAtual, definirDivisaoAtual] = useState(dadosTime.divisao || "D")
  const [rodadaAtual, definirRodadaAtual] = useState(1)
  const [temporadaAtual, definirTemporadaAtual] = useState(1)
  const [jogadores, definirJogadores] = useState<any[]>([])
  const [carregando, definirCarregando] = useState(false)
  const [dialogRodada, definirDialogRodada] = useState(false)
  const [dialogFimTemporada, definirDialogFimTemporada] = useState(false)
  const [campeonatos, definirCampeonatos] = useState<Record<string, Campeonato>>({})
  const [partidaSelecionada, definirPartidaSelecionada] = useState<PartidaCampeonato | null>(null)
  const [dialogPartida, definirDialogPartida] = useState(false)
  const [abaAtiva, definirAbaAtiva] = useState("classificacao")
  const [simulandoRodada, definirSimulandoRodada] = useState(false)

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
        definirJogadores(jogadoresData || [])
      } catch (erroJogadores) {
        console.error("Erro ao carregar jogadores:", erroJogadores)
        definirJogadores([])
      }

      // Verificar se já existe um campeonato para a divisão atual
      if (!campeonatos[divisaoAtual]) {
        // Se não existir, não inicializa automaticamente
        // O usuário deve clicar em "Iniciar Campeonato"
      }
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro)
    } finally {
      definirCarregando(false)
    }
  }

  // Função para iniciar um novo campeonato
  function iniciarNovoCampeonato() {
    if (!timeId) return

    try {
      definirCarregando(true)

      // Criar time do usuário para o campeonato
      const timeUsuario: TimeTabela = {
        id: timeId,
        nome: dadosTime.nome_time,
        pontos: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gols_pro: 0,
        gols_contra: 0,
        saldo_gols: 0,
        forca: 75, // Valor inicial
        moral: 80,
        divisao: divisaoAtual,
      }

      // Iniciar campeonato
      const novoCampeonato = iniciarCampeonato(divisaoAtual, temporadaAtual, timeUsuario)

      // Atualizar estado
      definirCampeonatos({
        ...campeonatos,
        [divisaoAtual]: novoCampeonato,
      })

      definirRodadaAtual(1)
    } catch (erro) {
      console.error("Erro ao iniciar campeonato:", erro)
    } finally {
      definirCarregando(false)
    }
  }

  // Função para abrir diálogo de rodada
  function abrirDialogRodada() {
    if (!campeonatos[divisaoAtual]) {
      alert("Você precisa iniciar o campeonato primeiro!")
      return
    }

    if (campeonatos[divisaoAtual].finalizado) {
      alert("O campeonato já foi finalizado. Inicie uma nova temporada!")
      return
    }

    definirDialogRodada(true)
  }

  // Função para simular uma rodada
  async function simularProximaRodada() {
    if (!timeId || !campeonatos[divisaoAtual]) return

    try {
      definirSimulandoRodada(true)

      // Simular a rodada
      const campeonatoAtualizado = simularRodada(campeonatos[divisaoAtual], timeId, jogadores)

      // Atualizar estado
      definirCampeonatos({
        ...campeonatos,
        [divisaoAtual]: campeonatoAtualizado,
      })

      definirRodadaAtual(campeonatoAtualizado.rodadaAtual)

      // Verificar se o campeonato terminou
      if (campeonatoAtualizado.finalizado) {
        definirDialogFimTemporada(true)
      }

      definirDialogRodada(false)
    } catch (erro) {
      console.error("Erro ao simular rodada:", erro)
    } finally {
      definirSimulandoRodada(false)
    }
  }

  // Função para finalizar a temporada
  function finalizarTemporada() {
    if (!timeId) return

    try {
      definirCarregando(true)

      // Processar fim da temporada
      const { novaDivisaoUsuario, promovido, rebaixado } = processarFimTemporada(campeonatos, timeId)

      // Atualizar divisão do usuário
      definirDivisaoAtual(novaDivisaoUsuario)

      // Incrementar temporada
      definirTemporadaAtual(temporadaAtual + 1)

      // Limpar campeonatos
      definirCampeonatos({})

      // Mostrar mensagem
      if (promovido) {
        alert(`Parabéns! Seu time foi promovido para a Série ${novaDivisaoUsuario}!`)
      } else if (rebaixado) {
        alert(`Seu time foi rebaixado para a Série ${novaDivisaoUsuario}.`)
      }

      definirDialogFimTemporada(false)
    } catch (erro) {
      console.error("Erro ao finalizar temporada:", erro)
    } finally {
      definirCarregando(false)
    }
  }

  // Função para visualizar detalhes de uma partida
  function visualizarPartida(partida: PartidaCampeonato) {
    definirPartidaSelecionada(partida)
    definirDialogPartida(true)
  }

  // Renderizar tabela de classificação
  function renderizarTabelaClassificacao() {
    const campeonato = campeonatos[divisaoAtual]
    if (!campeonato) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Nenhum campeonato iniciado para a Série {divisaoAtual}.</p>
          <Button onClick={iniciarNovoCampeonato}>Iniciar Campeonato</Button>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Pos.</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center">J</TableHead>
              <TableHead className="text-center">V</TableHead>
              <TableHead className="text-center">E</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">GP</TableHead>
              <TableHead className="text-center">GC</TableHead>
              <TableHead className="text-center">SG</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campeonato.times.map((time, index) => (
              <TableRow key={time.id} className={time.id === timeId ? "bg-primary/10 font-bold" : ""}>
                <TableCell>
                  {index + 1}
                  {index < 4 && divisaoAtual !== "A" && <ArrowUp className="h-4 w-4 text-green-500 inline ml-1" />}
                  {index >= campeonato.times.length - 4 && divisaoAtual !== "D" && (
                    <ArrowDown className="h-4 w-4 text-red-500 inline ml-1" />
                  )}
                </TableCell>
                <TableCell>{time.nome}</TableCell>
                <TableCell className="text-center">{time.pontos}</TableCell>
                <TableCell className="text-center">{time.jogos}</TableCell>
                <TableCell className="text-center">{time.vitorias}</TableCell>
                <TableCell className="text-center">{time.empates}</TableCell>
                <TableCell className="text-center">{time.derrotas}</TableCell>
                <TableCell className="text-center">{time.gols_pro}</TableCell>
                <TableCell className="text-center">{time.gols_contra}</TableCell>
                <TableCell className="text-center">{time.saldo_gols}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Renderizar tabela de jogos
  function renderizarTabelaJogos() {
    const campeonato = campeonatos[divisaoAtual]
    if (!campeonato) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum campeonato iniciado para a Série {divisaoAtual}.</p>
        </div>
      )
    }

    // Agrupar partidas por rodada
    const partidasPorRodada: Record<number, PartidaCampeonato[]> = {}
    campeonato.partidas.forEach((partida) => {
      if (!partidasPorRodada[partida.rodada]) {
        partidasPorRodada[partida.rodada] = []
      }
      partidasPorRodada[partida.rodada].push(partida)
    })

    return (
      <div className="space-y-6">
        {Object.entries(partidasPorRodada).map(([rodada, partidas]) => (
          <Card key={rodada}>
            <CardHeader>
              <CardTitle className="text-lg">Rodada {rodada}</CardTitle>
              <CardDescription>
                {Number(rodada) < campeonato.rodadaAtual
                  ? "Finalizada"
                  : Number(rodada) === campeonato.rodadaAtual
                    ? "Próxima rodada"
                    : "Futura"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {partidas.map((partida) => {
                  const timeCasa = campeonato.times.find((t) => t.id === partida.time_casa_id)
                  const timeVisitante = campeonato.times.find((t) => t.id === partida.time_visitante_id)
                  const jogoDoUsuario = partida.time_casa_id === timeId || partida.time_visitante_id === timeId

                  return (
                    <div
                      key={partida.id}
                      className={`flex justify-between items-center p-3 rounded cursor-pointer hover:bg-muted ${
                        jogoDoUsuario ? "bg-primary/10" : ""
                      }`}
                      onClick={() => partida.finalizada && visualizarPartida(partida)}
                    >
                      <div className="text-right w-[40%]">
                        <span className={partida.time_casa_id === timeId ? "font-bold" : ""}>
                          {timeCasa?.nome || "Time Casa"}
                        </span>
                      </div>
                      <div className="text-center w-[20%] font-semibold">
                        {partida.finalizada ? (
                          <span>
                            {partida.gols_casa} - {partida.gols_visitante}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">vs</span>
                        )}
                      </div>
                      <div className="text-left w-[40%]">
                        <span className={partida.time_visitante_id === timeId ? "font-bold" : ""}>
                          {timeVisitante?.nome || "Time Visitante"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tabela de Classificação</h2>
          <p className="text-muted-foreground">
            Divisão {divisaoAtual} - Temporada {temporadaAtual} - Rodada {rodadaAtual}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!campeonatos[divisaoAtual] ? (
            <Button onClick={iniciarNovoCampeonato} className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Iniciar Campeonato
            </Button>
          ) : (
            <Button
              onClick={abrirDialogRodada}
              className="flex items-center gap-2"
              disabled={campeonatos[divisaoAtual]?.finalizado}
            >
              <Calendar className="h-4 w-4" />
              Próxima Rodada
            </Button>
          )}
        </div>
      </div>

      <Tabs value={abaAtiva} onValueChange={definirAbaAtiva}>
        <TabsList>
          <TabsTrigger value="classificacao">Classificação</TabsTrigger>
          <TabsTrigger value="jogos">Jogos</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="classificacao" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Divisão {divisaoAtual} - Classificação</CardTitle>
            </CardHeader>
            <CardContent className="p-0">{renderizarTabelaClassificacao()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jogos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Jogos da Temporada</CardTitle>
            </CardHeader>
            <CardContent>{renderizarTabelaJogos()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas da Temporada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                    Artilheiros
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Jogador 1</span>
                      <span>10 gols</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jogador 2</span>
                      <span>8 gols</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jogador 3</span>
                      <span>7 gols</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Desempenho do Time</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Aproveitamento</span>
                      <span>67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Média de gols marcados</span>
                      <span>1.8 por jogo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Média de gols sofridos</span>
                      <span>0.9 por jogo</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para jogar a rodada */}
      <Dialog open={dialogRodada} onOpenChange={definirDialogRodada}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jogar Rodada {rodadaAtual}</DialogTitle>
            <DialogDescription>
              Você está pronto para jogar a rodada {rodadaAtual} da temporada {temporadaAtual}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertDescription>Ao confirmar, o sistema simulará todas as partidas da rodada.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => definirDialogRodada(false)}>
              Cancelar
            </Button>
            <Button onClick={simularProximaRodada} disabled={simulandoRodada}>
              {simulandoRodada ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Simulando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Jogar Rodada
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de fim de temporada */}
      <Dialog open={dialogFimTemporada} onOpenChange={definirDialogFimTemporada}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fim da Temporada {temporadaAtual}</DialogTitle>
            <DialogDescription>A temporada {temporadaAtual} chegou ao fim!</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Classificação Final</h3>
              {campeonatos[divisaoAtual] && (
                <p>
                  Seu time terminou em {campeonatos[divisaoAtual].times.findIndex((time) => time.id === timeId) + 1}º
                  lugar na Divisão {divisaoAtual}.
                </p>
              )}

              {campeonatos[divisaoAtual] && (
                <div className="mt-2">
                  {campeonatos[divisaoAtual].times.findIndex((time) => time.id === timeId) + 1 <= 4 &&
                  divisaoAtual !== "A" ? (
                    <div className="text-green-600 dark:text-green-400 font-medium">
                      Parabéns! Seu time conseguiu o acesso para a divisão superior!
                    </div>
                  ) : campeonatos[divisaoAtual].times.findIndex((time) => time.id === timeId) + 1 >
                      campeonatos[divisaoAtual].times.length - 4 && divisaoAtual !== "D" ? (
                    <div className="text-red-600 dark:text-red-400">
                      Seu time foi rebaixado para a divisão inferior.
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Seu time permanecerá na mesma divisão na próxima temporada.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={finalizarTemporada}>Iniciar Nova Temporada</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de detalhes da partida */}
      <Dialog open={dialogPartida} onOpenChange={definirDialogPartida}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Partida</DialogTitle>
          </DialogHeader>
          {partidaSelecionada && partidaSelecionada.resultado && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div className="text-center w-[40%]">
                  <div className="font-bold text-lg">
                    {campeonatos[divisaoAtual]?.times.find((t) => t.id === partidaSelecionada.time_casa_id)?.nome}
                  </div>
                </div>
                <div className="text-center w-[20%]">
                  <div className="text-3xl font-bold">
                    {partidaSelecionada.gols_casa} - {partidaSelecionada.gols_visitante}
                  </div>
                </div>
                <div className="text-center w-[40%]">
                  <div className="font-bold text-lg">
                    {campeonatos[divisaoAtual]?.times.find((t) => t.id === partidaSelecionada.time_visitante_id)?.nome}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Estatísticas</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{partidaSelecionada.resultado.posseBola.casa}%</span>
                        <span>Posse de Bola</span>
                        <span>{partidaSelecionada.resultado.posseBola.visitante}%</span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded bg-muted">
                        <div
                          className="bg-primary"
                          style={{ width: `${partidaSelecionada.resultado.posseBola.casa}%` }}
                        ></div>
                        <div
                          className="bg-secondary"
                          style={{ width: `${partidaSelecionada.resultado.posseBola.visitante}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>{partidaSelecionada.resultado.chutes.casa}</div>
                      <div>Finalizações</div>
                      <div>{partidaSelecionada.resultado.chutes.visitante}</div>

                      <div>{partidaSelecionada.resultado.chutesNoGol.casa}</div>
                      <div>No Gol</div>
                      <div>{partidaSelecionada.resultado.chutesNoGol.visitante}</div>

                      <div>{partidaSelecionada.resultado.escanteios.casa}</div>
                      <div>Escanteios</div>
                      <div>{partidaSelecionada.resultado.escanteios.visitante}</div>

                      <div>{partidaSelecionada.resultado.faltas.casa}</div>
                      <div>Faltas</div>
                      <div>{partidaSelecionada.resultado.faltas.visitante}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Narração</h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-2">
                      {partidaSelecionada.resultado.eventos.map((evento, index) => (
                        <div key={index} className="text-sm">
                          {evento.descricao}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
