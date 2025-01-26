import type { HttpContext } from '@adonisjs/core/http'
import Crop from '#models/crop'
import { createCropValidator } from '#validators/crop'

export default class CropsController {
  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createCropValidator.validate(data)

    const season = await Crop.create(payload)

    return response.status(201).json(season)
  }

  // Listar todos os usuários
  public async index({ response }: HttpContext) {
    const crops = await Crop.all()

    return response.status(200).json(crops)
  }

  // Atualizar os dados de um usuário
  public async update({ params, request, response }: HttpContext) {
    const season = await Crop.find(params.id)

    if (!season) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    const data = request.only(['name'])
    season.merge(data)
    await season.save()

    return response.status(200).json(season)
  }

  // Excluir um usuário
  public async destroy({ params, response }: HttpContext) {
    const season = await Crop.find(params.id)

    if (!season) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    await season.delete()

    return response.status(200).json({ message: 'Usuário excluído com sucesso' })
  }
}
