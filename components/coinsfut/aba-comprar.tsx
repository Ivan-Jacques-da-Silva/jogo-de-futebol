"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Zap, Star, Crown } from "lucide-react"
import { useCoinsFut } from "@/hooks/use-coinsfut"

const PACOTES_MOEDAS = [
  {
    id: "pequeno",
    moedas: 100,
    preco: "R$ 4,99",
    icone: Coins,
    cor: "text-gray-600",
    popular: false,
  },
  {
    id: "medio",
    moedas: 500,
    preco: "R$ 19,99",
    bonus: "+50 grátis",
    icone: Zap,
    cor: "text-blue-600",
    popular: true,
  },
  {
    id: "grande",
    moedas: 1000,
    preco: "R$ 34,99",
    bonus: "+150 grátis",
    icone: Star,
    cor: "text-purple-600",
    popular: false,
  },
  {
    id: "premium",
    moedas: 5000,
    preco: "R$ 149,99",
    bonus: "+1000 grátis",
    icone: Crown,
    cor: "text-yellow-600",
    popular: false,
  },
]

export function AbaComprar() {
  const { adicionarMoedas } = useCoinsFut()
  const [comprando, setComprando] = useState<string | null>(null)

  const handleComprar = async (pacote: any) => {
    setComprando(pacote.id)

    // Simular processo de compra
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Adicionar moedas (incluindo bônus se houver)
    const totalMoedas = pacote.moedas + (pacote.bonus ? Number.parseInt(pacote.bonus.match(/\d+/)?.[0] || "0") : 0)
    adicionarMoedas(totalMoedas)

    setComprando(null)

    // Mostrar feedback de sucesso
    alert(`Compra realizada com sucesso! +${totalMoedas} CoinsFut adicionadas à sua conta.`)
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Comprar CoinsFut</h3>
        <p className="text-sm text-muted-foreground">Adquira moedas para personalizar seu time e estádio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PACOTES_MOEDAS.map((pacote) => (
          <Card key={pacote.id} className={`relative ${pacote.popular ? "border-blue-500 shadow-lg" : ""}`}>
            {pacote.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">Mais Popular</Badge>
            )}

            <CardHeader className="text-center pb-2">
              <div className={`mx-auto p-3 rounded-full bg-gray-100 dark:bg-gray-800 w-fit ${pacote.cor}`}>
                <pacote.icone className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{pacote.moedas.toLocaleString()}</CardTitle>
              <CardDescription>CoinsFut</CardDescription>
              {pacote.bonus && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {pacote.bonus}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="text-center">
              <div className="text-2xl font-bold mb-4">{pacote.preco}</div>
              <Button
                onClick={() => handleComprar(pacote)}
                disabled={comprando === pacote.id}
                className="w-full"
                variant={pacote.popular ? "default" : "outline"}
              >
                {comprando === pacote.id ? "Processando..." : "Comprar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-muted-foreground mt-6">
        <p>Pagamento seguro • Sem taxas adicionais</p>
        <p>As moedas são adicionadas instantaneamente à sua conta</p>
      </div>
    </div>
  )
}
