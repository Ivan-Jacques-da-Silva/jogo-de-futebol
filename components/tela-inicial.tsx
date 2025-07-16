"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Calendar, TrendingUp, Coins, Gift, Flame } from "lucide-react"
import { NotificacaoRecompensa } from "./coinsfut/notificacao-recompensa"
import { ModalRecompensaDiaria } from "./coinsfut/modal-recompensa-diaria"
import { useCoinsFut } from "@/hooks/use-coinsfut"

interface TelaInicialProps {
  dadosTime: any
  timeId: string | null
}

export default function TelaInicial({ dadosTime, timeId }: TelaInicialProps) {
  const { verificarRecompensaDiaria } = useCoinsFut()
  const [modalRecompensaAberto, setModalRecompensaAberto] = useState(false)
  const [recompensaInfo, setRecompensaInfo] = useState<any>(null)

  useEffect(() => {
    const info = verificarRecompensaDiaria()
    setRecompensaInfo(info)
  }, [verificarRecompensaDiaria])

  const estatisticas = [
    {
      titulo: "Posição na Liga",
      valor: "3º",
      descricao: "Divisão D",
      icone: Trophy,
      cor: "text-yellow-600",
    },
    {
      titulo: "Jogadores",
      valor: "23",
      descricao: "No elenco",
      icone: Users,
      cor: "text-blue-600",
    },
    {
      titulo: "Próxima Partida",
      valor: "2 dias",
      descricao: "vs. Rival FC",
      icone: Calendar,
      cor: "text-green-600",
    },
    {
      titulo: "Forma Atual",
      valor: "VVEVD",
      descricao: "Últimos 5 jogos",
      icone: TrendingUp,
      cor: "text-purple-600",
    },
  ]

  const noticias = [
    {
      titulo: "Nova contratação chegando!",
      descricao: "Negociações avançadas com meio-campista argentino",
      tempo: "2 horas atrás",
    },
    {
      titulo: "Estádio em reforma",
      descricao: "Melhorias na iluminação serão concluídas na próxima semana",
      tempo: "1 dia atrás",
    },
    {
      titulo: "Vitória importante!",
      descricao: "Time venceu por 2x1 no último jogo do campeonato",
      tempo: "3 dias atrás",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Notificação de recompensa */}
      <NotificacaoRecompensa onAbrirModal={() => setModalRecompensaAberto(true)} />

      {/* Header com informações do time */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <img
          src={dadosTime.logo || "/placeholder.svg"}
          alt={`Logo do ${dadosTime.nome_time}`}
          className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{dadosTime.nome_time}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {dadosTime.cidade}, {dadosTime.pais} • Fundado em {dadosTime.fundacao}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{dadosTime.nome_estadio}</Badge>
            <Badge variant="outline">Divisão {dadosTime.divisao}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <Coins className="h-5 w-5" />
            R$ {dadosTime.saldo_financeiro.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500">Saldo disponível</p>
        </div>
      </div>

      {/* Card de recompensas diárias */}
      {recompensaInfo && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg">Recompensas Diárias</CardTitle>
              </div>
              {recompensaInfo.disponivel && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Disponível!</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold">
                    {recompensaInfo.diasConsecutivos} dia{recompensaInfo.diasConsecutivos !== 1 ? "s" : ""} consecutivo
                    {recompensaInfo.diasConsecutivos !== 1 ? "s" : ""}
                  </span>
                </div>
                {recompensaInfo.disponivel && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Coins className="h-4 w-4" />
                    <span className="font-semibold">+{recompensaInfo.recompensa.moedas}</span>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setModalRecompensaAberto(true)}
                variant={recompensaInfo.disponivel ? "default" : "outline"}
                size="sm"
                className={recompensaInfo.disponivel ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
              >
                {recompensaInfo.disponivel ? "Coletar" : "Ver Progresso"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${stat.cor}`}>
                  <stat.icone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.valor}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.titulo}</p>
                  <p className="text-xs text-gray-500">{stat.descricao}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notícias e atualizações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Notícias</CardTitle>
            <CardDescription>Acompanhe as novidades do seu time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {noticias.map((noticia, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">{noticia.titulo}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{noticia.descricao}</p>
                <p className="text-xs text-gray-500 mt-1">{noticia.tempo}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Gerencie seu time rapidamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Elenco
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Próxima Partida
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver Estatísticas
            </Button>
            <Button
              className="w-full justify-start bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => setModalRecompensaAberto(true)}
            >
              <Gift className="h-4 w-4 mr-2" />
              Recompensas Diárias
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modal de recompensas */}
      <ModalRecompensaDiaria aberto={modalRecompensaAberto} aoFechar={() => setModalRecompensaAberto(false)} />
    </div>
  )
}
