const { PrismaClient } = require('./generated/prisma/client.ts');
const prisma = new PrismaClient();

module.exports = prisma;