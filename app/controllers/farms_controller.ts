// import type { HttpContext } from '@adonisjs/core/http'
import type { HttpContext } from '@adonisjs/core/http'
import Farm from '#models/farm'
import FarmUser from '#models/farm_user'
import FarmSeason from '#models/farm_season'
import FarmSeasonCrop from '#models/farm_seasons_crop'
import { createFarmValidator, createFarmSeasonsValidator } from '#validators/farm'

export default class FarmsController {
  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createFarmValidator.validate(data)

    // Garantir que a soma das áreas agricultável e de vegetação não ultrapasse a área total
    const totalAreaParsed = payload.totalArea ? Number.parseFloat(String(payload.totalArea)) : 0
    const arableAreaParsed = payload.arableArea ? Number.parseFloat(String(payload.arableArea)) : 0
    const vegetationAreaParsed = payload.vegetationArea
      ? Number.parseFloat(String(payload.vegetationArea))
      : 0

    if (arableAreaParsed + vegetationAreaParsed > totalAreaParsed) {
      return response.status(400).json({
        error:
          'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total da fazenda.',
      })
    }

    const farm = await Farm.create({
      name: payload.name,
      cityId: payload.cityId,
      totalArea: payload.totalArea,
      arableArea: payload.arableArea,
      vegetationArea: payload.vegetationArea,
    })

    await FarmUser.create({
      userId: payload.userId,
      farmId: farm.id,
    })

    return response.status(201).json(farm)
  }

  // Listar todos os usuários
  public async index({ response }: HttpContext) {
    const users = await Farm.query().preload('city')

    return response.status(200).json(users)
  }

  // Excluir um usuário
  public async destroy({ params, response }: HttpContext) {
    const user = await Farm.find(params.id)

    if (!user) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }

    await user.delete()

    return response.status(200).json({ message: 'Usuário excluído com sucesso' })
  }

  public async storeFarmSeasons({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createFarmSeasonsValidator.validate(data)

    const farmSeason = await FarmSeason.create({
      farmId: payload.farmId,
      seasonId: payload.seasonId,
    })

    for (const crop of payload.cropsIds) {
      await FarmSeasonCrop.create({
        farmSeasonId: farmSeason.id,
        cropId: crop,
      })
    }

    return response.status(201).json(farmSeason)
  }
}
