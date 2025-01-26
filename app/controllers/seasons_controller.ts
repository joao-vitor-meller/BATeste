import type { HttpContext } from '@adonisjs/core/http'
import Season from '#models/season'
import { createSeasonValidator } from '#validators/season'

export default class SeasonsController {
  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createSeasonValidator.validate(data)

    const season = await Season.create(payload)

    return response.status(201).json(season)
  }

  // Listar todos os usuários
  public async index({ response }: HttpContext) {
    const seasons = await Season.all()

    return response.status(200).json(seasons)
  }

  // Atualizar os dados de um usuário
  public async update({ params, request, response }: HttpContext) {
    const season = await Season.find(params.id)

    if (!season) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    const data = request.only(['name', 'year'])
    season.merge(data)
    await season.save()

    return response.status(200).json(season)
  }

  // Excluir um usuário
  public async destroy({ params, response }: HttpContext) {
    const season = await Season.find(params.id)

    if (!season) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    await season.delete()

    return response.status(200).json({ message: 'Usuário excluído com sucesso' })
  }
}
