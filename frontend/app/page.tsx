/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Dashboard from './dashboard/page';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
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
   <Dashboard />
  );
}
