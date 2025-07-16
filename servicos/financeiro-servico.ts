/**
 * Serviço para gerenciamento financeiro
 * Fornece funções para registrar transações e gerenciar empréstimos
 */
import { obterClienteSupabase } from "@/lib/supabase/cliente"
import type { Database } from "@/lib/supabase/tipos-banco"

type Financa = Database["public"]["Tables"]["financas"]["Row"]
type FinancaInsert = Database["public"]["Tables"]["financas"]["Insert"]
type Emprestimo = Database["public"]["Tables"]["emprestimos"]["Row"]
type EmprestimoInsert = Database["public"]["Tables"]["emprestimos"]["Insert"]

export async function buscarTransacoes(timeId: string, periodo?: { inicio: string; fim: string }) {
  const supabase = obterClienteSupabase()
  let query = supabase.from("financas").select("*").eq("time_id", timeId).order("data_transacao", { ascending: false })

  if (periodo) {
    query = query.gte("data_transacao", periodo.inicio).lte("data_transacao", periodo.fim)
  }

  const { data, error } = await query

  if (error) {
    console.error(`Erro ao buscar transações do time ${timeId}:`, error)
    throw error
  }

  return data
}

export async function registrarTransacao(transacao: FinancaInsert) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("financas").insert(transacao).select().single()

  if (error) {
    console.error("Erro ao registrar transação:", error)
    throw error
  }

  // Atualizar saldo do time
  const valorAtualizado = transacao.tipo === "receita" ? transacao.valor : -transacao.valor

  const { data: time } = await supabase.from("times").select("saldo_financeiro").eq("id", transacao.time_id).single()

  await supabase
    .from("times")
    .update({
      saldo_financeiro: time.saldo_financeiro + valorAtualizado,
    })
    .eq("id", transacao.time_id)

  return data
}

export async function buscarEmprestimos(timeId: string) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase
    .from("emprestimos")
    .select("*")
    .eq("time_id", timeId)
    .order("data_inicio", { ascending: false })

  if (error) {
    console.error(`Erro ao buscar empréstimos do time ${timeId}:`, error)
    throw error
  }

  return data
}

export async function solicitarEmprestimo(emprestimo: EmprestimoInsert) {
  const supabase = obterClienteSupabase()

  // Verificar se o time já tem muitos empréstimos ativos
  const { data: emprestimosAtivos, error: erroConsulta } = await supabase
    .from("emprestimos")
    .select("*")
    .eq("time_id", emprestimo.time_id)
    .eq("ativo", true)

  if (erroConsulta) {
    console.error("Erro ao verificar empréstimos ativos:", erroConsulta)
    throw erroConsulta
  }

  if (emprestimosAtivos && emprestimosAtivos.length >= 3) {
    throw new Error("O time já possui o número máximo de empréstimos ativos (3)")
  }

  // Registrar o empréstimo
  const { data, error } = await supabase.from("emprestimos").insert(emprestimo).select().single()

  if (error) {
    console.error("Erro ao solicitar empréstimo:", error)
    throw error
  }

  // Registrar a transação financeira (receita)
  await registrarTransacao({
    time_id: emprestimo.time_id,
    tipo: "receita",
    categoria: "emprestimo",
    valor: emprestimo.valor_total,
    descricao: `Empréstimo de R$ ${emprestimo.valor_total.toLocaleString("pt-BR")} em ${emprestimo.parcelas_total} parcelas`,
  })

  return data
}

export async function pagarParcelaEmprestimo(emprestimoId: string, timeId: string) {
  const supabase = obterClienteSupabase()

  // Buscar dados do empréstimo
  const { data: emprestimo, error: erroConsulta } = await supabase
    .from("emprestimos")
    .select("*")
    .eq("id", emprestimoId)
    .single()

  if (erroConsulta) {
    console.error(`Erro ao buscar empréstimo com ID ${emprestimoId}:`, erroConsulta)
    throw erroConsulta
  }

  if (!emprestimo) {
    throw new Error("Empréstimo não encontrado")
  }

  if (!emprestimo.ativo) {
    throw new Error("Este empréstimo já foi quitado")
  }

  if (emprestimo.parcelas_pagas >= emprestimo.parcelas_total) {
    throw new Error("Todas as parcelas deste empréstimo já foram pagas")
  }

  // Registrar o pagamento da parcela
  const { data, error } = await supabase
    .from("emprestimos")
    .update({
      parcelas_pagas: emprestimo.parcelas_pagas + 1,
      ativo: emprestimo.parcelas_pagas + 1 < emprestimo.parcelas_total,
    })
    .eq("id", emprestimoId)
    .select()
    .single()

  if (error) {
    console.error(`Erro ao atualizar empréstimo com ID ${emprestimoId}:`, error)
    throw error
  }

  // Registrar a transação financeira (despesa)
  await registrarTransacao({
    time_id: timeId,
    tipo: "despesa",
    categoria: "pagamento_emprestimo",
    valor: emprestimo.valor_parcela,
    descricao: `Pagamento da parcela ${emprestimo.parcelas_pagas + 1}/${emprestimo.parcelas_total} do empréstimo`,
  })

  return data
}

export async function calcularBalancoFinanceiro(timeId: string, periodo?: { inicio: string; fim: string }) {
  const transacoes = await buscarTransacoes(timeId, periodo)

  const receitas = transacoes.filter((t) => t.tipo === "receita").reduce((total, t) => total + Number(t.valor), 0)

  const despesas = transacoes.filter((t) => t.tipo === "despesa").reduce((total, t) => total + Number(t.valor), 0)

  const categorias = {
    receitas: {} as Record<string, number>,
    despesas: {} as Record<string, number>,
  }

  // Agrupar por categoria
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

export async function registrarTransacaoFinanceira(transacao: FinancaInsert) {
  const supabase = obterClienteSupabase()
  const { data, error } = await supabase.from("financas").insert(transacao).select().single()

  if (error) {
    console.error("Erro ao registrar transação financeira:", error)
    throw error
  }

  // Atualizar saldo do time
  const valorAtualizado = transacao.tipo === "receita" ? transacao.valor : -transacao.valor

  const { data: time } = await supabase.from("times").select("saldo_financeiro").eq("id", transacao.time_id).single()

  await supabase
    .from("times")
    .update({
      saldo_financeiro: time.saldo_financeiro + valorAtualizado,
    })
    .eq("id", transacao.time_id)

  return data
}
