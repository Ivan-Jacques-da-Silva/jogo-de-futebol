"use client"

/**
 * Componente de menu lateral que exibe informações detalhadas do time
 */
import { Calendar, Trophy, BarChart3, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { IconeCoinsFut } from "./coinsfut/icone-coinsfut"

interface PropsMenuLateral {
  dadosTime: {
    nome_time: string
    logo?: string
    cores: {
      primaria: string
      secundaria: string
    }
    saldo_financeiro: number
    divisao: string
  }
}

export default function MenuLateral({ dadosTime }: PropsMenuLateral) {
  const [menuAberto, definirMenuAberto] = useState(false)

  // Dados fictícios para demonstração
  const jogadoresDestaque = [
    { nome: "Carlos Silva", posicao: "ATA", forca: 85 },
    { nome: "Roberto Almeida", posicao: "MEI", forca: 82 },
    { nome: "Lucas Oliveira", posicao: "ZAG", forca: 80 },
  ]

  const proximosJogos = [
    { adversario: "Estrela SC", casa: true, data: "15/05" },
    { adversario: "Raio FC", casa: false, data: "22/05" },
    { adversario: "Trovão United", casa: true, data: "29/05" },
  ]

  // Mapeamento de cores para as divisões
  const coresDivisao = {
    A: "bg-yellow-500",
    B: "bg-blue-500",
    C: "bg-green-500",
    D: "bg-zinc-500",
  }

  // Conteúdo do menu
  const ConteudoMenu = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
            <img
              src={dadosTime.logo || "/placeholder.svg?height=64&width=64"}
              alt={`Logo do ${dadosTime.nome_time}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: dadosTime.cores.primaria }}>
              {dadosTime.nome_time}
            </h2>
            <div className="flex items-center gap-2">
              <Badge className={`${coresDivisao[dadosTime.divisao as keyof typeof coresDivisao] || "bg-zinc-500"}`}>
                Série {dadosTime.divisao}
              </Badge>
            </div>
          </div>
        </div>
        <IconeCoinsFut />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Saldo</span>
          <span className="text-sm font-bold">
            R$ {dadosTime.saldo_financeiro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <Progress
          value={Math.min(100, (dadosTime.saldo_financeiro / 50000000) * 100)}
          className="h-2"
          indicatorClassName={`bg-[${dadosTime.cores.primaria}]`}
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center">
            <Trophy className="h-4 w-4 mr-1" />
            Jogadores em Destaque
          </h3>
          <div className="space-y-2">
            {jogadoresDestaque.map((jogador, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                    {jogador.posicao.substring(0, 1)}
                  </span>
                  <span>{jogador.nome}</span>
                </div>
                <Badge variant="outline">{jogador.forca}</Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Próximos Jogos
          </h3>
          <div className="space-y-2">
            {proximosJogos.map((jogo, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{jogo.casa ? "vs " + jogo.adversario : "@ " + jogo.adversario}</span>
                <Badge variant="outline">{jogo.data}</Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center">
            <BarChart3 className="h-4 w-4 mr-1" />
            Estatísticas da Temporada
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Jogos</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Vitórias</span>
              <span className="font-medium">7</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Empates</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Derrotas</span>
              <span className="font-medium">2</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="text-xs text-muted-foreground">
          Temporada 2023/2024
          <br />
          Semana 12
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Menu para desktop */}
      <div className="w-64 h-screen bg-background border-r p-4 hidden md:block overflow-y-auto">
        <ConteudoMenu />
      </div>

      {/* Menu para mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={menuAberto} onOpenChange={definirMenuAberto}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <ConteudoMenu />
          </SheetContent>
        </Sheet>
      </div>

      {/* Ícone CoinsFut para mobile (fora do menu) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <IconeCoinsFut />
      </div>
    </>
  )
}
