/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Produto } from "@/app/produtos/page"

interface ProdutoFormProps {
  initialData?: Produto
}

export function ProdutoForm({ initialData }: ProdutoFormProps) {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [preco, setPreco] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isEditMode = Boolean(initialData)

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome)
      setDescricao(initialData.descricao || "")
      setQuantidade(initialData.quantidade.toString())
      setPreco(initialData.preco.toString())
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
      ? `http://localhost:3001/produto/${initialData?.id}`
      : "http://localhost:3001/produto"
    
    const method = isEditMode ? "PUT" : "POST"

    toast.promise(
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          descricao,
          quantidade: parseInt(quantidade, 10),
          preco: parseFloat(preco),
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || `Falha ao ${isEditMode ? 'atualizar' : 'cadastrar'} produto.`)
        }
        return res.json()
      }),
      {
        loading: isEditMode ? "Atualizando produto..." : "Cadastrando produto...",
        success: () => {
          router.push("/produtos")
          return `Produto ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`
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
        <Label htmlFor="nome">Nome do Produto</Label>
        <Input
          id="nome"
          type="text"
          placeholder="Ex: Coca-Cola"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição (Opcional)</Label>
        <Textarea
          id="descricao"
          placeholder="Ex: Lata 350ml"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input
            id="quantidade"
            type="number"
            placeholder="Ex: 100"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preco">Preço</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            placeholder="Ex: 5.50"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : (isEditMode ? "Atualizar Produto" : "Salvar Produto")}
        </Button>
      </div>
    </form>
  )
}
