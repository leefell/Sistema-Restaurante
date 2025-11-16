/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState(""); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }), 
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar usuário.");
      }

      router.push("/login");
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Crie sua conta</CardTitle>
        <CardDescription>
          Preencha os campos para fazer o cadastro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                value={nome} 
                onChange={(e) => setNome(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input 
                id="password" 
                type="password" 
                required
                value={senha} 
                onChange={(e) => setSenha(e.target.value)}
              />
              {/* <FieldDescription>
                A senha deve ter no pelo menos 8 caracteres.
              </FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirmar Senha
              </FieldLabel>
              <Input 
                id="confirm-password" 
                type="password" 
                required 
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              {/* <FieldDescription>Please confirm your password.</FieldDescription> */}
            </Field>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <FieldGroup>
              <Field>
                <Button type="submit">Criar conta</Button>
                {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                <FieldDescription className="px-6 text-center">
                 Já possui uma conta? <Link href="/login" className="underline">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
