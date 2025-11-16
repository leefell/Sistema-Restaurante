/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { IconArrowLeft } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProdutosDataTable } from "@/components/produtos-data-table"
import { toast } from "sonner"

export interface Produto {
  id: number
  nome: string
  descricao: string | null
  quantidade: number
  preco: number
  removido: boolean
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const router = useRouter()

  const fetchProdutos = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const response = await fetch("http://localhost:3001/produto", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProdutos(data)
      } else {
        console.error("Falha ao buscar produtos")
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token")
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
      toast.error("Não foi possível carregar os produtos.")
    }
  }, [router])

  useEffect(() => {
    fetchProdutos()
  }, [fetchProdutos])

  const columns: ColumnDef<Produto>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
    },
    {
      accessorKey: "quantidade",
      header: "Quantidade",
    },
    {
      accessorKey: "preco",
      header: "Preço",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("preco"))
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const produto = row.original

        const handleDelete = async () => {
          const token = localStorage.getItem("token")
          if (!token) {
            toast.error("Você não está autenticado.")
            return
          }

          toast.promise(
            fetch(`http://localhost:3001/produto/${produto.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then(async (response) => {
              if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Falha ao remover produto.")
              }
              fetchProdutos()
            }),
            {
              loading: "Removendo produto...",
              success: "Produto removido com sucesso!",
              error: (err) => err.message,
            }
          )
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(produto.id.toString())}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/produtos/editar/${produto.id}`)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <IconArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
        </div>
        <Button onClick={() => router.push("/produtos/novo")}>Novo Produto</Button>
      </div>
      <ProdutosDataTable columns={columns} data={produtos} />
    </div>
  )
}
