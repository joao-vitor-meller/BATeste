import type { HttpContext } from '@adonisjs/core/http'
import Season from '#models/season'
import { createSeasonValidator } from '#validators/season'
import logger from '@adonisjs/core/services/logger'

export default class SeasonsController {
  /**
   * @swagger
   * /seasons:
   *   post:
   *     summary: Cria uma nova safra
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               year:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Safra criada com sucesso
   *       400:
   *         description: Erro de validação
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await createSeasonValidator.validate(data)

      const season = await Season.create(payload)

      return response.status(201).json(season)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao criar safra')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /seasons:
   *   get:
   *     summary: Retorna a lista de safras
   *     responses:
   *       200:
   *         description: Lista de safras
   */
  public async index({ response }: HttpContext) {
    try {
      const seasons = await Season.all()
      return response.status(200).json(seasons)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao buscar safras')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /seasons/{id}:
   *   put:
   *     summary: Atualiza uma safra
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               year:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Safra atualizada com sucesso
   *       404:
   *         description: Safra não encontrada
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const season = await Season.find(params.id)
      if (!season) {
        return response.status(404).json({ message: 'Safra não encontrada' })
      }

      const data = request.only(['name', 'year'])
      season.merge(data)
      await season.save()

      return response.status(200).json(season)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao atualizar safra')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /seasons/{id}:
   *   delete:
   *     summary: Exclui uma safra
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Safra excluída com sucesso
   *       404:
   *         description: Safra não encontrada
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const season = await Season.find(params.id)
      if (!season) {
        return response.status(404).json({ message: 'Safra não encontrada' })
      }

      await season.delete()
      return response.status(200).json({ message: 'Safra excluída com sucesso' })
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao excluir safra')
      return response.status(500).json({ error: error.message })
    }
  }
}
