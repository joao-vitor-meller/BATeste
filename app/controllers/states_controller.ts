import type { HttpContext } from '@adonisjs/core/http'
import States from '#models/state'
import { createStateValidator } from '#validators/state'

export default class StatesController {
  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createStateValidator.validate(data)

    const states = await States.create(payload)

    return response.status(201).json(states)
  }

  // Listar todos os usuários
  public async index({ response }: HttpContext) {
    const states = await States.all()

    return response.status(200).json(states)
  }

  // Atualizar os dados de um usuário
  public async update({ params, request, response }: HttpContext) {
    const states = await States.find(params.id)

    if (!states) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    const data = request.only(['name', 'acronym'])
    states.merge(data)
    await states.save()

    return response.status(200).json(states)
  }

  // Excluir um usuário
  public async destroy({ params, response }: HttpContext) {
    const states = await States.find(params.id)

    if (!states) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    await states.delete()

    return response.status(200).json({ message: 'Usuário excluído com sucesso' })
  }
}
