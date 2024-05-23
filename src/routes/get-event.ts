import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId', {
            schema: {
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    200: {
                        event: z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            slug: z.string(),
                            details: z.string().nullable(),
                            maximumAttendees: z.number().int().nullable(),
                            attendeesAmount: z.number().int(),
                        })
                    }
                },
            }
        }, async (request, reply) => {
            const { eventId } = request.params

            const event = await prisma.event.findUnique({
                select: { // seleciona os campos que serão retornados
                    id: true,
                    title: true,
                    slug: true,
                    details: true,
                    maximumAttendees: true,
                    _count: { // conta a quantidade de usuários já registrados no evento
                        select: {
                            attendees: true,
                        }
                    }
                },

                where: {
                    id: eventId,
                }
            })

            if (event === null) {
                throw new Error('Event not found.')
            }

            return reply.send({
                event: { // renomeando os campos para serem retornados
                    id: event.id,
                    title: event.title,
                    slug: event.slug,
                    details: event.details,
                    maximumAttendees: event.maximumAttendees,
                    attendeesAmount: event._count.attendees,
                }
            })
        })
}