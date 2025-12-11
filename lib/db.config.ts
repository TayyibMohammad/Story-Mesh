import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient({
    log: ["query"],

})

export default prisma