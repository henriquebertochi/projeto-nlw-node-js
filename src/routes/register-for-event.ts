import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) { // função para registrar um usuário em um evento
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', { // rota para registrar um usuário em um evento
            schema: { // tipagem de cada informação

                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email(),
                }),

                params: z.object({
                    eventId: z.string().uuid(),
                }),

                response: {
                    201: z.object({
                        attendeeId: z.number(),
                    })
                }
            }
        }, async (request, reply) => { // função que será executada ao acessar a rota
            const { eventId } = request.params;
            const { name, email } = request.body;

            const attendeeFromEmail = await prisma.attendee.findUnique({
                where: {
                    eventId_email: {
                        email,
                        eventId,
                    }
                }
            })

            if (attendeeFromEmail !== null) { // verifica se o usuário já está registrado no evento
                throw new Error('This e-mail is already registered for this event.')
            }

            const [event, amountOfAttendeesForEvent] = await Promise.all([
                prisma.event.findUnique({
                    where: {
                        id: eventId,
                    }
                }),

                prisma.attendee.count({
                    where: {
                        eventId,
                    }
                })
            ]) // busca o evento e a quantidade de usuários registrados no evento ao mesmo tempo, resultado vem em um array, separado no inicio da função

            if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
                // verifica se o evento já tem todas as vagas preenchidas
                throw new Error('The maximum number of attendees for this event has been reached.')
            }

            const attendee = await prisma.attendee.create({
                data: {
                    name,
                    email,
                    eventId,
                }
            }) // cria um novo usuário no banco de dados

            return reply.status(201).send({ attendeeId: attendee.id }) // retorna o id do usuário criado
        })
}