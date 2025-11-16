"use client"

import { ComandaForm } from "@/components/forms/comanda-form"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

export default function NovaComandaPage() {
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
            <h1 className="text-2xl font-bold">Abrir Nova Comanda</h1>
          </div>
          <p className="text-muted-foreground">
            Selecione a mesa e adicione os produtos para iniciar uma nova comanda.
          </p>
        </div>
        <ComandaForm />
      </div>
    </div>
  )
}
