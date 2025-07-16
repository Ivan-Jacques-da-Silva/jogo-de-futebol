/**
 * Componente da seção Financeira
 * Exibe informações sobre receitas, despesas e opções de gerenciamento financeiro
 * Implementa sistema de empréstimos e investimentos
 */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Download,
  TrendingUp,
  PieChart,
  BarChart3,
  LineChart,
  DollarSign,
} from "lucide-react"
import {
  buscarTransacoes,
  calcularBalancoFinanceiro,
  registrarTransacao,
  buscarEmprestimos,
  solicitarEmprestimo,
  pagarParcelaEmprestimo,
} from "@/servicos/financeiro-servico"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropsFinanceiro {
  dadosTime: {
    nome_time: string
    cores: {
      primaria: string
      secundaria: string
    }
    saldo_financeiro: number
  }
  timeId: string | null
}

export default function Financeiro({ dadosTime, timeId }: PropsFinanceiro) {
  const [transacoes, definirTransacoes] = useState<any[]>([])
  const [emprestimos, definirEmprestimos] = useState<any[]>([])
  const [balancoFinanceiro, definirBalancoFinanceiro] = useState<any>({
    receitas: 0,
    despesas: 0,
    saldo: 0,
    categorias: { receitas: {}, despesas: {} },
  })
  const [carregando, definirCarregando] = useState(true)
  const [periodoFiltro, definirPeriodoFiltro] = useState("mes")

  // Estados para diálogos
  const [dialogPatrocinio, definirDialogPatrocinio] = useState(false)
  const [dialogRelatorio, definirDialogRelatorio] = useState(false)
  const [dialogEmprestimo, definirDialogEmprestimo] = useState(false)
  const [dialogInvestimento, definirDialogInvestimento] = useState(false)

  // Estados para formulários
  const [formEmprestimo, definirFormEmprestimo] = useState({
    valor: 1000000,
    parcelas: 12,
    taxaJuros: 2.5,
  })

  const [formInvestimento, definirFormInvestimento] = useState({
    tipo: "marketing",
    valor: 500000,
    descricao: "Campanha de marketing",
  })

  useEffect(() => {
    if (timeId) {
      carregarDados()
    }
  }, [timeId, periodoFiltro])

  async function carregarDados() {
    if (!timeId) return

    try {
      definirCarregando(true)

      // Definir período para filtro
      let periodo
      const hoje = new Date()
      const dataInicio = new Date()

      switch (periodoFiltro) {
        case "semana":
          dataInicio.setDate(hoje.getDate() - 7)
          periodo = {
            inicio: dataInicio.toISOString(),
            fim: hoje.toISOString(),
          }
          break
        case "mes":
          dataInicio.setMonth(hoje.getMonth() - 1)
          periodo = {
            inicio: dataInicio.toISOString(),
            fim: hoje.toISOString(),
          }
          break
        case "ano":
          dataInicio.setFullYear(hoje.getFullYear() - 1)
          periodo = {
            inicio: dataInicio.toISOString(),
            fim: hoje.toISOString(),
          }
          break
        default:
          periodo = undefined
      }

      // Buscar transações financeiras
      const transacoesData = await buscarTransacoes(timeId, periodo)
      definirTransacoes(transacoesData)

      // Calcular balanço financeiro
      const balanco = await calcularBalancoFinanceiro(timeId, periodo)
      definirBalancoFinanceiro(balanco)

      // Buscar empréstimos
      const emprestimosData = await buscarEmprestimos(timeId)
      definirEmprestimos(emprestimosData)
    } catch (erro) {
      console.error("Erro ao carregar dados financeiros:", erro)
    } finally {
      definirCarregando(false)
    }
  }

  async function buscarNovoPatrocinio() {
    definirDialogPatrocinio(true)
  }

  async function confirmarNovoPatrocinio(valor: number) {
    if (!timeId) return

    try {
      // Registrar nova receita de patrocínio
      await registrarTransacao({
        time_id: timeId,
        tipo: "receita",
        categoria: "patrocinio",
        valor,
        descricao: `Novo contrato de patrocínio com ${valor >= 1000000 ? "patrocinador master" : "patrocinador secundário"}`,
      })

      // Recarregar dados
      await carregarDados()

      // Fechar diálogo
      definirDialogPatrocinio(false)
    } catch (erro) {
      console.error("Erro ao registrar novo patrocínio:", erro)
    }
  }

  async function emitirRelatorio() {
    definirDialogRelatorio(true)
  }

  async function confirmarEmprestimo() {
    if (!timeId) return

    try {
      // Calcular data de início e fim
      const dataInicio = new Date()
      const dataFim = new Date()
      dataFim.setMonth(dataFim.getMonth() + formEmprestimo.parcelas)

      // Calcular valor da parcela (principal + juros)
      const valorTotal = formEmprestimo.valor
      const taxaMensal = formEmprestimo.taxaJuros / 100
      const valorParcela = (valorTotal * (1 + taxaMensal * formEmprestimo.parcelas)) / formEmprestimo.parcelas

      // Solicitar empréstimo
      await solicitarEmprestimo({
        time_id: timeId,
        valor_total: valorTotal,
        valor_parcela: valorParcela,
        taxa_juros: formEmprestimo.taxaJuros,
        parcelas_total: formEmprestimo.parcelas,
        parcelas_pagas: 0,
        data_inicio: dataInicio.toISOString().split("T")[0],
        data_fim: dataFim.toISOString().split("T")[0],
      })

      // Recarregar dados
      await carregarDados()

      // Fechar diálogo
      definirDialogEmprestimo(false)
    } catch (erro) {
      console.error("Erro ao solicitar empréstimo:", erro)
      alert(`Erro ao solicitar empréstimo: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`)
    }
  }

  async function pagarParcela(emprestimoId: string) {
    if (!timeId) return

    try {
      await pagarParcelaEmprestimo(emprestimoId, timeId)

      // Recarregar dados
      await carregarDados()
    } catch (erro) {
      console.error("Erro ao pagar parcela:", erro)
      alert(`Erro ao pagar parcela: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`)
    }
  }

  async function realizarInvestimento() {
    if (!timeId) return

    try {
      // Registrar despesa de investimento
      await registrarTransacao({
        time_id: timeId,
        tipo: "despesa",
        categoria: `investimento_${formInvestimento.tipo}`,
        valor: formInvestimento.valor,
        descricao: formInvestimento.descricao,
      })

      // Recarregar dados
      await carregarDados()

      // Fechar diálogo
      definirDialogInvestimento(false)

      // Mostrar mensagem de sucesso com benefícios do investimento
      let mensagemBeneficio = ""

      switch (formInvestimento.tipo) {
        case "marketing":
          mensagemBeneficio =
            "O investimento em marketing aumentará a receita de bilheteria e produtos nas próximas partidas."
          break
        case "infraestrutura":
          mensagemBeneficio =
            "O investimento em infraestrutura melhorará as condições de treinamento e recuperação dos jogadores."
          break
        case "categoriaBase":
          mensagemBeneficio =
            "O investimento na categoria de base aumentará as chances de revelar novos talentos nas próximas temporadas."
          break
      }

      alert(`Investimento realizado com sucesso! ${mensagemBeneficio}`)
    } catch (erro) {
      console.error("Erro ao realizar investimento:", erro)
    }
  }

  if (carregando) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Financeiro</h2>
          <p className="text-zinc-500">Carregando dados financeiros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financeiro</h2>
          <p className="text-zinc-500">Gerencie as finanças do seu clube</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={buscarNovoPatrocinio} className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Novo Patrocínio
          </Button>
          <Button onClick={emitirRelatorio} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Emitir Relatório
          </Button>
          <Button onClick={() => definirDialogEmprestimo(true)} variant="outline" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Solicitar Empréstimo
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="periodo">Período:</Label>
          <Select value={periodoFiltro} onValueChange={definirPeriodoFiltro}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Última semana</SelectItem>
              <SelectItem value="mes">Último mês</SelectItem>
              <SelectItem value="ano">Último ano</SelectItem>
              <SelectItem value="todos">Todos os registros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {dadosTime.saldo_financeiro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              +12% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Receita {periodoFiltro === "mes" ? "Mensal" : periodoFiltro === "semana" ? "Semanal" : "Anual"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {balancoFinanceiro.receitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              +5% desde o período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Despesa {periodoFiltro === "mes" ? "Mensal" : periodoFiltro === "semana" ? "Semanal" : "Anual"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {balancoFinanceiro.despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-red-600 flex items-center mt-1">
              <ArrowDownIcon className="h-4 w-4 mr-1" />
              +8% desde o período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="receitas">
        <TabsList>
          <TabsTrigger value="receitas" className="flex items-center gap-2">
            <ArrowUpIcon className="h-4 w-4" />
            Receitas
          </TabsTrigger>
          <TabsTrigger value="despesas" className="flex items-center gap-2">
            <ArrowDownIcon className="h-4 w-4" />
            Despesas
          </TabsTrigger>
          <TabsTrigger value="emprestimos" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Empréstimos
          </TabsTrigger>
          <TabsTrigger value="investimentos" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Investimentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="receitas" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fontes de Receita</CardTitle>
              <PieChart className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(balancoFinanceiro.categorias.receitas).map(([categoria, valor]: [string, any]) => {
                  const percentual = (valor / balancoFinanceiro.receitas) * 100

                  // Traduzir categoria para exibição
                  let categoriaTraduzida = categoria
                  switch (categoria) {
                    case "bilheteria":
                      categoriaTraduzida = "Bilheteria"
                      break
                    case "patrocinio":
                      categoriaTraduzida = "Patrocínios"
                      break
                    case "direitos_tv":
                      categoriaTraduzida = "Direitos de TV"
                      break
                    case "venda_produtos":
                      categoriaTraduzida = "Venda de Produtos"
                      break
                    case "transferencia":
                      categoriaTraduzida = "Transferências"
                      break
                    case "emprestimo":
                      categoriaTraduzida = "Empréstimos"
                      break
                  }

                  return (
                    <div key={categoria}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{categoriaTraduzida}</h3>
                        <span className="text-sm font-medium">
                          R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentual}%`,
                            backgroundColor: dadosTime.cores.primaria,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>{percentual.toFixed(1)}% do total</span>
                        <span>+12% vs período anterior</span>
                      </div>
                    </div>
                  )
                })}

                {Object.keys(balancoFinanceiro.categorias.receitas).length === 0 && (
                  <div className="text-center py-4 text-zinc-500">
                    Nenhuma receita registrada no período selecionado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Despesas Mensais</CardTitle>
              <BarChart3 className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(balancoFinanceiro.categorias.despesas).map(([categoria, valor]: [string, any]) => {
                  const percentual = (valor / balancoFinanceiro.despesas) * 100

                  // Traduzir categoria para exibição
                  let categoriaTraduzida = categoria
                  switch (categoria) {
                    case "salarios":
                      categoriaTraduzida = "Salários"
                      break
                    case "manutencao":
                      categoriaTraduzida = "Manutenção"
                      break
                    case "viagens":
                      categoriaTraduzida = "Viagens"
                      break
                    case "reforma_estadio":
                      categoriaTraduzida = "Reforma do Estádio"
                      break
                    case "pagamento_emprestimo":
                      categoriaTraduzida = "Pagamento de Empréstimo"
                      break
                    case "transferencia":
                      categoriaTraduzida = "Contratações"
                      break
                    case "investimento_marketing":
                      categoriaTraduzida = "Investimento em Marketing"
                      break
                    case "investimento_infraestrutura":
                      categoriaTraduzida = "Investimento em Infraestrutura"
                      break
                    case "investimento_categoriaBase":
                      categoriaTraduzida = "Investimento em Categoria de Base"
                      break
                  }

                  return (
                    <div key={categoria}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{categoriaTraduzida}</h3>
                        <span className="text-sm font-medium">
                          R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-red-500" style={{ width: `${percentual}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 mt-1">
                        <span>{percentual.toFixed(1)}% do total</span>
                        <span>+5% vs período anterior</span>
                      </div>
                    </div>
                  )
                })}

                {Object.keys(balancoFinanceiro.categorias.despesas).length === 0 && (
                  <div className="text-center py-4 text-zinc-500">
                    Nenhuma despesa registrada no período selecionado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emprestimos" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Empréstimos Ativos</CardTitle>
              <LineChart className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emprestimos
                  .filter((e) => e.ativo)
                  .map((emprestimo) => (
                    <div key={emprestimo.id} className="p-4 bg-zinc-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">
                            Empréstimo de R${" "}
                            {emprestimo.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </h3>
                          <p className="text-sm text-zinc-500 mt-1">
                            {emprestimo.parcelas_pagas} de {emprestimo.parcelas_total} parcelas pagas
                          </p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span>
                                Valor da parcela: R${" "}
                                {emprestimo.valor_parcela.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span>Taxa de juros: {emprestimo.taxa_juros}% ao mês</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span>
                                Data de início: {new Date(emprestimo.data_inicio).toLocaleDateString("pt-BR")}
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-500"></span>
                              <span>Data de término: {new Date(emprestimo.data_fim).toLocaleDateString("pt-BR")}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {((emprestimo.parcelas_pagas / emprestimo.parcelas_total) * 100).toFixed(0)}% pago
                          </div>
                          <Button
                            size="sm"
                            className="mt-2"
                            onClick={() => pagarParcela(emprestimo.id)}
                            disabled={dadosTime.saldo_financeiro < emprestimo.valor_parcela}
                          >
                            Pagar Parcela
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-500"
                            style={{ width: `${(emprestimo.parcelas_pagas / emprestimo.parcelas_total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}

                {emprestimos.filter((e) => e.ativo).length === 0 && (
                  <div className="text-center py-4 text-zinc-500">Nenhum empréstimo ativo no momento</div>
                )}

                <div className="flex justify-center mt-4">
                  <Button onClick={() => definirDialogEmprestimo(true)}>Solicitar Novo Empréstimo</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investimentos" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Opções de Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">Marketing e Promoções</h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        Invista em campanhas de marketing para aumentar a receita com bilheteria e produtos
                      </p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>Aumento de público nos jogos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>Maior venda de produtos oficiais</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Retorno em 3-6 meses</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">R$ 500.000,00</div>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          definirFormInvestimento({
                            tipo: "marketing",
                            valor: 500000,
                            descricao: "Campanha de marketing",
                          })
                          definirDialogInvestimento(true)
                        }}
                        disabled={dadosTime.saldo_financeiro < 500000}
                      >
                        Investir
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">Infraestrutura de Treinamento</h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        Melhore as instalações de treinamento para aumentar o desempenho dos jogadores
                      </p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>Melhor recuperação física</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>Menos lesões</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Retorno em 6-12 meses</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">R$ 750.000,00</div>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          definirFormInvestimento({
                            tipo: "infraestrutura",
                            valor: 750000,
                            descricao: "Melhoria da infraestrutura de treinamento",
                          })
                          definirDialogInvestimento(true)
                        }}
                        disabled={dadosTime.saldo_financeiro < 750000}
                      >
                        Investir
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">Categoria de Base</h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        Invista na formação de novos talentos para o futuro do clube
                      </p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>Revelação de jogadores promissores</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>Redução de custos com contratações</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Retorno em 2-5 anos</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">R$ 250.000,00</div>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          definirFormInvestimento({
                            tipo: "categoriaBase",
                            valor: 250000,
                            descricao: "Investimento na categoria de base",
                          })
                          definirDialogInvestimento(true)
                        }}
                        disabled={dadosTime.saldo_financeiro < 250000}
                      >
                        Investir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogPatrocinio} onOpenChange={definirDialogPatrocinio}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Patrocínio</DialogTitle>
          </DialogHeader>
          <p>Implementar lógica de busca de patrocínio</p>
          <DialogFooter>
            <Button onClick={() => confirmarNovoPatrocinio(Math.floor(Math.random() * 1000000) + 500000)}>
              Confirmar Patrocínio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogRelatorio} onOpenChange={definirDialogRelatorio}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Emitir Relatório</DialogTitle>
          </DialogHeader>
          <p>Implementar lógica de emissão de relatório</p>
          <DialogFooter>
            <Button onClick={() => definirDialogRelatorio(false)}>Gerar Relatório</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogEmprestimo} onOpenChange={definirDialogEmprestimo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Empréstimo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor
              </Label>
              <Input
                type="number"
                id="valor"
                value={formEmprestimo.valor}
                onChange={(e) => definirFormEmprestimo({ ...formEmprestimo, valor: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parcelas" className="text-right">
                Parcelas
              </Label>
              <Input
                type="number"
                id="parcelas"
                value={formEmprestimo.parcelas}
                onChange={(e) => definirFormEmprestimo({ ...formEmprestimo, parcelas: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxaJuros" className="text-right">
                Taxa de Juros
              </Label>
              <Input
                type="number"
                id="taxaJuros"
                value={formEmprestimo.taxaJuros}
                onChange={(e) => definirFormEmprestimo({ ...formEmprestimo, taxaJuros: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmarEmprestimo}>Solicitar Empréstimo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogInvestimento} onOpenChange={definirDialogInvestimento}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Realizar Investimento</DialogTitle>
          </DialogHeader>
          <p>Confirmar investimento em {formInvestimento.tipo}</p>
          <DialogFooter>
            <Button onClick={realizarInvestimento}>Confirmar Investimento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
