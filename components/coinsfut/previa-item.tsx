"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins } from "lucide-react"

interface PreviaItemProps {
  item: any
}

export function PreviaItem({ item }: PreviaItemProps) {
  if (!item) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="text-lg">Prévia do Item</CardTitle>
          <CardDescription>Selecione um item para ver a prévia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Nenhum item selecionado</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Prévia do Item</CardTitle>
        <CardDescription>Como ficará no seu time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <img
            src={item.imagem || "/placeholder.svg"}
            alt={item.nome}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Badge className="absolute top-2 left-2 bg-blue-500">Prévia</Badge>
        </div>

        <div>
          <h4 className="font-semibold mb-2">{item.nome}</h4>
          <p className="text-sm text-muted-foreground mb-3">{item.descricao}</p>

          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">{item.preco} CoinsFut</span>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Esta é uma prévia de como o item ficará. Compre para aplicar permanentemente ao seu time.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
