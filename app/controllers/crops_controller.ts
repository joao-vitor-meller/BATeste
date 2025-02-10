import type { HttpContext } from '@adonisjs/core/http'
import Crop from '#models/crop'
import { createCropValidator } from '#validators/crop'
import logger from '@adonisjs/core/services/logger'

export default class CropsController {
  /**
   * @swagger
   * /crops:
   *   post:
   *     summary: Cria uma nova cultura
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: Cultura criada com sucesso
   *       400:
   *         description: Erro de validação
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await createCropValidator.validate(data)
      const crop = await Crop.create(payload)
      return response.status(201).json(crop)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao criar cultura')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /crops:
   *   get:
   *     summary: Retorna a lista de culturas
   *     responses:
   *       200:
   *         description: Lista de culturas
   */
  public async index({ response }: HttpContext) {
    try {
      const crops = await Crop.all()
      return response.status(200).json(crops)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao listar culturas')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /crops/{id}:
   *   put:
   *     summary: Atualiza os dados de uma cultura
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
   *     responses:
   *       200:
   *         description: Cultura atualizada com sucesso
   *       404:
   *         description: Cultura não encontrada
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const crop = await Crop.find(params.id)
      if (!crop) {
        return response.status(404).json({ message: 'Cultura não encontrada' })
      }
      const data = request.only(['name'])
      crop.merge(data)
      await crop.save()
      return response.status(200).json(crop)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao atualizar cultura')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /crops/{id}:
   *   delete:
   *     summary: Exclui uma cultura
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Cultura excluída com sucesso
   *       404:
   *         description: Cultura não encontrada
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const crop = await Crop.find(params.id)
      if (!crop) {
        return response.status(404).json({ message: 'Cultura não encontrada' })
      }
      await crop.delete()
      return response.status(200).json({ message: 'Cultura excluída com sucesso' })
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao excluir cultura')
      return response.status(500).json({ error: error.message })
    }
  }
}
