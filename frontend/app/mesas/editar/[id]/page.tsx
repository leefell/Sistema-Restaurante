"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link" 
import { IconArrowLeft } from "@tabler/icons-react" 
import { MesaForm } from "@/components/forms/mesa-form"
import { Mesa } from "@/app/mesas/page"
import { toast } from "sonner"
import { Button } from "@/components/ui/button" 

export default function EditarMesaPage() {
  const params = useParams()
  const { id } = params
  const [mesa, setMesa] = useState<Mesa | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchMesa = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Autenticação necessária.")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:3001/mesa/${id}`, { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setMesa(data)
        } else {
          toast.error("Falha ao buscar dados da mesa.")
        }
      } catch (error) {
        toast.error("Erro ao conectar com o servidor.")
        console.error("Erro ao buscar mesa:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMesa()
  }, [id])

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2"> 
            <Link href="/mesas" passHref>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Editar Mesa</h1>
          </div>
          <p className="text-muted-foreground">
            Modifique os campos abaixo para atualizar a mesa.
          </p>
        </div>
        {isLoading ? (
          <p>Carregando...</p>
        ) : mesa ? (
          <MesaForm initialData={mesa} />
        ) : (
          <p>Mesa não encontrada.</p>
        )}
      </div>
    </div>
  )
}
