-- CreateTable
CREATE TABLE "Mesa" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "descricao" TEXT,
    "removido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Mesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "quantidade" INTEGER NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "removido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comanda" (
    "id" SERIAL NOT NULL,
    "mesaId" INTEGER NOT NULL,
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,
    "removido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comanda_produto" (
    "id" SERIAL NOT NULL,
    "comandaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "comanda_produto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "comanda_produto_comandaId_produtoId_key" ON "comanda_produto"("comandaId", "produtoId");

-- AddForeignKey
ALTER TABLE "Comanda" ADD CONSTRAINT "Comanda_mesaId_fkey" FOREIGN KEY ("mesaId") REFERENCES "Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda_produto" ADD CONSTRAINT "comanda_produto_comandaId_fkey" FOREIGN KEY ("comandaId") REFERENCES "Comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda_produto" ADD CONSTRAINT "comanda_produto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
