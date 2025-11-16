/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Mesa } from "@/app/mesas/page" 

interface MesaFormProps {
  initialData?: Mesa
}

export function MesaForm({ initialData }: MesaFormProps) {
  const router = useRouter()
  const [numero, setNumero] = useState("")
  const [descricao, setDescricao] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isEditMode = Boolean(initialData)

  useEffect(() => {
    if (initialData) {
      setNumero(initialData.numero.toString())
      setDescricao(initialData.descricao || "")
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Erro de autenticação", {
        description: "Por favor, faça login novamente.",
      })
      setIsLoading(false)
      router.push("/login")
      return
    }

    const url = isEditMode
      ? `http://localhost:3001/mesa/${initialData?.id}`
      : "http://localhost:3001/mesa"
    
    const method = isEditMode ? "PUT" : "POST"

    toast.promise(
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numero: parseInt(numero, 10),
          descricao,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || `Falha ao ${isEditMode ? 'atualizar' : 'cadastrar'} mesa.`)
        }
        return res.json()
      }),
      {
        loading: isEditMode ? "Atualizando mesa..." : "Cadastrando mesa...",
        success: () => {
          router.push("/mesas")
          return `Mesa ${isEditMode ? 'atualizada' : 'cadastrada'} com sucesso!`
        },
        error: (err) => {
          setIsLoading(false)
          return err.message
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="numero">Número da Mesa</Label>
        <Input
          id="numero"
          type="number"
          placeholder="Ex: 10"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição (Opcional)</Label>
        <Textarea
          id="descricao"
          placeholder="Ex: Próximo à janela"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : (isEditMode ? "Atualizar Mesa" : "Salvar Mesa")}
        </Button>
      </div>
    </form>
  )
}
