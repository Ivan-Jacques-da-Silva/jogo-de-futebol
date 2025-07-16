"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Shirt, Flag, Shield, Check } from "lucide-react"
import { useCoinsFut } from "@/hooks/use-coinsfut"
import { PreviaItem } from "./previa-item"

const UNIFORMES = [
  {
    id: "classico",
    nome: "Uniforme Clássico",
    preco: 150,
    imagem: "/placeholder.svg?height=200&width=150",
    descricao: "Design tradicional com listras verticais",
  },
  {
    id: "moderno",
    nome: "Uniforme Moderno",
    preco: 200,
    imagem: "/placeholder.svg?height=200&width=150",
    descricao: "Design contemporâneo com detalhes únicos",
  },
  {
    id: "retro",
    nome: "Uniforme Retrô",
    preco: 250,
    imagem: "/placeholder.svg?height=200&width=150",
    descricao: "Inspirado nos anos 80",
  },
]

const ITENS_ESTADIO = [
  {
    id: "bandeiras",
    nome: "Bandeiras Personalizadas",
    preco: 100,
    imagem: "/placeholder.svg?height=150&width=200",
    descricao: "Bandeiras com cores do time",
  },
  {
    id: "assentos-vip",
    nome: "Assentos VIP",
    preco: 300,
    imagem: "/placeholder.svg?height=150&width=200",
    descricao: "Assentos premium para torcedores",
  },
  {
    id: "iluminacao",
    nome: "Iluminação LED",
    preco: 500,
    imagem: "/placeholder.svg?height=150&width=200",
    descricao: "Sistema de iluminação moderno",
  },
]

const BRASOES = [
  {
    id: "escudo-classico",
    nome: "Escudo Clássico",
    preco: 120,
    imagem: "/placeholder.svg?height=150&width=150",
    descricao: "Design tradicional de escudo",
  },
  {
    id: "escudo-moderno",
    nome: "Escudo Moderno",
    preco: 180,
    imagem: "/placeholder.svg?height=150&width=150",
    descricao: "Design contemporâneo",
  },
  {
    id: "escudo-premium",
    nome: "Escudo Premium",
    preco: 250,
    imagem: "/placeholder.svg?height=150&width=150",
    descricao: "Design exclusivo com detalhes dourados",
  },
]

export function AbaLoja() {
  const {
    saldo,
    removerMoedas,
    adicionarItemComprado,
    itensComprados,
    uniformeAtivo,
    brasaoAtivo,
    itensEstadioAtivos,
    definirUniformeAtivo,
    definirBrasaoAtivo,
    adicionarItemEstadioAtivo,
  } = useCoinsFut()

  const [itemSelecionado, setItemSelecionado] = useState<any>(null)
  const [comprando, setComprando] = useState<string | null>(null)

  const handleComprarItem = async (item: any, tipo: "uniformes" | "itensEstadio" | "brasoes") => {
    if (saldo < item.preco) {
      alert("Saldo insuficiente!")
      return
    }

    setComprando(item.id)

    // Simular processo de compra
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (removerMoedas(item.preco)) {
      adicionarItemComprado(tipo, item.id)
      alert(`${item.nome} comprado com sucesso!`)
    }

    setComprando(null)
  }

  const handleAtivarItem = (item: any, tipo: "uniformes" | "brasoes" | "itensEstadio") => {
    switch (tipo) {
      case "uniformes":
        definirUniformeAtivo(item.id)
        break
      case "brasoes":
        definirBrasaoAtivo(item.id)
        break
      case "itensEstadio":
        if (itensEstadioAtivos.includes(item.id)) {
          // Remover se já estiver ativo
          // Implementar função de remoção se necessário
        } else {
          adicionarItemEstadioAtivo(item.id)
        }
        break
    }
  }

  const renderItem = (item: any, tipo: "uniformes" | "itensEstadio" | "brasoes") => {
    const jaComprado = itensComprados[tipo].includes(item.id)
    const ativo =
      tipo === "uniformes"
        ? uniformeAtivo === item.id
        : tipo === "brasoes"
          ? brasaoAtivo === item.id
          : itensEstadioAtivos.includes(item.id)

    return (
      <Card
        key={item.id}
        className={`cursor-pointer transition-all hover:shadow-lg ${
          itemSelecionado?.id === item.id ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={() => setItemSelecionado(item)}
      >
        <CardHeader className="pb-2">
          <div className="relative">
            <img
              src={item.imagem || "/placeholder.svg"}
              alt={item.nome}
              className="w-full h-32 object-cover rounded-md"
            />
            {ativo && (
              <Badge className="absolute top-2 right-2 bg-green-500">
                <Check className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-sm mb-1">{item.nome}</CardTitle>
          <CardDescription className="text-xs mb-3">{item.descricao}</CardDescription>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{item.preco}</span>
            </div>

            {jaComprado ? (
              <Button
                size="sm"
                variant={ativo ? "secondary" : "outline"}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAtivarItem(item, tipo)
                }}
              >
                {ativo ? "Ativo" : "Usar"}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleComprarItem(item, tipo)
                }}
                disabled={comprando === item.id || saldo < item.preco}
              >
                {comprando === item.id ? "..." : "Comprar"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Loja Visual</h3>
        <p className="text-sm text-muted-foreground">Personalize seu time com itens exclusivos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="uniformes">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="uniformes" className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                Uniformes
              </TabsTrigger>
              <TabsTrigger value="estadio" className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Estádio
              </TabsTrigger>
              <TabsTrigger value="brasoes" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Brasões
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uniformes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {UNIFORMES.map((item) => renderItem(item, "uniformes"))}
              </div>
            </TabsContent>

            <TabsContent value="estadio">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ITENS_ESTADIO.map((item) => renderItem(item, "itensEstadio"))}
              </div>
            </TabsContent>

            <TabsContent value="brasoes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BRASOES.map((item) => renderItem(item, "brasoes"))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <PreviaItem item={itemSelecionado} />
        </div>
      </div>
    </div>
  )
}
