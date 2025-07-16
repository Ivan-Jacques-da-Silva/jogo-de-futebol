"use client"

import type React from "react"

/**
 * Componente da seção de Configurações
 * Permite ao usuário alterar configurações do jogo e do time
 */
import { useState } from "react"

interface PropsConfiguracoes {
  dadosTime: {
    nome_time: string
    logo: string
    nome_estadio: string
    cores: {
      primaria: string
      secundaria: string
    }
    fundacao: string
    cidade: string
    pais: string
  }
  atualizarDadosTime: (dados: any) => void
}

export default function Configuracoes({ dadosTime, atualizarDadosTime }: PropsConfiguracoes) {
  const [formDados, definirFormDados] = useState({
    nome_time: dadosTime.nome_time,
    nome_estadio: dadosTime.nome_estadio,
    cor_primaria: dadosTime.cores.primaria,
    cor_secundaria: dadosTime.cores.secundaria,
    fundacao: dadosTime.fundacao,
    cidade: dadosTime.cidade,
    pais: dadosTime.pais,
  })

  /**
   * Atualiza os dados do formulário quando o usuário digita
   * @param e Evento de mudança do input
   */
  function atualizarForm(e: React.ChangeEvent<HTMLInputElement>) {
    definirFormDados({
      ...formDados,
      [e.target.name]: e.target.value,
    })
  }

  /**
   * Salva as alterações feitas nas configurações
   */
  function salvarAlteracoes() {
    atualizarDadosTime({
      ...dadosTime,
      nome_time: formDados.nome_time,
      nome_estadio: formDados.nome_estadio,
      cores: {
        primaria: formDados.cor_primaria,
        secundaria: formDados.cor_secundaria,
      },
      fundacao: formDados.fundacao,
      \
