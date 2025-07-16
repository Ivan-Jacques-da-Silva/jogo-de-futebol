"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useCoinsFut } from "@/hooks/use-coinsfut"
import { AbaComprar } from "./aba-comprar"
import { AbaLoja } from "./aba-loja"
import { ModalRecompensaDiaria } from "./modal-recompensa-diaria"
import { Coins, Gift } from "lucide-react"

interface ModalCoinsFutProps {
  aberto: boolean
  aoFechar: () => void
}

export function ModalCoinsFut({ aberto, aoFechar }: ModalCoinsFutProps) {
  const { saldo, verificarRecompensaDiaria } = useCoinsFut()
  const [modalRecompensaAberto, setModalRecompensaAberto] = useState(false)

  const { disponivel } = verificarRecompensaDiaria()

  // Fechar o modal com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && aberto) {
        aoFechar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [aberto, aoFechar])

  return (
    <>
      <Dialog open={aberto} onOpenChange={aoFechar}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold">CoinsFut</DialogTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="font-bold text-yellow-500">{saldo}</span>
              </div>
              <DialogClose asChild>
                <button className="rounded-full p-1 hover:bg-muted">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </button>
              </DialogClose>
            </div>
          </DialogHeader>

          {/* Botão de recompensa diária */}
          {disponivel && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                    Recompensa diária disponível!
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setModalRecompensaAberto(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Coletar
                </Button>
              </div>
            </div>
          )}

          <Tabs defaultValue="comprar" className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="comprar">Comprar CoinsFut</TabsTrigger>
              <TabsTrigger value="loja">Loja Visual</TabsTrigger>
              <TabsTrigger value="recompensas" className="relative">
                Recompensas
                {disponivel && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comprar">
              <AbaComprar />
            </TabsContent>
            <TabsContent value="loja">
              <AbaLoja />
            </TabsContent>
            <TabsContent value="recompensas">
              <div className="text-center py-8">
                <Gift className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Recompensas Diárias</h3>
                <p className="text-muted-foreground mb-4">Volte todos os dias para coletar CoinsFut grátis!</p>
                <Button
                  onClick={() => setModalRecompensaAberto(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Ver Recompensas
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ModalRecompensaDiaria aberto={modalRecompensaAberto} aoFechar={() => setModalRecompensaAberto(false)} />
    </>
  )
}
