/**
 * Cliente Supabase para o lado do servidor
 * Fornece acesso à API do Supabase com chave de serviço
 */
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./tipos-banco"

export function obterClienteSupabaseServidor() {
  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Variáveis de ambiente do Supabase não configuradas")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}
