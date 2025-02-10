import type { HttpContext } from '@adonisjs/core/http'
import Farm from '#models/farm'
import FarmUser from '#models/farm_user'
import FarmSeason from '#models/farm_season'
import FarmSeasonCrop from '#models/farm_seasons_crop'
import { createFarmValidator, createFarmSeasonsValidator } from '#validators/farm'
import logger from '@adonisjs/core/services/logger'

export default class FarmsController {
  /**
   * @swagger
   * /farms:
   *   post:
   *     summary: Cria uma nova fazenda
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               cityId:
   *                 type: integer
   *               totalArea:
   *                 type: number
   *               arableArea:
   *                 type: number
   *               vegetationArea:
   *                 type: number
   *               userId:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Fazenda criada com sucesso
   *       400:
   *         description: Erro de validação
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await createFarmValidator.validate(data)

      // Garantir que a soma das áreas agricultável e de vegetação não ultrapasse a área total
      const totalAreaParsed = payload.totalArea ? Number.parseFloat(String(payload.totalArea)) : 0
      const arableAreaParsed = payload.arableArea
        ? Number.parseFloat(String(payload.arableArea))
        : 0
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
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao criar fazenda')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /farms:
   *   get:
   *     summary: Retorna a lista de fazendas
   *     responses:
   *       200:
   *         description: Lista de fazendas
   */
  public async index({ response }: HttpContext) {
    try {
      const farms = await Farm.query().preload('city')
      return response.status(200).json(farms)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao listar fazendas')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /farms/{id}:
   *   delete:
   *     summary: Exclui uma fazenda
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Fazenda excluída com sucesso
   *       404:
   *         description: Fazenda não encontrada
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const farm = await Farm.find(params.id)

      if (!farm) {
        return response.status(404).json({ message: 'Fazenda não encontrada' })
      }

      await farm.delete()
      return response.status(200).json({ message: 'Fazenda excluída com sucesso' })
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao excluir fazenda')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /farms/seasons:
   *   post:
   *     summary: Associa uma fazenda a uma safra
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               farmId:
   *                 type: integer
   *               seasonId:
   *                 type: integer
   *               cropsIds:
   *                 type: array
   *                 items:
   *                   type: integer
   *     responses:
   *       201:
   *         description: Associação criada com sucesso
   *       400:
   *         description: Erro de validação
   */
  public async storeFarmSeasons({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await createFarmSeasonsValidator.validate(data)

      const farmSeason = await FarmSeason.create({
        farmId: payload.farmId,
        seasonId: payload.seasonId,
      })

      for (const crop of payload.cropsIds) {
        await FarmSeasonCrop.create({ farmSeasonId: farmSeason.id, cropId: crop })
      }

      return response.status(201).json(farmSeason)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao associar fazenda a safra')
      return response.status(500).json({ error: error.message })
    }
  }
}
