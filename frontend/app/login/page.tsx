/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
