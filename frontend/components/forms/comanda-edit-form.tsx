/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Comanda, Mesa, Produto, StatusComanda } from "@/components/comanda-grid"
import { IconX } from "@tabler/icons-react"

interface ComandaEditFormProps {
  initialData: Comanda
}

interface AddedProduto {
  produtoId: number
  nome: string
  quantidade: number
  preco: number
}

export function ComandaEditForm({ initialData }: ComandaEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Data from API
  const [allProdutos, setAllProdutos] = useState<Produto[]>([])

  // Form state
  const [status, setStatus] = useState<StatusComanda>(initialData.status)
  const [observacao, setObservacao] = useState(initialData.observacao || "")
  const [addedProdutos, setAddedProdutos] = useState<AddedProduto[]>([])
  
  // Product search state
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([])

  // Fetch all products for the search functionality
  useEffect(() => {
    const fetchAllProdutos = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const produtosRes = await fetch("http://localhost:3001/produto", { headers: { Authorization: `Bearer ${token}` } })
        if (produtosRes.ok) setAllProdutos(await produtosRes.json())
      } catch (error) {
        toast.error("Falha ao carregar lista de produtos.")
      }
    }
    fetchAllProdutos()
  }, [])

  // Pre-populate form with initial data
  useEffect(() => {
    const initialAddedProdutos = initialData.produtos.map(p => ({
      produtoId: p.produto.id,
      nome: p.produto.nome,
      quantidade: p.quantidade,
      preco: Number(p.produto.preco),
    }))
    setAddedProdutos(initialAddedProdutos)
  }, [initialData])

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      setFilteredProdutos(
        allProdutos.filter(p => p.nome.toLowerCase().includes(lowercasedTerm))
      )
    } else {
      setFilteredProdutos([])
    }
  }, [searchTerm, allProdutos])

  const handleAddProduto = (produto: Produto) => {
    if (addedProdutos.some(p => p.produtoId === produto.id)) {
      toast.info("Produto já adicionado. Altere a quantidade na tabela.")
      return
    }
    setAddedProdutos(prev => [...prev, { produtoId: produto.id, nome: produto.nome, quantidade: 1, preco: Number(produto.preco) }])
    setSearchTerm("")
  }

  const handleRemoveProduto = (produtoId: number) => {
    setAddedProdutos(prev => prev.filter(p => p.produtoId !== produtoId))
  }

  const handleQuantityChange = (produtoId: number, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1
    setAddedProdutos(prev => 
      prev.map(p => p.produtoId === produtoId ? { ...p, quantidade: newQuantity } : p)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Autenticação expirou.")
      router.push("/login")
      return
    }

    const comandaUpdateData = {
      status,
      observacao,
      produtos: {
        deleteMany: {}, // Clear existing products
        create: addedProdutos.map(p => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade,
        })),
      },
    }

    toast.promise(
      fetch(`http://localhost:3001/comanda/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(comandaUpdateData),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Falha ao atualizar comanda.")
        }
        return res.json()
      }),
      {
        loading: "Atualizando comanda...",
        success: () => {
          router.push("/dashboard")
          return "Comanda atualizada com sucesso!"
        },
        error: (err) => {
          setIsLoading(false)
          return err.message
        },
      }
    )
  }

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja deletar esta comanda? Esta ação não pode ser desfeita.")) {
      return
    }

    setIsLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Autenticação expirou.")
      router.push("/login")
      return
    }

    toast.promise(
      fetch(`http://localhost:3001/comanda/${initialData.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Falha ao deletar comanda.")
        }
        return res.json()
      }),
      {
        loading: "Deletando comanda...",
        success: () => {
          router.push("/dashboard")
          return "Comanda deletada com sucesso!"
        },
        error: (err) => {
          setIsLoading(false)
          return err.message
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status and Observacao */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status da Comanda</Label>
          <Select onValueChange={(value) => setStatus(value as StatusComanda)} value={status}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(StatusComanda).map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="observacao">Observação (Opcional)</Label>
          <Textarea id="observacao" value={observacao} onChange={e => setObservacao(e.target.value)} />
        </div>
      </div>

      {/* Product Management */}
      <div className="space-y-2 pt-4">
        <Label htmlFor="produto-search">Adicionar Produto</Label>
        <Input
          id="produto-search"
          placeholder="Digite para buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {filteredProdutos.length > 0 && (
          <ScrollArea className="h-40 rounded-md border">
            <div className="p-2">
              {filteredProdutos.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                  <span>{p.nome}</span>
                  <Button type="button" size="sm" onClick={() => handleAddProduto(p)}>Adicionar</Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Added Products Table */}
      <div className="space-y-2">
          <Label>Produtos na Comanda</Label>
          <ScrollArea className="h-48 rounded-md border">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="w-24">Qtd.</TableHead>
                          <TableHead className="w-16"></TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {addedProdutos.map(p => (
                          <TableRow key={p.produtoId}>
                              <TableCell>{p.nome}</TableCell>
                              <TableCell>
                                  <Input 
                                      type="number" 
                                      min="1"
                                      value={p.quantidade} 
                                      onChange={e => handleQuantityChange(p.produtoId, parseInt(e.target.value, 10))}
                                      className="h-8"
                                  />
                              </TableCell>
                              <TableCell>
                                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveProduto(p.produtoId)}>
                                      <IconX className="h-4 w-4 text-red-500" />
                                  </Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </ScrollArea>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
        >
          Deletar Comanda
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}
