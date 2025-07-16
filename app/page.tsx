/**
 * Página inicial do jogo de gerenciamento de futebol
 * Exibe a interface principal com navegação em abas e conteúdo dinâmico
 */
"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MenuLateral from "@/components/menu-lateral"
import TelaInicial from "@/components/tela-inicial"
import Time from "@/components/time"
import Estadio from "@/components/estadio"
import Tabela from "@/components/tabela"
import Mercado from "@/components/mercado"
import Partida from "@/components/partida"
import Financeiro from "@/components/financeiro"
import Configuracoes from "@/components/configuracoes"
import { TemaAlternador } from "@/components/tema-alternador"
import { IconeCoinsFut } from "@/components/coinsfut/icone-coinsfut"
import { v4 as uuidv4 } from "uuid"

// Importar da nova API
import { buscarTimePorId } from "@/api/times-api"

export default function Inicio() {
  // Use a valid UUID format for the timeId
  const [timeId, definirTimeId] = useState<string | null>(null)
  const [dadosTime, definirDadosTime] = useState({
    id: "",
    nome_time: "Fúria FC",
    logo: "/placeholder.svg?height=64&width=64",
    nome_estadio: "Arena da Fúria",
    cores: {
      primaria: "#FF0000",
      secundaria: "#000000",
    },
    fundacao: "2002",
    cidade: "São Paulo",
    pais: "Brasil",
    saldo_financeiro: 25000000,
    divisao: "D",
  })
  const [carregando, definirCarregando] = useState(true)
  const [abaAtiva, definirAbaAtiva] = useState("inicial")

  useEffect(() => {
    async function inicializarJogo() {
      try {
        definirCarregando(true)

        // Simulação de inicialização
        // Em uma implementação real, verificaria se já existe um time no banco de dados
        // Use a valid UUID format
        const idTime = uuidv4()

        // Carregar dados do time
        const time = await buscarTimePorId(idTime)

        if (time) {
          definirTimeId(idTime)
          definirDadosTime({
            id: time.id,
            nome_time: time.nome,
            logo: time.logo || "/placeholder.svg?height=64&width=64",
            nome_estadio: time.nome_estadio || "Estádio",
            cores: {
              primaria: time.cor_primaria || "#FF0000",
              secundaria: time.cor_secundaria || "#000000",
            },
            fundacao: time.fundacao || "2002",
            cidade: time.cidade || "São Paulo",
            pais: time.pais || "Brasil",
            saldo_financeiro: time.saldo_financeiro,
            divisao: time.divisao || "D",
          })
        } else {
          // Se não encontrar um time, criar um novo
          definirTimeId(idTime)
        }
      } catch (erro) {
        console.error("Erro ao inicializar o jogo:", erro)
        // Em caso de erro, ainda definimos um ID para o time
        definirTimeId(uuidv4())
      } finally {
        definirCarregando(false)
      }
    }

    inicializarJogo()
  }, [])

  async function atualizarDadosTime(novosDados: any) {
    try {
      // Em uma implementação real, atualizaria no banco de dados

      // Atualizar estado local
      definirDadosTime(novosDados)
    } catch (erro) {
      console.error("Erro ao atualizar dados do time:", erro)
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <p className="text-muted-foreground">Inicializando seu time de futebol</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MenuLateral dadosTime={dadosTime} />

      <main className="flex-1 flex flex-col">
        <Tabs value={abaAtiva} onValueChange={definirAbaAtiva} className="w-full flex-1 flex flex-col">
          {/* Navegação principal (movida para o topo) */}
          <div className="border-b bg-card">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-2">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="inicial">Início</TabsTrigger>
                  <TabsTrigger value="time">Time</TabsTrigger>
                  <TabsTrigger value="estadio">Estádio</TabsTrigger>
                  <TabsTrigger value="tabela">Tabela</TabsTrigger>
                  <TabsTrigger value="mercado">Mercado</TabsTrigger>
                  <TabsTrigger value="partida">Partida</TabsTrigger>
                  <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                  <TabsTrigger value="configuracoes">Config</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="hidden md:block">
                    <IconeCoinsFut />
                  </div>
                  <TemaAlternador />
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <div className="container mx-auto">
              <TabsContent value="inicial">
                <TelaInicial dadosTime={dadosTime} timeId={timeId} />
              </TabsContent>

              <TabsContent value="time">
                <Time dadosTime={dadosTime} timeId={timeId} />
              </TabsContent>

              <TabsContent value="estadio">
                <Estadio dadosTime={dadosTime} timeId={timeId} />
              </TabsContent>

              <TabsContent value="tabela">
                <Tabela dadosTime={dadosTime} timeId={timeId} />
              </TabsContent>

              <TabsContent value="mercado">
                <Mercado dadosTime={dadosTime} timeId={timeId} />
              </TabsContent>

              <TabsContent value="partida">
                <Partida dadosTime={dadosTime} timeId={timeId} />
              </TabsContent>

              <TabsContent value="financeiro">
                <Financeiro dadosTime={dadosTime} timeId={timeId} />
              </TabsContent>

              <TabsContent value="configuracoes">
                <Configuracoes dadosTime={dadosTime} timeId={timeId} atualizarDadosTime={atualizarDadosTime} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
