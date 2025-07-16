"use client"

import { useState } from "react"
import { Coins, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCoinsFut } from "@/hooks/use-coinsfut"
import { ModalCoinsFut } from "./modal-coinsfut"

export function IconeCoinsFut() {
  const { saldo, verificarRecompensaDiaria } = useCoinsFut()
  const [modalAberto, setModalAberto] = useState(false)

  const { disponivel } = verificarRecompensaDiaria()

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setModalAberto(true)}
        className="relative flex items-center gap-2 hover:bg-yellow-50 hover:border-yellow-300 dark:hover:bg-yellow-900/20"
      >
        <div className="relative">
          <Coins className="h-4 w-4 text-yellow-500" />
          {disponivel && (
            <div className="absolute -top-1 -right-1">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
        <span className="font-semibold text-yellow-600">{saldo}</span>
        {disponivel && (
          <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs px-1 py-0">
            <Gift className="h-3 w-3" />
          </Badge>
        )}
      </Button>

      <ModalCoinsFut aberto={modalAberto} aoFechar={() => setModalAberto(false)} />
    </>
  )
}
