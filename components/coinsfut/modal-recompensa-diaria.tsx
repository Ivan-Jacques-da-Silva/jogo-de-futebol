"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coins, Gift, Calendar, Flame } from "lucide-react"
import { useCoinsFut } from "@/hooks/use-coinsfut"

interface ModalRecompensaDiariaProps {
  aberto: boolean
  aoFechar: () => void
}

export function ModalRecompensaDiaria({ aberto, aoFechar }: ModalRecompensaDiariaProps) {
  const { verificarRecompensaDiaria, coletarRecompensaDiaria, obterRecompensasSemanais } = useCoinsFut()
  const [recompensaColetada, setRecompensaColetada] = useState<any>(null)
  const [mostrarAnimacao, setMostrarAnimacao] = useState(false)

  const { disponivel, diasConsecutivos, recompensa } = verificarRecompensaDiaria()
  const recompensasSemanais = obterRecompensasSemanais()

  const handleColetarRecompensa = () => {
    const recompensaRecebida = coletarRecompensaDiaria()
    if (recompensaRecebida) {
      setRecompensaColetada(recompensaRecebida)
      setMostrarAnimacao(true)

      // Fechar o modal após a animação
      setTimeout(() => {
        aoFechar()
        setMostrarAnimacao(false)
        setRecompensaColetada(null)
      }, 2000)
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="sm:max-w-[500px] animate-in slide-in-from-bottom duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="h-6 w-6 text-yellow-500" />
            Recompensa Diária
          </DialogTitle>
        </DialogHeader>

        {mostrarAnimacao && recompensaColetada ? (
          <div className="text-center py-8 space-y-4">
            <div className="animate-bounce">
              <Coins className="h-16 w-16 text-yellow-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-green-600">+{recompensaColetada.moedas} CoinsFut!</h3>
            {recompensaColetada.bonus && <p className="text-lg text-muted-foreground">{recompensaColetada.bonus}</p>}
            <div className="text-sm text-muted-foreground">Recompensa coletada com sucesso!</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status atual */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-semibold">
                  {diasConsecutivos} dia{diasConsecutivos !== 1 ? "s" : ""} consecutivo
                  {diasConsecutivos !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Continue voltando para manter sua sequência!</p>
            </div>

            {/* Recompensa de hoje */}
            {disponivel && recompensa && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold">Recompensa de Hoje</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Coins className="h-6 w-6 text-yellow-500" />
                    <span className="text-2xl font-bold text-yellow-600">{recompensa.moedas}</span>
                  </div>
                  {recompensa.bonus && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {recompensa.bonus}
                    </Badge>
                  )}
                  <Button
                    onClick={handleColetarRecompensa}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Coletar Recompensa
                  </Button>
                </div>
              </div>
            )}

            {!disponivel && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">Você já coletou sua recompensa de hoje!</p>
                <p className="text-sm text-muted-foreground mt-1">Volte amanhã para continuar sua sequência.</p>
              </div>
            )}

            {/* Calendário semanal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-center">Recompensas da Semana</h4>
              <div className="grid grid-cols-7 gap-2">
                {recompensasSemanais.map((recompensaDia, index) => (
                  <div
                    key={recompensaDia.dia}
                    className={`
                      text-center p-2 rounded-lg border text-xs
                      ${
                        recompensaDia.coletada
                          ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
                          : index === diasConsecutivos - 1 && disponivel
                            ? "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300"
                            : "bg-muted border-muted-foreground/20"
                      }
                    `}
                  >
                    <div className="font-semibold">Dia {recompensaDia.dia}</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Coins className="h-3 w-3" />
                      <span>{recompensaDia.moedas}</span>
                    </div>
                    {recompensaDia.coletada && <div className="text-green-600 mt-1">✓</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              As recompensas resetam se você ficar um dia sem jogar
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
