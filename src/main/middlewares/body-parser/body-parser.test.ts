import request from 'supertest'
import app from '@/main/configs/app'
import type { Request, Response } from 'express'

describe('BodyParser Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_body_parser', (req: Request, res: Response) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ field: 'any_value' })
      .expect({ field: 'any_value' })
  })
})
