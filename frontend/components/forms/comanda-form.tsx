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
import { Mesa, Produto } from "@/components/comanda-grid" // Re-using interfaces
import { IconX } from "@tabler/icons-react"

export function ComandaForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Data from API
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])

  // Form state
  const [selectedMesaId, setSelectedMesaId] = useState<string>("")
  const [observacao, setObservacao] = useState("")
  const [addedProdutos, setAddedProdutos] = useState<AddedProduto[]>([])
  
  // Product search state
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([])

  // Fetch initial data for selects
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const [mesasRes, produtosRes] = await Promise.all([
          fetch("http://localhost:3001/mesa", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:3001/produto", { headers: { Authorization: `Bearer ${token}` } }),
        ])

        if (mesasRes.ok) setMesas(await mesasRes.json())
        if (produtosRes.ok) setProdutos(await produtosRes.json())

      } catch (error) {
        toast.error("Falha ao carregar dados para o formulário.")
      }
    }
    fetchData()
  }, [])

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase()
      setFilteredProdutos(
        produtos.filter(p => p.nome.toLowerCase().includes(lowercasedTerm))
      )
    } else {
      setFilteredProdutos([])
    }
  }, [searchTerm, produtos])

  const handleAddProduto = (produto: Produto) => {
    // Avoid adding duplicates
    if (addedProdutos.some(p => p.produtoId === produto.id)) {
      toast.info("Produto já adicionado. Altere a quantidade na tabela.")
      return
    }
    setAddedProdutos(prev => [...prev, { produtoId: produto.id, nome: produto.nome, quantidade: 1, preco: Number(produto.preco) }])
    setSearchTerm("") // Clear search after adding
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
    if (!selectedMesaId) {
      toast.error("Selecione uma mesa.")
      return
    }
    if (addedProdutos.length === 0) {
        toast.error("Adicione pelo menos um produto à comanda.")
        return
    }

    setIsLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Autenticação expirou.", { description: "Faça login novamente." })
      router.push("/login")
      return
    }

    const comandaData = {
      mesaId: parseInt(selectedMesaId, 10),
      observacao,
      produtos: {
        create: addedProdutos.map(p => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade,
        })),
      },
    }

    toast.promise(
      fetch("http://localhost:3001/comanda", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(comandaData),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Falha ao criar comanda.")
        }
        return res.json()
      }),
      {
        loading: "Criando comanda...",
        success: () => {
          router.push("/dashboard") // Navigate on success
          return "Comanda criada com sucesso!"
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
      <div className="space-y-2">
        <Label htmlFor="mesa">Mesa</Label>
        <Select onValueChange={setSelectedMesaId} value={selectedMesaId}>
          <SelectTrigger id="mesa">
            <SelectValue placeholder="Selecione a mesa" />
          </SelectTrigger>
          <SelectContent>
            {mesas.map(mesa => (
              <SelectItem key={mesa.id} value={mesa.id.toString()}>
                Mesa {mesa.numero}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacao">Observação (Opcional)</Label>
        <Textarea id="observacao" value={observacao} onChange={e => setObservacao(e.target.value)} />
      </div>

      <div className="space-y-2">
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

      {addedProdutos.length > 0 && (
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
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Criar Comanda"}
        </Button>
      </div>
    </form>
  )
}
