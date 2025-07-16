import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RecompensaDiaria {
  dia: number
  moedas: number
  bonus?: string
  coletada: boolean
}

interface EstadoCoinsFut {
  saldo: number
  adicionarMoedas: (quantidade: number) => void
  removerMoedas: (quantidade: number) => boolean
  itensComprados: {
    uniformes: string[]
    itensEstadio: string[]
    brasoes: string[]
  }
  adicionarItemComprado: (tipo: "uniformes" | "itensEstadio" | "brasoes", id: string) => void
  uniformeAtivo: string | null
  brasaoAtivo: string | null
  itensEstadioAtivos: string[]
  definirUniformeAtivo: (id: string | null) => void
  definirBrasaoAtivo: (id: string | null) => void
  adicionarItemEstadioAtivo: (id: string) => void
  removerItemEstadioAtivo: (id: string) => void

  // Sistema de recompensas diárias
  ultimoLogin: string | null
  diasConsecutivos: number
  recompensaColetadaHoje: boolean
  verificarRecompensaDiaria: () => { disponivel: boolean; diasConsecutivos: number; recompensa: RecompensaDiaria }
  coletarRecompensaDiaria: () => RecompensaDiaria | null
  obterRecompensasSemanais: () => RecompensaDiaria[]
}

const RECOMPENSAS_DIARIAS: RecompensaDiaria[] = [
  { dia: 1, moedas: 50, coletada: false },
  { dia: 2, moedas: 75, coletada: false },
  { dia: 3, moedas: 100, coletada: false },
  { dia: 4, moedas: 125, coletada: false },
  { dia: 5, moedas: 150, bonus: "Fim de semana!", coletada: false },
  { dia: 6, moedas: 200, bonus: "Sábado especial!", coletada: false },
  { dia: 7, moedas: 300, bonus: "Recompensa semanal!", coletada: false },
]

function obterDataHoje(): string {
  return new Date().toISOString().split("T")[0]
}

function calcularDiferenciaDias(data1: string, data2: string): number {
  const d1 = new Date(data1)
  const d2 = new Date(data2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const useCoinsFut = create<EstadoCoinsFut>()(
  persist(
    (set, get) => ({
      saldo: 100, // Saldo inicial para teste
      adicionarMoedas: (quantidade) => set((state) => ({ saldo: state.saldo + quantidade })),
      removerMoedas: (quantidade) => {
        const { saldo } = get()
        if (saldo >= quantidade) {
          set({ saldo: saldo - quantidade })
          return true
        }
        return false
      },
      itensComprados: {
        uniformes: ["padrao"],
        itensEstadio: [],
        brasoes: ["padrao"],
      },
      adicionarItemComprado: (tipo, id) =>
        set((state) => ({
          itensComprados: {
            ...state.itensComprados,
            [tipo]: [...state.itensComprados[tipo], id],
          },
        })),
      uniformeAtivo: "padrao",
      brasaoAtivo: "padrao",
      itensEstadioAtivos: [],
      definirUniformeAtivo: (id) => set({ uniformeAtivo: id }),
      definirBrasaoAtivo: (id) => set({ brasaoAtivo: id }),
      adicionarItemEstadioAtivo: (id) =>
        set((state) => ({
          itensEstadioAtivos: [...state.itensEstadioAtivos, id],
        })),
      removerItemEstadioAtivo: (id) =>
        set((state) => ({
          itensEstadioAtivos: state.itensEstadioAtivos.filter((item) => item !== id),
        })),

      // Sistema de recompensas diárias
      ultimoLogin: null,
      diasConsecutivos: 0,
      recompensaColetadaHoje: false,

      verificarRecompensaDiaria: () => {
        const { ultimoLogin, diasConsecutivos, recompensaColetadaHoje } = get()
        const hoje = obterDataHoje()
        const diferenca = calcularDiferenciaDias(ultimoLogin || hoje, hoje)

        let novosDiasConsecutivos = diasConsecutivos
        let disponivel = false

        if (!ultimoLogin) {
          // Primeiro login
          novosDiasConsecutivos = 1
          disponivel = true
        } else {
          if (diferenca === 0) {
            // Mesmo dia - verificar se já coletou
            disponivel = !recompensaColetadaHoje
          } else if (diferenca === 1) {
            // Dia consecutivo
            novosDiasConsecutivos = Math.min(diasConsecutivos + 1, 7)
            disponivel = true
          } else {
            // Quebrou a sequência
            novosDiasConsecutivos = 1
            disponivel = true
          }
        }

        // Atualizar estado se necessário
        if (ultimoLogin !== hoje || diasConsecutivos !== novosDiasConsecutivos) {
          set({
            ultimoLogin: hoje,
            diasConsecutivos: novosDiasConsecutivos,
            recompensaColetadaHoje: diferenca > 0 ? false : recompensaColetadaHoje,
          })
        }

        const recompensa = RECOMPENSAS_DIARIAS[novosDiasConsecutivos - 1]

        return {
          disponivel,
          diasConsecutivos: novosDiasConsecutivos,
          recompensa,
        }
      },

      coletarRecompensaDiaria: () => {
        const { verificarRecompensaDiaria, adicionarMoedas } = get()
        const { disponivel, recompensa } = verificarRecompensaDiaria()

        if (disponivel && recompensa) {
          adicionarMoedas(recompensa.moedas)
          set({ recompensaColetadaHoje: true })
          return recompensa
        }

        return null
      },

      obterRecompensasSemanais: () => {
        const { diasConsecutivos } = get()
        return RECOMPENSAS_DIARIAS.map((recompensa, index) => ({
          ...recompensa,
          coletada: index < diasConsecutivos,
        }))
      },
    }),
    {
      name: "coinsfut-storage",
    },
  ),
)
