/**
 * Tipos TypeScript para o banco de dados Supabase
 * Define a estrutura das tabelas e relacionamentos
 */
export type Database = {
  public: {
    Tables: {
      times: {
        Row: {
          id: string
          nome: string
          logo: string | null
          nome_estadio: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          fundacao: string | null
          cidade: string | null
          pais: string | null
          saldo_financeiro: number
          divisao: string
          reputacao: number
          usuario_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          logo?: string | null
          nome_estadio?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          fundacao?: string | null
          cidade?: string | null
          pais?: string | null
          saldo_financeiro?: number
          divisao?: string
          reputacao?: number
          usuario_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          logo?: string | null
          nome_estadio?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          fundacao?: string | null
          cidade?: string | null
          pais?: string | null
          saldo_financeiro?: number
          divisao?: string
          reputacao?: number
          usuario_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      jogadores: {
        Row: {
          id: string
          nome: string
          idade: number
          posicao: string
          forca: number
          moral: number
          condicao: number
          salario: number
          valor_mercado: number
          time_id: string | null
          titular: boolean
          contrato_inicio: string
          contrato_fim: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          idade: number
          posicao: string
          forca: number
          moral: number
          condicao: number
          salario: number
          valor_mercado: number
          time_id?: string | null
          titular?: boolean
          contrato_inicio: string
          contrato_fim: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          idade?: number
          posicao?: string
          forca?: number
          moral?: number
          condicao?: number
          salario?: number
          valor_mercado?: number
          time_id?: string | null
          titular?: boolean
          contrato_inicio?: string
          contrato_fim?: string
          criado_em?: string
          atualizado_em?: string
        }
      }
      estadios: {
        Row: {
          id: string
          time_id: string | null
          capacidade: number
          nivel_estrutura: number
          nivel_gramado: number
          nivel_iluminacao: number
          nivel_seguranca: number
          nivel_vestiarios: number
          ultima_reforma: string | null
          preco_ingresso: number
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          time_id?: string | null
          capacidade?: number
          nivel_estrutura?: number
          nivel_gramado?: number
          nivel_iluminacao?: number
          nivel_seguranca?: number
          nivel_vestiarios?: number
          ultima_reforma?: string | null
          preco_ingresso?: number
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          time_id?: string | null
          capacidade?: number
          nivel_estrutura?: number
          nivel_gramado?: number
          nivel_iluminacao?: number
          nivel_seguranca?: number
          nivel_vestiarios?: number
          ultima_reforma?: string | null
          preco_ingresso?: number
          criado_em?: string
          atualizado_em?: string
        }
      }
      partidas: {
        Row: {
          id: string
          time_casa_id: string | null
          time_visitante_id: string | null
          gols_casa: number
          gols_visitante: number
          data_partida: string | null
          campeonato: string | null
          rodada: number | null
          finalizada: boolean
          estadio_id: string | null
          publico: number | null
          renda: number | null
          temporada: number | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          time_casa_id?: string | null
          time_visitante_id?: string | null
          gols_casa?: number
          gols_visitante?: number
          data_partida?: string | null
          campeonato?: string | null
          rodada?: number | null
          finalizada?: boolean
          estadio_id?: string | null
          publico?: number | null
          renda?: number | null
          temporada?: number | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          time_casa_id?: string | null
          time_visitante_id?: string | null
          gols_casa?: number
          gols_visitante?: number
          data_partida?: string | null
          campeonato?: string | null
          rodada?: number | null
          finalizada?: boolean
          estadio_id?: string | null
          publico?: number | null
          renda?: number | null
          temporada?: number | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      eventos_partida: {
        Row: {
          id: string
          partida_id: string
          minuto: number
          tipo_evento: string
          descricao: string
          jogador_id: string | null
          time_id: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          partida_id: string
          minuto: number
          tipo_evento: string
          descricao: string
          jogador_id?: string | null
          time_id?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          partida_id?: string
          minuto?: number
          tipo_evento?: string
          descricao?: string
          jogador_id?: string | null
          time_id?: string | null
          criado_em?: string
        }
      }
      financas: {
        Row: {
          id: string
          time_id: string
          tipo: string
          categoria: string
          valor: number
          data_transacao: string
          descricao: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          time_id: string
          tipo: string
          categoria: string
          valor: number
          data_transacao?: string
          descricao?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          time_id?: string
          tipo?: string
          categoria?: string
          valor?: number
          data_transacao?: string
          descricao?: string | null
          criado_em?: string
        }
      }
      emprestimos: {
        Row: {
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
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          time_id: string
          valor_total: number
          valor_parcela: number
          taxa_juros: number
          parcelas_total: number
          parcelas_pagas?: number
          data_inicio: string
          data_fim: string
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          time_id?: string
          valor_total?: number
          valor_parcela?: number
          taxa_juros?: number
          parcelas_total?: number
          parcelas_pagas?: number
          data_inicio?: string
          data_fim?: string
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
      }
      formacoes: {
        Row: {
          id: string
          time_id: string
          nome: string
          estilo_jogo: string | null
          nivel_pressao: string | null
          tipo_marcacao: string | null
          tipo_passe: string | null
          ativa: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          time_id: string
          nome: string
          estilo_jogo?: string | null
          nivel_pressao?: string | null
          tipo_marcacao?: string | null
          tipo_passe?: string | null
          ativa?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          time_id?: string
          nome?: string
          estilo_jogo?: string | null
          nivel_pressao?: string | null
          tipo_marcacao?: string | null
          tipo_passe?: string | null
          ativa?: boolean
          criado_em?: string
          atualizado_em?: string
        }
      }
      posicoes_formacao: {
        Row: {
          id: string
          formacao_id: string
          jogador_id: string | null
          posicao_x: number
          posicao_y: number
          ordem: number
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          formacao_id: string
          jogador_id?: string | null
          posicao_x: number
          posicao_y: number
          ordem: number
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          formacao_id?: string
          jogador_id?: string | null
          posicao_x?: number
          posicao_y?: number
          ordem?: number
          criado_em?: string
          atualizado_em?: string
        }
      }
      treinamentos: {
        Row: {
          id: string
          time_id: string
          tipo: string
          intensidade: number
          data_inicio: string
          data_fim: string | null
          descricao: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          time_id: string
          tipo: string
          intensidade: number
          data_inicio?: string
          data_fim?: string | null
          descricao?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          time_id?: string
          tipo?: string
          intensidade?: number
          data_inicio?: string
          data_fim?: string | null
          descricao?: string | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      jogadores_treinamento: {
        Row: {
          id: string
          treinamento_id: string
          jogador_id: string
          ganho_atributo: number
          perda_condicao: number
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          treinamento_id: string
          jogador_id: string
          ganho_atributo?: number
          perda_condicao?: number
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          treinamento_id?: string
          jogador_id?: string
          ganho_atributo?: number
          perda_condicao?: number
          criado_em?: string
          atualizado_em?: string
        }
      }
    }
  }
}
