"use client"

import * as React from "react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconFileDescription,
  IconInnerShadowTop,
  IconListDetails,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Gabriel Tangerina",
    email: "gabriel@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Cadastro de Mesa",
      url: "/mesas",
      icon: IconListDetails,
    },
    {
      title: "Cadastro de Prato",
      url: "#",
      icon: IconFileDescription,
    },
  ],

}

interface User {
  id: number;
  nome: string;
  email: string;
  avatar: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:3001/usuarios/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const userData: User = await res.json();
        
        const userWithAvatar = {
          ...userData,
          avatar: "/avatars/shadcn.jpg" 
        };
        
        setUser(userWithAvatar);

      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Trabalho DW3</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* 5. Usar o estado dinâmico do usuário */}
        {/* Mostra "Carregando..." enquanto busca, e o NavUser quando encontrar */}
        {user ? (
          <NavUser user={{name: user.nome, email: user.email}} />
        ) : (
          <div className="p-4 text-sm text-gray-500">Carregando...</div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
