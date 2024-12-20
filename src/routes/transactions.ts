import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exist'

export async function transactionsRoutes(app: FastifyInstance) {

  app.get('/', 
    {
      preHandler: [checkSessionIdExists]
    }, 
    async (request) => {
    const { sessionId } = request.cookies
   
    const transactions = await knex('transactions')
    .where('session_id', sessionId)
    .select()

    return { transactions }
  })

  app.get('/:id', 
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
    const sessionId = request.cookies

    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)
    const transactions = await knex('transactions')
      .where({
        'session_id': sessionId,
        id
      }) 
      .first()

    return { transactions }
  })

  app.get('/summary', 
    {
      preHandler: [checkSessionIdExists]
    },
    async (request) => {
    const { sessionId } = request.cookies

    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()
    
      return { summary }
  })
  
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.string(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    )

    let sessionId = request.cookies.sessionId
    
    if (!sessionId) {
      sessionId = randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : Number(amount) * -1,
      session_id: sessionId,
    })
    
    
    return reply.status(201).send()
  })
}