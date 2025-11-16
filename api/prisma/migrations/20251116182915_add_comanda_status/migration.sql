-- CreateEnum
CREATE TYPE "StatusComanda" AS ENUM ('ABERTA', 'FECHADA', 'PAGA');

-- AlterTable
ALTER TABLE "Comanda" ADD COLUMN     "status" "StatusComanda" NOT NULL DEFAULT 'ABERTA';
