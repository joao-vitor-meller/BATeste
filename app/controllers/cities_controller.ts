import type { HttpContext } from '@adonisjs/core/http'
import Cities from '#models/city'
import { createCityValidator } from '#validators/city'

export default class StatesController {
  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createCityValidator.validate(data)

    const user = await Cities.create(payload)

    return response.status(201).json(user)
  }

  // Listar todos os usuários
  public async index({ response }: HttpContext) {
    const cities = await Cities.query().preload('state')

    return response.status(200).json(cities)
  }

  // Atualizar os dados de um usuário
  public async update({ params, request, response }: HttpContext) {
    const user = await Cities.find(params.id)

    if (!user) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    const data = request.only(['name', 'stateId'])
    user.merge(data)
    await user.save()

    return response.status(200).json(user)
  }

  // Excluir um usuário
  public async destroy({ params, response }: HttpContext) {
    const user = await Cities.find(params.id)

    if (!user) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    await user.delete()

    return response.status(200).json({ message: 'Usuário excluído com sucesso' })
  }
}
