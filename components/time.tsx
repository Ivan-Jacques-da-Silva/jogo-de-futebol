"use client"

/**
 * Componente da seção de Time
 * Exibe lista de jogadores, formação tática e opções de gerenciamento
 */
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dumbbell,
  Heart,
  Shield,
  UserCheck,
  RotateCcw,
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  ChevronsUpDown,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { buscarJogadoresPorTimeId } from "@/servicos/jogador-servico"
import {
  buscarFormacaoAtiva,
  buscarPosicoesFormacao,
  atualizarFormacao,
  definirJogadorNaPosicao,
  coordenadasFormacoes,
} from "@/servicos/formacao-servico"

interface PropsTime {
  dadosTime: {
    nome_time: string
    cores: {
      primaria: string
      secundaria: string
    }
  }
  timeId: string | null
}

export default function Time({ dadosTime, timeId }: PropsTime) {
  // Estados para controle de jogadores e formação
  const [jogadores, definirJogadores] = useState<any[]>([])
  const [jogadoresFiltrados, definirJogadoresFiltrados] = useState<any[]>([])
  const [jogadoresSelecionados, definirJogadoresSelecionados] = useState<string[]>([])
  const [formacaoAtual, definirFormacaoAtual] = useState<any>(null)
  const [posicoesFormacao, definirPosicoesFormacao] = useState<any[]>([])
  const [carregando, definirCarregando] = useState(false)
  const [carregandoFormacao, definirCarregandoFormacao] = useState(false)
  const [erro, definirErro] = useState<string | null>(null)
  const [dialogTreinamento, definirDialogTreinamento] = useState(false)
  const [dialogSubstituicao, definirDialogSubstituicao] = useState(false)
  const [jogadorParaSubstituir, definirJogadorParaSubstituir] = useState<string | null>(null)
  const [jogadorSubstituto, definirJogadorSubstituto] = useState<string | null>(null)
  const [dialogFormacao, definirDialogFormacao] = useState(false)
  const [novaFormacao, definirNovaFormacao] = useState("4-4-2")
  const [filtroNome, definirFiltroNome] = useState("")
  const [filtroPosicao, definirFiltroPosicao] = useState<string[]>([])
  const [filtroStatus, definirFiltroStatus] = useState<string[]>([])
  const [ordenacao, definirOrdenacao] = useState<{ campo: string; ordem: "asc" | "desc" }>({
    campo: "nome",
    ordem: "asc",
  })

  // Carregar dados iniciais
  useEffect(() => {
    if (timeId) {
      carregarDados()
    }
  }, [timeId])

  // Aplicar filtros quando os critérios mudarem
  useEffect(() => {
    aplicarFiltros()
  }, [jogadores, filtroNome, filtroPosicao, filtroStatus, ordenacao])

  // Função para carregar dados do time
  async function carregarDados() {
    if (!timeId) return

    try {
      definirCarregando(true)
      definirErro(null)

      // Carregar jogadores
      try {
        const jogadoresData = await buscarJogadoresPorTimeId(timeId)
        definirJogadores(jogadoresData || [])
        definirJogadoresFiltrados(jogadoresData || [])
      } catch (erroJogadores) {
        console.error("Erro ao carregar jogadores:", erroJogadores)
        // Continue with empty array instead of failing completely
        definirJogadores([])
        definirJogadoresFiltrados([])
      }

      // Carregar formação ativa
      try {
        definirCarregandoFormacao(true)
        const formacao = await buscarFormacaoAtiva(timeId)
        definirFormacaoAtual(formacao)

        // Carregar posições da formação
        if (formacao) {
          const posicoes = await buscarPosicoesFormacao(formacao.id)
          definirPosicoesFormacao(posicoes || [])
        }
      } catch (erroFormacao: any) {
        console.error("Erro ao carregar formação:", erroFormacao)
        definirErro(`Erro ao carregar formação: ${erroFormacao.message || "Erro desconhecido"}`)
        // Continue with null/empty values
        definirFormacaoAtual(null)
        definirPosicoesFormacao([])
      } finally {
        definirCarregandoFormacao(false)
      }
    } catch (erro: any) {
      console.error("Erro ao carregar dados do time:", erro)
      definirErro(erro.message || "Erro ao carregar dados do time")
    } finally {
      definirCarregando(false)
    }
  }

  // Função para aplicar filtros aos jogadores
  function aplicarFiltros() {
    let resultado = [...jogadores]

    // Filtrar por nome
    if (filtroNome) {
      resultado = resultado.filter((j) => j.nome.toLowerCase().includes(filtroNome.toLowerCase()))
    }

    // Filtrar por posição
    if (filtroPosicao.length > 0) {
      resultado = resultado.filter((j) => filtroPosicao.includes(j.posicao))
    }

    // Filtrar por status
    if (filtroStatus.length > 0) {
      resultado = resultado.filter((j) => {
        if (filtroStatus.includes("titular") && posicoesFormacao.some((p) => p.jogador_id === j.id)) return true
        if (filtroStatus.includes("reserva") && !posicoesFormacao.some((p) => p.jogador_id === j.id)) return true
        if (filtroStatus.includes("alta_forma") && j.condicao >= 90) return true
        if (filtroStatus.includes("baixa_forma") && j.condicao < 70) return true
        return false
      })
    }

    // Ordenar resultados
    resultado.sort((a, b) => {
      const valorA = a[ordenacao.campo]
      const valorB = b[ordenacao.campo]

      // Garantir que valores numéricos sejam comparados como números
      if (typeof valorA === "number" && typeof valorB === "number") {
        return ordenacao.ordem === "asc" ? valorA - valorB : valorB - valorA
      }

      // Comparação de strings
      if (typeof valorA === "string" && typeof valorB === "string") {
        return ordenacao.ordem === "asc" ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA)
      }

      return 0
    })

    definirJogadoresFiltrados(resultado)
  }

  // Função para selecionar/deselecionar jogador
  function selecionarJogador(jogadorId: string) {
    if (jogadoresSelecionados.includes(jogadorId)) {
      definirJogadoresSelecionados(jogadoresSelecionados.filter((id) => id !== jogadorId))
    } else {
      definirJogadoresSelecionados([...jogadoresSelecionados, jogadorId])
    }
  }

  // Função para escalar jogadores selecionados
  async function escalarJogadores() {
    if (!formacaoAtual || jogadoresSelecionados.length === 0) return

    try {
      definirCarregando(true)
      definirErro(null)

      // Para cada posição na formação, atribuir um jogador selecionado
      for (let i = 0; i < Math.min(posicoesFormacao.length, jogadoresSelecionados.length); i++) {
        await definirJogadorNaPosicao(posicoesFormacao[i].id, jogadoresSelecionados[i])
      }

      // Recarregar dados
      await carregarDados()

      // Limpar seleção
      definirJogadoresSelecionados([])

      alert("Jogadores escalados com sucesso!")
    } catch (erro: any) {
      console.error("Erro ao escalar jogadores:", erro)
      definirErro(erro.message || "Erro ao escalar jogadores")
    } finally {
      definirCarregando(false)
    }
  }

  // Função para abrir diálogo de substituição
  function abrirDialogSubstituicao() {
    if (jogadoresSelecionados.length !== 1) {
      alert("Selecione exatamente um jogador para substituir")
      return
    }

    definirJogadorParaSubstituir(jogadoresSelecionados[0])
    definirDialogSubstituicao(true)
  }

  // Função para confirmar substituição
  async function confirmarSubstituicao() {
    if (!jogadorParaSubstituir || !jogadorSubstituto) return

    try {
      definirCarregando(true)
      definirErro(null)

      // Encontrar a posição do jogador a ser substituído
      const posicao = posicoesFormacao.find((p) => p.jogador_id === jogadorParaSubstituir)

      if (posicao) {
        // Substituir o jogador na posição
        await definirJogadorNaPosicao(posicao.id, jogadorSubstituto)
      }

      // Recarregar dados
      await carregarDados()

      // Limpar seleção
      definirJogadoresSelecionados([])
      definirJogadorParaSubstituir(null)
      definirJogadorSubstituto(null)
      definirDialogSubstituicao(false)

      alert("Substituição realizada com sucesso!")
    } catch (erro: any) {
      console.error("Erro ao realizar substituição:", erro)
      definirErro(erro.message || "Erro ao realizar substituição")
    } finally {
      definirCarregando(false)
    }
  }

  // Função para abrir diálogo de treinamento
  function abrirDialogTreinamento() {
    if (jogadoresSelecionados.length === 0) {
      alert("Selecione pelo menos um jogador para treinar")
      return
    }

    definirDialogTreinamento(true)
  }

  // Função para confirmar treinamento
  async function confirmarTreinamento() {
    // Implementação simplificada - apenas mostra mensagem
    alert("Treinamento iniciado para os jogadores selecionados")
    definirDialogTreinamento(false)
    definirJogadoresSelecionados([])
  }

  // Função para abrir diálogo de formação
  function abrirDialogFormacao() {
    definirDialogFormacao(true)
  }

  // Função para confirmar mudança de formação
  async function confirmarMudancaFormacao() {
    if (!formacaoAtual || !novaFormacao) return

    try {
      definirCarregando(true)
      definirErro(null)

      // Atualizar a formação
      await atualizarFormacao(formacaoAtual.id, {
        nome: novaFormacao,
        ativa: true,
      })

      // Recarregar dados
      await carregarDados()

      definirDialogFormacao(false)

      alert("Formação atualizada com sucesso!")
    } catch (erro: any) {
      console.error("Erro ao atualizar formação:", erro)
      definirErro(erro.message || "Erro ao atualizar formação")
    } finally {
      definirCarregando(false)
    }
  }

  // Função para descansar jogadores
  function descansarJogadores() {
    if (jogadoresSelecionados.length === 0) {
      alert("Selecione pelo menos um jogador para descansar")
      return
    }

    alert("Descanso programado para os jogadores selecionados")
    definirJogadoresSelecionados([])
  }

  // Renderizar jogador na formação
  function renderizarJogadorNaFormacao(posicao: any, index: number) {
    const jogador = jogadores.find((j) => j.id === posicao.jogador_id)
    const coordenadas = formacaoAtual ? coordenadasFormacoes[formacaoAtual.nome]?.[index] : null

    if (!coordenadas) return null

    return (
      <div
        key={posicao.id}
        className="absolute w-10 h-10 rounded-full flex items-center justify-center font-bold text-green-800 dark:text-green-300 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${coordenadas.x}%`,
          bottom: `${coordenadas.y}%`,
          backgroundColor: jogador ? "white" : "rgba(255, 255, 255, 0.5)",
          border: jogadoresSelecionados.includes(posicao.jogador_id || "") ? "2px solid yellow" : "none",
        }}
        onClick={() => jogador && selecionarJogador(jogador.id)}
      >
        {jogador ? jogador.posicao : "?"}
      </div>
    )
  }

  // Função para alternar a ordenação
  function alternarOrdenacao(campo: string) {
    if (ordenacao.campo === campo) {
      // Inverter a ordem se o campo já estiver selecionado
      definirOrdenacao({
        campo,
        ordem: ordenacao.ordem === "asc" ? "desc" : "asc",
      })
    } else {
      // Definir nova ordenação
      definirOrdenacao({
        campo,
        ordem: "asc",
      })
    }
  }

  // Função para verificar se uma posição está selecionada
  function isPosicaoSelecionada(posicao: string): boolean {
    return filtroPosicao.includes(posicao)
  }

  // Função para alternar a seleção de uma posição
  function alternarSelecaoPosicao(posicao: string) {
    if (isPosicaoSelecionada(posicao)) {
      definirFiltroPosicao(filtroPosicao.filter((p) => p !== posicao))
    } else {
      definirFiltroPosicao([...filtroPosicao, posicao])
    }
  }

  // Função para verificar se um status está selecionado
  function isStatusSelecionado(status: string): boolean {
    return filtroStatus.includes(status)
  }

  // Função para alternar a seleção de um status
  function alternarSelecaoStatus(status: string) {
    if (isStatusSelecionado(status)) {
      definirFiltroStatus(filtroStatus.filter((s) => s !== status))
    } else {
      definirFiltroStatus([...filtroStatus, status])
    }
  }

  if (carregando && jogadores.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Elenco do {dadosTime.nome_time}</h2>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Elenco do {dadosTime.nome_time}</h2>
          <p className="text-muted-foreground">Gerencie seus jogadores e formação tática</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={escalarJogadores}
            className="flex items-center gap-2"
            disabled={jogadoresSelecionados.length === 0 || !formacaoAtual}
          >
            <UserCheck className="h-4 w-4" />
            Escalar
          </Button>
          <Button
            onClick={abrirDialogSubstituicao}
            variant="outline"
            className="flex items-center gap-2"
            disabled={jogadoresSelecionados.length !== 1 || !formacaoAtual}
          >
            <Shield className="h-4 w-4" />
            Substituir
          </Button>
          <Button
            onClick={abrirDialogTreinamento}
            variant="outline"
            className="flex items-center gap-2"
            disabled={jogadoresSelecionados.length === 0}
          >
            <Dumbbell className="h-4 w-4" />
            Treinar
          </Button>
          <Button
            onClick={descansarJogadores}
            variant="outline"
            className="flex items-center gap-2"
            disabled={jogadoresSelecionados.length === 0}
          >
            <Heart className="h-4 w-4" />
            Descansar
          </Button>
          <Button
            onClick={abrirDialogFormacao}
            variant="outline"
            className="flex items-center gap-2"
            disabled={!formacaoAtual}
          >
            <RotateCcw className="h-4 w-4" />
            Formação
          </Button>
        </div>
      </div>

      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="jogadores">
        <TabsList>
          <TabsTrigger value="jogadores">Jogadores</TabsTrigger>
          <TabsTrigger value="formacao">Formação</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="jogadores" className="mt-4">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>Lista de Jogadores</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {/* Filtro por nome */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar jogador..."
                      className="pl-8 w-[200px]"
                      value={filtroNome}
                      onChange={(e) => definirFiltroNome(e.target.value)}
                    />
                  </div>

                  {/* Filtro por posição */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Posição
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filtrar por posição</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {["GOL", "ZAG", "LD", "LE", "VOL", "MC", "MEI", "PE", "PD", "ATA"].map((posicao) => (
                        <DropdownMenuCheckboxItem
                          key={posicao}
                          checked={isPosicaoSelecionada(posicao)}
                          onCheckedChange={() => alternarSelecaoPosicao(posicao)}
                        >
                          {posicao}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Filtro por status */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Status
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={isStatusSelecionado("titular")}
                        onCheckedChange={() => alternarSelecaoStatus("titular")}
                      >
                        Titulares
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isStatusSelecionado("reserva")}
                        onCheckedChange={() => alternarSelecaoStatus("reserva")}
                      >
                        Reservas
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isStatusSelecionado("alta_forma")}
                        onCheckedChange={() => alternarSelecaoStatus("alta_forma")}
                      >
                        Alta Forma (90%+)
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={isStatusSelecionado("baixa_forma")}
                        onCheckedChange={() => alternarSelecaoStatus("baixa_forma")}
                      >
                        Baixa Forma (&lt;70%)
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => alternarOrdenacao("nome")}>
                        <div className="flex items-center">
                          Nome
                          {ordenacao.campo === "nome" && <ChevronsUpDown className="ml-1 h-4 w-4" />}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => alternarOrdenacao("idade")}>
                        <div className="flex items-center">
                          Idade
                          {ordenacao.campo === "idade" && <ChevronsUpDown className="ml-1 h-4 w-4" />}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => alternarOrdenacao("posicao")}>
                        <div className="flex items-center">
                          Posição
                          {ordenacao.campo === "posicao" && <ChevronsUpDown className="ml-1 h-4 w-4" />}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => alternarOrdenacao("forca")}>
                        <div className="flex items-center">
                          Força
                          {ordenacao.campo === "forca" && <ChevronsUpDown className="ml-1 h-4 w-4" />}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => alternarOrdenacao("moral")}>
                        <div className="flex items-center">
                          Moral
                          {ordenacao.campo === "moral" && <ChevronsUpDown className="ml-1 h-4 w-4" />}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => alternarOrdenacao("condicao")}>
                        <div className="flex items-center">
                          Condição
                          {ordenacao.campo === "condicao" && <ChevronsUpDown className="ml-1 h-4 w-4" />}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jogadoresFiltrados.length > 0 ? (
                      jogadoresFiltrados.map((jogador) => (
                        <TableRow
                          key={jogador.id}
                          className={`cursor-pointer ${
                            jogadoresSelecionados.includes(jogador.id) ? "bg-primary/10" : ""
                          }`}
                          onClick={() => selecionarJogador(jogador.id)}
                        >
                          <TableCell className="font-medium">
                            {jogador.nome}
                            {posicoesFormacao.some((p) => p.jogador_id === jogador.id) && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-1 py-0.5 rounded">
                                Titular
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{jogador.idade}</TableCell>
                          <TableCell>{jogador.posicao}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={jogador.forca}
                                className="h-2 w-16"
                                indicatorClassName={`${jogador.forca >= 85 ? "bg-green-500" : jogador.forca >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                              />
                              <span className="text-sm">{jogador.forca}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={jogador.moral}
                                className="h-2 w-16"
                                indicatorClassName={`${jogador.moral >= 85 ? "bg-green-500" : jogador.moral >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                              />
                              <span className="text-sm">{jogador.moral}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={jogador.condicao}
                                className="h-2 w-16"
                                indicatorClassName={`${jogador.condicao >= 85 ? "bg-green-500" : jogador.condicao >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                              />
                              <span className="text-sm">{jogador.condicao}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          {erro ? (
                            <span className="text-red-500">Erro ao carregar jogadores</span>
                          ) : (
                            "Nenhum jogador encontrado"
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formacao" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  Formação Tática: {formacaoAtual?.nome || "Não definida"}
                  {carregandoFormacao && <Loader2 className="ml-2 h-4 w-4 inline animate-spin" />}
                </CardTitle>
                <div className="flex gap-2">
                  {["4-4-2", "4-3-3", "3-5-2", "5-3-2"].map((formacao) => (
                    <Button
                      key={formacao}
                      variant={formacaoAtual?.nome === formacao ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        definirNovaFormacao(formacao)
                        abrirDialogFormacao()
                      }}
                      disabled={!formacaoAtual}
                      style={
                        formacaoAtual?.nome === formacao
                          ? {
                              backgroundColor: dadosTime.cores.primaria,
                              color: "white",
                            }
                          : {}
                      }
                    >
                      {formacao}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {carregandoFormacao ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Carregando formação...</span>
                </div>
              ) : formacaoAtual ? (
                <div className="relative w-full h-[400px] bg-green-800 dark:bg-green-900 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[80%] h-[90%] border-2 border-white rounded-lg flex flex-col">
                      {/* Área do gol */}
                      <div className="h-[20%] border-b-2 border-white flex justify-center items-center">
                        <div className="w-[40%] h-[80%] border-2 border-white"></div>
                      </div>

                      {/* Campo */}
                      <div className="flex-1 relative">
                        {/* Círculo central */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full border-2 border-white"></div>

                        {/* Jogadores baseados na formação */}
                        {posicoesFormacao.map((posicao, index) => renderizarJogadorNaFormacao(posicao, index))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-[400px] bg-muted rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-medium">Nenhuma formação encontrada</p>
                    <p className="text-muted-foreground">Tente recarregar a página</p>
                    <Button className="mt-4" onClick={() => carregarDados()}>
                      Recarregar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estatisticas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas da Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold mb-2">Média de Idade</h3>
                  <div className="text-3xl font-bold">
                    {jogadores.length > 0
                      ? (jogadores.reduce((sum, j) => sum + j.idade, 0) / jogadores.length).toFixed(1)
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">Anos</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold mb-2">Força Geral</h3>
                  <div className="text-3xl font-bold">
                    {jogadores.length > 0
                      ? (jogadores.reduce((sum, j) => sum + j.forca, 0) / jogadores.length).toFixed(1)
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">Pontos</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-bold mb-2">Condição Física</h3>
                  <div className="text-3xl font-bold">
                    {jogadores.length > 0
                      ? (jogadores.reduce((sum, j) => sum + j.condicao, 0) / jogadores.length).toFixed(1) + "%"
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground">Média do elenco</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold mb-4">Distribuição por Posição</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {["GOL", "ZAG", "LD/LE", "VOL/MC", "MEI", "PE/PD", "ATA"].map((posicao) => {
                    // Calcular quantidade de jogadores por posição
                    let quantidade = 0
                    if (posicao === "LD/LE") {
                      quantidade = jogadores.filter((j) => j.posicao === "LD" || j.posicao === "LE").length
                    } else if (posicao === "VOL/MC") {
                      quantidade = jogadores.filter((j) => j.posicao === "VOL" || j.posicao === "MC").length
                    } else if (posicao === "PE/PD") {
                      quantidade = jogadores.filter((j) => j.posicao === "PE" || j.posicao === "PD").length
                    } else {
                      quantidade = jogadores.filter((j) => j.posicao === posicao).length
                    }

                    return (
                      <div key={posicao} className="p-3 bg-muted rounded-lg text-center">
                        <div className="text-sm font-medium">{posicao}</div>
                        <div className="text-2xl font-bold mt-1">{quantidade}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de Substituição */}
      <Dialog open={dialogSubstituicao} onOpenChange={definirDialogSubstituicao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Substituir Jogador</DialogTitle>
            <DialogDescription>
              Selecione o jogador que entrará no lugar de{" "}
              {jogadores.find((j) => j.id === jogadorParaSubstituir)?.nome || "jogador selecionado"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {jogadores
              .filter((j) => j.id !== jogadorParaSubstituir && !posicoesFormacao.some((p) => p.jogador_id === j.id))
              .map((jogador) => (
                <div
                  key={jogador.id}
                  className={`p-2 rounded flex justify-between items-center cursor-pointer ${
                    jogadorSubstituto === jogador.id ? "bg-primary/10" : "bg-muted"
                  }`}
                  onClick={() => definirJogadorSubstituto(jogador.id)}
                >
                  <div>
                    <span className="font-medium">{jogador.nome}</span>
                    <span className="text-xs text-muted-foreground ml-2">{jogador.posicao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Força: {jogador.forca}</span>
                  </div>
                </div>
              ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => definirDialogSubstituicao(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarSubstituicao} disabled={!jogadorSubstituto}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Treinamento */}
      <Dialog open={dialogTreinamento} onOpenChange={definirDialogTreinamento}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Treinar Jogadores</DialogTitle>
            <DialogDescription>Selecione o tipo de treinamento para os jogadores selecionados</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded border cursor-pointer hover:bg-muted">
              <h3 className="font-medium">Treinamento Físico</h3>
              <p className="text-sm text-muted-foreground">Melhora a condição física e resistência</p>
            </div>
            <div className="p-3 rounded border cursor-pointer hover:bg-muted">
              <h3 className="font-medium">Treinamento Técnico</h3>
              <p className="text-sm text-muted-foreground">Melhora as habilidades técnicas</p>
            </div>
            <div className="p-3 rounded border cursor-pointer hover:bg-muted">
              <h3 className="font-medium">Treinamento Tático</h3>
              <p className="text-sm text-muted-foreground">Melhora o entendimento tático</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => definirDialogTreinamento(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarTreinamento}>Iniciar Treinamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Formação */}
      <Dialog open={dialogFormacao} onOpenChange={definirDialogFormacao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Formação</DialogTitle>
            <DialogDescription>Selecione a nova formação tática para o time</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {["4-4-2", "4-3-3", "3-5-2", "5-3-2"].map((formacao) => (
              <div
                key={formacao}
                className={`p-3 rounded border cursor-pointer ${
                  novaFormacao === formacao ? "bg-primary/10 border-primary" : "hover:bg-muted"
                }`}
                onClick={() => definirNovaFormacao(formacao)}
              >
                <h3 className="font-medium">{formacao}</h3>
                <p className="text-sm text-muted-foreground">
                  {formacao === "4-4-2" && "Formação equilibrada com dois atacantes"}
                  {formacao === "4-3-3" && "Formação ofensiva com três atacantes"}
                  {formacao === "3-5-2" && "Formação com três zagueiros e cinco meio-campistas"}
                  {formacao === "5-3-2" && "Formação defensiva com cinco defensores"}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => definirDialogFormacao(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarMudancaFormacao}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
