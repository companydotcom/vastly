import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// pnpx ts-node src/script.ts

async function main() {
  // const user = await prisma.user.create({
  //   data: {
  //     name: "Nhu",
  //     email: "nhu@prisma.io",
  //     posts: {
  //       create: {
  //         title: "Hello World",
  //       },
  //     },
  //   },
  // })
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
  console.dir(usersWithPosts, { depth: null })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
