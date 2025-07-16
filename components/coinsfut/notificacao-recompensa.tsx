"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, X } from "lucide-react"
import { useCoinsFut } from "@/hooks/use-coinsfut"

interface NotificacaoRecompensaProps {
  onAbrirModal: () => void
}

export function NotificacaoRecompensa({ onAbrirModal }: NotificacaoRecompensaProps) {
  const { verificarRecompensaDiaria } = useCoinsFut()
  const [mostrar, setMostrar] = useState(false)
  const [recompensaInfo, setRecompensaInfo] = useState<any>(null)

  useEffect(() => {
    const info = verificarRecompensaDiaria()
    setRecompensaInfo(info)

    // Mostrar notificação se há recompensa disponível
    if (info.disponivel) {
      setMostrar(true)
    }
  }, [verificarRecompensaDiaria])

  if (!mostrar || !recompensaInfo?.disponivel) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            <div>
              <h4 className="font-semibold">Recompensa Disponível!</h4>
              <p className="text-sm opacity-90">{recompensaInfo.recompensa.moedas} CoinsFut te esperam</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrar(false)}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Dia {recompensaInfo.diasConsecutivos}
          </Badge>
          <Button
            size="sm"
            onClick={() => {
              onAbrirModal()
              setMostrar(false)
            }}
            className="bg-white text-orange-600 hover:bg-white/90 text-xs"
          >
            Coletar
          </Button>
        </div>
      </div>
    </div>
  )
}
