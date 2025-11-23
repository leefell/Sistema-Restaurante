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
import { MesasDataTable } from "@/components/mesas-data-table"
import { toast } from "sonner"

export interface Mesa {
  id: number
  numero: number
  descricao: string | null
  removido: boolean
}

export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const router = useRouter()

  const fetchMesas = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const response = await fetch("http://localhost:3001/mesa", { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setMesas(data)
      } else {
        console.error("Falha ao buscar mesas")
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token")
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Erro ao buscar mesas:", error)
      toast.error("Não foi possível carregar as mesas.")
    }
  }, [router])

  useEffect(() => {
    fetchMesas()
  }, [fetchMesas])

  // Aqui eu defino as colunas da tabela
  const columns: ColumnDef<Mesa>[] = [
    {
      accessorKey: "numero",
      header: "Número",
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const mesa = row.original

        const handleDelete = async () => {
          const token = localStorage.getItem("token")
          if (!token) {
            toast.error("Você não está autenticado.")
            return
          }

          toast.promise(
            fetch(`http://localhost:3001/mesa/${mesa.id}`, { 
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then(async (response) => {
              if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Falha ao remover mesa.")
              }
              fetchMesas()
            }),
            {
              loading: "Removendo mesa...",
              success: "Mesa removida com sucesso!",
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
                onClick={() => navigator.clipboard.writeText(mesa.id.toString())}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/mesas/editar/${mesa.id}`)}>
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
          <h1 className="text-2xl font-bold">Gerenciamento de Mesas</h1>
        </div>
        <Button onClick={() => router.push("/mesas/novo")}>Nova Mesa</Button>
      </div>
      <MesasDataTable columns={columns} data={mesas} />
    </div>
  )
}
