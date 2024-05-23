import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId/attendees', {
            schema: {
                summary: 'Get event attendees',
                tags: ['events'],

                params: z.object({
                    eventId: z.string().uuid(),
                }),
                querystring: z.object({
                    query: z.string().nullish(),
                    pageIndex: z.string().nullish().default('0').transform(Number),
                }),
                response: {
                    200: z.object({
                        attendees: z.array(
                            z.object({
                                id: z.number(),
                                name: z.string(),
                                email: z.string().email(),
                                createdAt: z.date(),
                                checkInAt: z.date().nullable(),
                        }))
                    })
                },
            }
        }, async (request, reply) => {
            const { eventId } = request.params
            const { pageIndex, query } = request.query

            const attendees = await prisma.attendee.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    CheckIn: {
                        select: {
                            createdAt: true,
                        }
                    }
                },
                where: query ? { // se existir query, filtra por nome do participante contendo a query
                    eventId,
                    name: {
                        contains: query,
                    }
                } : { // senão, retorna todos os participantes do evento
                    eventId,
                },
                take: 10, // esquema de paginação com 10 itens por página
                skip: pageIndex * 10, // calcula o offset baseado na página atual
                orderBy: {
                    createdAt: 'desc', // ordena por data de criação decrescente
                },
            })

            return reply.send({
                attendees: attendees.map(attendee => {
                    return {
                        id: attendee.id,
                        name: attendee.name,
                        email: attendee.email,
                        createdAt: attendee.createdAt,
                        checkInAt: attendee.CheckIn?.createdAt ?? null, // retorna a data de check-in se existir
                    }
                })
            })
        })
}