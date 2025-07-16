/**
 * Cliente Supabase para o lado do cliente
 * Fornece acesso à API do Supabase com autenticação anônima
 */
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./tipos-banco"

// Cria uma instância singleton do cliente Supabase
let clienteInstancia: ReturnType<typeof createClient<Database>> | null = null

export function obterClienteSupabase() {
  if (clienteInstancia) return clienteInstancia

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variáveis de ambiente do Supabase não configuradas")
  }

  clienteInstancia = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return clienteInstancia
}
