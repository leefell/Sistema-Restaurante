"use client"

import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ComandaForm } from "./forms/comanda-form"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconReceipt, IconToolsKitchen2, IconCircleCheck, IconCircleX, IconCash } from "@tabler/icons-react"
import { type VariantProps } from "class-variance-authority"
import { badgeVariants } from "./ui/badge"

// Interfaces based on Prisma schema
export enum StatusComanda {
  ABERTA = "ABERTA",
  FECHADA = "FECHADA",
  PAGA = "PAGA",
  CANCELADA = "CANCELADA",
}

export interface Mesa {
  id: number
  numero: number
}

export interface Produto {
  id: number
  nome: string
  preco: number
}

export interface ComandaProduto {
  id: number
  quantidade: number
  produto: Produto
}

export interface Comanda {
  id: number
  dataAbertura: string
  status: StatusComanda
  mesa: Mesa
  produtos: ComandaProduto[]
}

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface StatusProps {
  variant: BadgeVariant;
  className?: string;
  icon: React.ReactNode;
  text: string;
}

// Helper to get status styles and icons
const getStatusProps = (status: StatusComanda): StatusProps => {
  switch (status) {
    case StatusComanda.ABERTA:
      return {
        variant: "default",
        className: "bg-green-500 hover:bg-green-600",
        icon: <IconToolsKitchen2 className="mr-2 h-4 w-4" />,
        text: "Aberta",
      }
    case StatusComanda.FECHADA:
      return {
        variant: "default",
        className: "bg-blue-500 hover:bg-blue-600",
        icon: <IconReceipt className="mr-2 h-4 w-4" />,
        text: "Fechada",
      }
    case StatusComanda.PAGA:
        return {
            variant: "default",
            className: "bg-emerald-500 hover:bg-emerald-600",
            icon: <IconCash className="mr-2 h-4 w-4" />,
            text: "Paga",
        }
    case StatusComanda.CANCELADA:
      return {
        variant: "destructive",
        className: "bg-red-500 hover:bg-red-600",
        icon: <IconCircleX className="mr-2 h-4 w-4" />,
        text: "Cancelada",
      }
    default:
      return {
        variant: "secondary",
        icon: null,
        text: "Desconhecido",
      }
  }
}

export function ComandaGrid() {
  const [comandas, setComandas] = useState<Comanda[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchComandas = useCallback(async () => {
    setIsLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const response = await fetch("http://localhost:3001/comanda", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setComandas(data)
      } else {
        toast.error("Falha ao buscar comandas.")
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token")
          router.push("/login")
        }
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.")
      console.error("Erro ao buscar comandas:", error)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchComandas()
  }, [fetchComandas])

  const calculateTotal = (produtos: ComandaProduto[]) => {
    return produtos.reduce(
      (acc, item) => acc + item.quantidade * Number(item.produto.preco),
      0
    )
  }

  if (isLoading && comandas.length === 0) {
    return <div className="p-8">Carregando comandas...</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Comandas Ativas</h1>
        <Link href="/dashboard/comandas/novo" passHref>
          <Button>Nova Comanda</Button>
        </Link>
      </div>

      {isLoading && comandas.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">Carregando...</div>
      ) : comandas.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">Nenhuma comanda encontrada.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {comandas.map((comanda) => {
            const statusProps = getStatusProps(comanda.status)
            const total = calculateTotal(comanda.produtos)

            return (
              <Sheet key={comanda.id}>
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Mesa {comanda.mesa.numero}</span>
                      <Badge variant={statusProps.variant} className={statusProps.className}>
                        {statusProps.icon}
                        {statusProps.text}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Aberta em: {new Date(comanda.dataAbertura).toLocaleDateString("pt-BR")} às {new Date(comanda.dataAbertura).toLocaleTimeString("pt-BR")}
                    </p>
                    <div className="mt-4">
                      <p className="text-lg font-semibold">Total: {formatCurrency(total)}</p>
                      <p className="text-sm text-muted-foreground">{comanda.produtos.length} item(s)</p>
                    </div>
                  </CardContent>
                                    <CardFooter className="grid grid-cols-2 gap-2">
                                        <SheetTrigger asChild>
                                          <Button className="w-full" variant="outline">Ver Detalhes</Button>
                                        </SheetTrigger>
                                        <Link href={`/dashboard/comandas/editar/${comanda.id}`} passHref>
                                          <Button className="w-full">Editar</Button>
                                        </Link>
                                      </CardFooter>
                                  </Card>
                                  <SheetContent className="flex flex-col">
                                      <SheetHeader>
                                          <SheetTitle>Detalhes da Comanda - Mesa {comanda.mesa.numero}</SheetTitle>
                                          <SheetDescription>
                                              Status: <span className="font-semibold">{statusProps.text}</span> | Total: <span className="font-semibold">{formatCurrency(total)}</span>
                                          </SheetDescription>
                                      </SheetHeader>
                                      <ScrollArea className="flex-grow">
                                          <Table>
                                          <TableHeader>
                                              <TableRow>
                                              <TableHead>Produto</TableHead>
                                              <TableHead className="text-center">Qtd.</TableHead>
                                              <TableHead className="text-right">Subtotal</TableHead>
                                              </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                              {comanda.produtos.map((item) => (
                                              <TableRow key={item.id}>
                                                  <TableCell>{item.produto.nome}</TableCell>
                                                  <TableCell className="text-center">{item.quantidade}</TableCell>
                                                  <TableCell className="text-right">
                                                  {formatCurrency(item.quantidade * Number(item.produto.preco))}
                                                  </TableCell>
                                              </TableRow>
                                              ))}
                                          </TableBody>
                                          <TableFooter>
                                              <TableRow>
                                                  <TableCell colSpan={2} className="font-bold">Total</TableCell>
                                                  <TableCell className="text-right font-bold">{formatCurrency(total)}</TableCell>
                                              </TableRow>
                                          </TableFooter>
                                          </Table>
                                      </ScrollArea>
                                      <SheetFooter className="mt-auto pt-4">
                                          <SheetClose asChild>
                                              <Button variant="outline">Fechar</Button>
                                          </SheetClose>
                                      </SheetFooter>
                                  </SheetContent>
                              </Sheet>            )
          })}
        </div>
      )}
    </div>
  )
}
