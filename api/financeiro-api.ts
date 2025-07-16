/**
 * API para gerenciamento financeiro
 * Fornece funções para buscar e registrar transações financeiras
 */
import { v4 as uuidv4 } from "uuid"

// Tipos
export interface Transacao {
  id: string
  time_id: string
  tipo: "receita" | "despesa"
  categoria: string
  valor: number
  data_transacao: string
  descricao: string | null
}

export interface Emprestimo {
  id: string
  time_id: string
  valor_total: number
  valor_parcela: number
  taxa_juros: number
  parcelas_total: number
  parcelas_pagas: number
  data_inicio: string
  data_fim: string
  ativo: boolean
}

// Dados exemplares
const transacoesExemplares: Transacao[] = [
  {
    id: "1",
    time_id: "1",
    tipo: "receita",
    categoria: "bilheteria",
    valor: 450000,
    data_transacao: "2023-08-15T15:00:00Z",
    descricao: "Renda da partida contra Estrela SC",
  },
  {
    id: "2",
    time_id: "1",
    tipo: "receita",
    categoria: "patrocinio",
    valor: 1200000,
    data_transacao: "2023-08-01T10:00:00Z",
    descricao: "Pagamento mensal de patrocinador master",
  },
  {
    id: "3",
    time_id: "1",
    tipo: "despesa",
    categoria: "salarios",
    valor: 2500000,
    data_transacao: "2023-08-05T10:00:00Z",
    descricao: "Folha salarial mensal",
  },
  {
    id: "4",
    time_id: "1",
    tipo: "despesa",
    categoria: "manutencao",
    valor: 350000,
    data_transacao: "2023-08-10T14:00:00Z",
    descricao: "Manutenção do estádio",
  },
]

const emprestimosExemplares: Emprestimo[] = [
  {
    id: "1",
    time_id: "1",
    valor_total: 5000000,
    valor_parcela: 458333.33,
    taxa_juros: 2.5,
    parcelas_total: 12,
    parcelas_pagas: 3,
    data_inicio: "2023-06-01",
    data_fim: "2024-05-31",
    ativo: true,
  },
]

// Funções da API
export async function buscarTransacoes(
  timeId: string,
  periodo?: { inicio: string; fim: string },
): Promise<Transacao[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 300))

  let transacoes = transacoesExemplares.filter((t) => t.time_id === timeId)

  if (periodo) {
    transacoes = transacoes.filter(
      (t) =>
        new Date(t.data_transacao) >= new Date(periodo.inicio) && new Date(t.data_transacao) <= new Date(periodo.fim),
    )
  }

  return transacoes
}

export async function registrarTransacao(transacao: Omit<Transacao, "id">): Promise<Transacao> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 400))

  const novaTransacao: Transacao = {
    ...transacao,
    id: uuidv4(),
    data_transacao: transacao.data_transacao || new Date().toISOString(),
  }

  // Em uma implementação real, salvaria no banco de dados
  // transacoesExemplares.push(novaTransacao)

  return novaTransacao
}

export async function buscarEmprestimos(timeId: string): Promise<Emprestimo[]> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 250))

  return emprestimosExemplares.filter((e) => e.time_id === timeId)
}

export async function solicitarEmprestimo(emprestimo: Omit<Emprestimo, "id">): Promise<Emprestimo> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 500))

  const novoEmprestimo: Emprestimo = {
    ...emprestimo,
    id: uuidv4(),
  }

  // Em uma implementação real, salvaria no banco de dados
  // emprestimosExemplares.push(novoEmprestimo)

  return novoEmprestimo
}

export async function pagarParcelaEmprestimo(emprestimoId: string, timeId: string): Promise<Emprestimo | null> {
  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 400))

  const index = emprestimosExemplares.findIndex((e) => e.id === emprestimoId && e.time_id === timeId)
  if (index === -1) return null

  const emprestimo = emprestimosExemplares[index]

  // Em uma implementação real, atualizaria no banco de dados
  const emprestimoAtualizado: Emprestimo = {
    ...emprestimo,
    parcelas_pagas: emprestimo.parcelas_pagas + 1,
    ativo: emprestimo.parcelas_pagas + 1 < emprestimo.parcelas_total,
  }

  return emprestimoAtualizado
}

export async function calcularBalancoFinanceiro(
  timeId: string,
  periodo?: { inicio: string; fim: string },
): Promise<{
  receitas: number
  despesas: number
  saldo: number
  categorias: {
    receitas: Record<string, number>
    despesas: Record<string, number>
  }
}> {
  // Buscar transações
  const transacoes = await buscarTransacoes(timeId, periodo)

  // Calcular totais
  const receitas = transacoes.filter((t) => t.tipo === "receita").reduce((total, t) => total + Number(t.valor), 0)

  const despesas = transacoes.filter((t) => t.tipo === "despesa").reduce((total, t) => total + Number(t.valor), 0)

  // Agrupar por categoria
  const categorias = {
    receitas: {} as Record<string, number>,
    despesas: {} as Record<string, number>,
  }

  transacoes.forEach((t) => {
    const tipo = t.tipo === "receita" ? "receitas" : "despesas"
    if (!categorias[tipo][t.categoria]) {
      categorias[tipo][t.categoria] = 0
    }
    categorias[tipo][t.categoria] += Number(t.valor)
  })

  return {
    receitas,
    despesas,
    saldo: receitas - despesas,
    categorias,
  }
}
