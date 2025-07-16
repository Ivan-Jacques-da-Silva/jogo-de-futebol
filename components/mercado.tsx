"use client"

/**
 * Componente da seção de Mercado
 * Exibe jogadores disponíveis para contratação e opções de negociação
 */
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ShoppingCart, TrendingUp, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buscarJogadoresNoMercado } from "@/api/jogadores-api"

interface PropsMercado {
  dadosTime: {
    nome_time: string
    cores: {
      primaria: string
      secundaria: string
    }
  }
  timeId: string | null
}

export default function Mercado({ dadosTime, timeId }: PropsMercado) {
  const [termoBusca, definirTermoBusca] = useState("")
  const [jogadoresMercado, definirJogadoresMercado] = useState<any[]>([])
  const [carregando, definirCarregando] = useState(false)

  // Dados fictícios de jogadores do time para venda
  const jogadoresParaVenda = [
    { id: 101, nome: "Rodrigo Nunes", idade: 22, posicao: "GOL", forca: 75, valorMercado: 5800000 },
    { id: 102, nome: "Bruno Ferreira", idade: 24, posicao: "ZAG", forca: 74, valorMercado: 5200000 },
    { id: 103, nome: "Matheus Lopes", idade: 21, posicao: "LD", forca: 72, valorMercado: 4800000 },
    { id: 104, nome: "Vitor Ribeiro", idade: 23, posicao: "VOL", forca: 73, valorMercado: 5000000 },
  ]

  // Dados fictícios de propostas recebidas
  const propostasRecebidas = [
    { id: 201, jogador: "Leonardo Castro", idade: 20, posicao: "MEI", time: "Flamengo RJ", valor: 6200000 },
    { id: 202, jogador: "Gabriel Rocha", idade: 22, posicao: "ATA", time: "Palmeiras FC", valor: 7500000 },
    { id: 203, jogador: "Diego Almeida", idade: 19, posicao: "ATA", time: "São Paulo FC", valor: 5900000 },
  ]

  useEffect(() => {
    carregarJogadoresMercado()
  }, [])

  async function carregarJogadoresMercado() {
    try {
      definirCarregando(true)
      const jogadores = await buscarJogadoresNoMercado(termoBusca)
      definirJogadoresMercado(jogadores)
    } catch (erro) {
      console.error("Erro ao carregar jogadores do mercado:", erro)
    } finally {
      definirCarregando(false)
    }
  }

  /**
   * Filtra jogadores com base no termo de busca
   */
  function buscarJogadores() {
    carregarJogadoresMercado()
  }

  /**
   * Inicia negociação para contratar um jogador
   * @param id ID do jogador a ser contratado
   */
  function negociarContratacao(id: string) {
    const jogador = jogadoresMercado.find((j) => j.id === id)
    if (jogador) {
      alert(
        `Iniciando negociação para contratar ${jogador.nome} por R$ ${(jogador.valor / 1000000).toFixed(2)} milhões`,
      )
    }
  }

  /**
   * Coloca um jogador à venda no mercado
   * @param id ID do jogador a ser vendido
   */
  function venderJogador(id: number) {
    const jogador = jogadoresParaVenda.find((j) => j.id === id)
    if (jogador) {
      alert(`${jogador.nome} colocado à venda por R$ ${(jogador.valorMercado / 1000000).toFixed(2)} milhões`)
    }
  }

  /**
   * Aceita uma proposta recebida por um jogador
   * @param id ID da proposta a ser aceita
   */
  function aceitarProposta(id: number) {
    const proposta = propostasRecebidas.find((p) => p.id === id)
    if (proposta) {
      alert(
        `Proposta de R$ ${(proposta.valor / 1000000).toFixed(2)} milhões do ${proposta.time} por ${proposta.jogador} aceita!`,
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mercado de Transferências</h2>
        <p className="text-muted-foreground">Contrate, venda e negocie jogadores</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome ou posição..."
            className="pl-9"
            value={termoBusca}
            onChange={(e) => definirTermoBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarJogadores()}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Saldo disponível:</span>
          <span className="font-bold text-green-600 dark:text-green-400">R$ 25.000.000,00</span>
        </div>
      </div>

      <Tabs defaultValue="contratar">
        <TabsList className="w-full sm:w-auto tabs-scrollable">
          <TabsTrigger value="contratar" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Contratar</span>
            <span className="sm:hidden">Comprar</span>
          </TabsTrigger>
          <TabsTrigger value="vender" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Vender
          </TabsTrigger>
          <TabsTrigger value="propostas" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Propostas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contratar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Jogadores Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {carregando ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden sm:table-cell">Idade</TableHead>
                        <TableHead>Posição</TableHead>
                        <TableHead className="hidden sm:table-cell">Força</TableHead>
                        <TableHead className="hidden md:table-cell">Time Atual</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jogadoresMercado.map((jogador) => (
                        <TableRow key={jogador.id}>
                          <TableCell className="font-medium">{jogador.nome}</TableCell>
                          <TableCell className="hidden sm:table-cell">{jogador.idade}</TableCell>
                          <TableCell>{jogador.posicao}</TableCell>
                          <TableCell className="hidden sm:table-cell">{jogador.forca}</TableCell>
                          <TableCell className="hidden md:table-cell">{jogador.time}</TableCell>
                          <TableCell className="text-right">R$ {(jogador.valor / 1000000).toFixed(2)} M</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => negociarContratacao(jogador.id)}>
                              <span className="hidden sm:inline">Negociar</span>
                              <span className="sm:hidden">+</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vender" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Seus Jogadores para Venda</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">Idade</TableHead>
                      <TableHead>Posição</TableHead>
                      <TableHead className="hidden sm:table-cell">Força</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jogadoresParaVenda.map((jogador) => (
                      <TableRow key={jogador.id}>
                        <TableCell className="font-medium">{jogador.nome}</TableCell>
                        <TableCell className="hidden sm:table-cell">{jogador.idade}</TableCell>
                        <TableCell>{jogador.posicao}</TableCell>
                        <TableCell className="hidden sm:table-cell">{jogador.forca}</TableCell>
                        <TableCell className="text-right">R$ {(jogador.valorMercado / 1000000).toFixed(2)} M</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => venderJogador(jogador.id)}>
                            <span className="hidden sm:inline">Vender</span>
                            <span className="sm:hidden">$</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="propostas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Propostas Recebidas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jogador</TableHead>
                      <TableHead className="hidden sm:table-cell">Idade</TableHead>
                      <TableHead>Posição</TableHead>
                      <TableHead className="hidden md:table-cell">Time</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propostasRecebidas.map((proposta) => (
                      <TableRow key={proposta.id}>
                        <TableCell className="font-medium">{proposta.jogador}</TableCell>
                        <TableCell className="hidden sm:table-cell">{proposta.idade}</TableCell>
                        <TableCell>{proposta.posicao}</TableCell>
                        <TableCell className="hidden md:table-cell">{proposta.time}</TableCell>
                        <TableCell className="text-right">R$ {(proposta.valor / 1000000).toFixed(2)} M</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => aceitarProposta(proposta.id)}>
                            <span className="hidden sm:inline">Aceitar</span>
                            <span className="sm:hidden">✓</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
