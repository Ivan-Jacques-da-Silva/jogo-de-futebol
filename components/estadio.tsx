"use client"

/**
 * Componente da seção de Estádio
 * Exibe informações sobre o estádio do time
 */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users } from "lucide-react"

interface PropsEstadio {
  dadosTime: {
    nome_estadio: string
    cores: {
      primaria: string
      secundaria: string
    }
  }
}

export default function Estadio({ dadosTime }: PropsEstadio) {
  /**
   * Redireciona para a seção financeira para realizar reformas
   */
  function acessarMenuFinanceiro() {
    // Em uma implementação real, isso redirecionaria para a aba Financeiro
    alert("Redirecionando para o menu Financeiro...")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{dadosTime.nome_estadio}</h2>
        <p className="text-zinc-500">Informações sobre o estádio do seu time</p>
      </div>

      <div className="aspect-video rounded-lg overflow-hidden bg-zinc-200 relative">
        <img
          src="/placeholder.svg?height=400&width=800"
          alt={dadosTime.nome_estadio}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{dadosTime.nome_estadio}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Capacidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45.000</div>
            <CardDescription>Espectadores</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Estrutura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Nível 3</div>
            <CardDescription>Instalações</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Última Reforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2022</div>
            <CardDescription>Ano</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Estádio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Instalações</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Vestiários</span>
                  <span className="text-green-600">Excelente</span>
                </li>
                <li className="flex justify-between">
                  <span>Iluminação</span>
                  <span className="text-green-600">Boa</span>
                </li>
                <li className="flex justify-between">
                  <span>Gramado</span>
                  <span className="text-amber-600">Regular</span>
                </li>
                <li className="flex justify-between">
                  <span>Arquibancadas</span>
                  <span className="text-green-600">Boas</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Receitas</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Média de público</span>
                  <span>32.450</span>
                </li>
                <li className="flex justify-between">
                  <span>Preço do ingresso</span>
                  <span>R$ 45,00</span>
                </li>
                <li className="flex justify-between">
                  <span>Receita por jogo</span>
                  <span>R$ 1.460.250,00</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm">
              Para realizar reformas no estádio, acesse o menu Financeiro e verifique as opções disponíveis.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={acessarMenuFinanceiro}>Acessar Menu Financeiro</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
