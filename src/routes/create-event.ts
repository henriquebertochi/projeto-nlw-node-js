import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { generateSlug } from "../utils/generate-slug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_errors/bad-request"

export async function createEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: { // schema de validação do corpo da requisição
                summary: 'Create a new event', // descrição da rota dentro do swagger
                tags: ['events'], // tags para organizar as rotas no swagger
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable(),
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid(),
                    }),
                },
            },
        }, async (request, reply) => {
            const {
                title,
                details,
                maximumAttendees,
            } = request.body

            const slug = generateSlug(title)

            const eventWithSameSlug = await prisma.event.findUnique({
                where: {
                    slug, // procura um evento com o mesmo slug
                }
            })

            if (eventWithSameSlug !== null) {
                throw new BadRequest('Another event with same title already exists')
            }

            const event = await prisma.event.create({ // cria um novo evento no banco de dados, await para esperar a requisição demorada, precisa do async no callback
                data: {
                    title,
                    details,
                    maximumAttendees,
                    slug,
                },
            })

            return reply.status(201).send({ eventId: event.id }) // retorna o id do evento criado, com o protocolo 201 de sucesso
        })
}