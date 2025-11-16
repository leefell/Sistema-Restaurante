"use client"

import { ProdutoForm } from "@/components/forms/produto-form"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

export default function NovoProdutoPage() {
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
            <h1 className="text-2xl font-bold">Cadastrar Novo Produto</h1>
          </div>
          <p className="text-muted-foreground">
            Preencha os campos abaixo para adicionar um novo produto.
          </p>
        </div>
        <ProdutoForm />
      </div>
    </div>
  )
}
