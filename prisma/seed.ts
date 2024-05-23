import { prisma } from '../src/lib/prisma'

async function seed() {
    await prisma.event.create({
        data: {
            id: '5f6b80f6-cc05-4cc5-b2f4-a534bb0f80b4',
            title: 'Unite Summit',
            slug: 'unite-summit',
            details: 'Um evento p/ devs apaixonados por código',
            maximumAttendees: 120,
        },
    })
}

seed().then(() => {
    console.log('Database seeded')
    prisma.$disconnect()
})