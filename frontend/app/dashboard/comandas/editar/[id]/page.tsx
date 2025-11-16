"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { ComandaEditForm } from "@/components/forms/comanda-edit-form"
import { Comanda } from "@/components/comanda-grid"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditarComandaPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [comanda, setComanda] = useState<Comanda | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchComanda = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Autenticação necessária.")
        router.push("/login")
        return
      }

      try {
        const response = await fetch(`http://localhost:3001/comanda/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setComanda(data)
        } else {
          toast.error("Falha ao buscar dados da comanda.")
          router.push("/dashboard")
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor.")
        console.error("Erro ao buscar comanda:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComanda()
  }, [id, router])

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" passHref>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              Editar Comanda - Mesa {comanda ? comanda.mesa.numero : <Skeleton className="h-8 w-16 inline-block" />}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Adicione ou remova produtos e altere o status da comanda.
          </p>
        </div>
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : comanda ? (
          <ComandaEditForm initialData={comanda} />
        ) : (
          <p>Comanda não encontrada.</p>
        )}
      </div>
    </div>
  )
}
