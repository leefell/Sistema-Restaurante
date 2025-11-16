"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { ProdutoForm } from "@/components/forms/produto-form"
import { Produto } from "@/app/produtos/page"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function EditarProdutoPage() {
  const params = useParams()
  const { id } = params
  const [produto, setProduto] = useState<Produto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchProduto = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Autenticação necessária.")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:3001/produto/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProduto(data)
        } else {
          toast.error("Falha ao buscar dados do produto.")
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor.")
        console.error("Erro ao buscar produto:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduto()
  }, [id])

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2"> 
            <Link href="/produtos" passHref>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Editar Produto</h1>
          </div>
          <p className="text-muted-foreground">
            Modifique os campos abaixo para atualizar o produto.
          </p>
        </div>
        {isLoading ? (
          <p>Carregando...</p>
        ) : produto ? (
          <ProdutoForm initialData={produto} />
        ) : (
          <p>Produto não encontrado.</p>
        )}
      </div>
    </div>
  )
}
