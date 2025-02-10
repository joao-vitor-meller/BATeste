import type { HttpContext } from '@adonisjs/core/http'
import City from '#models/city'
import { createCityValidator } from '#validators/city'
import logger from '@adonisjs/core/services/logger'

export default class CitiesController {
  /**
   * @swagger
   * /cities:
   *   post:
   *     summary: Cria uma nova cidade
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               stateId:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Cidade criada com sucesso
   *       400:
   *         description: Erro de validação
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await createCityValidator.validate(data)
      const city = await City.create(payload)
      return response.status(201).json(city)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao criar cidade')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /cities:
   *   get:
   *     summary: Retorna a lista de cidades
   *     responses:
   *       200:
   *         description: Lista de cidades
   */
  public async index({ response }: HttpContext) {
    try {
      const cities = await City.query().preload('state')
      return response.status(200).json(cities)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao listar cidades')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /cities/{id}:
   *   put:
   *     summary: Atualiza os dados de uma cidade
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
   *               stateId:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Cidade atualizada com sucesso
   *       404:
   *         description: Cidade não encontrada
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const city = await City.find(params.id)
      if (!city) {
        return response.status(404).json({ message: 'Cidade não encontrada' })
      }
      const data = request.only(['name', 'stateId'])
      city.merge(data)
      await city.save()
      return response.status(200).json(city)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao atualizar cidade')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /cities/{id}:
   *   delete:
   *     summary: Exclui uma cidade
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Cidade excluída com sucesso
   *       404:
   *         description: Cidade não encontrada
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const city = await City.find(params.id)
      if (!city) {
        return response.status(404).json({ message: 'Cidade não encontrada' })
      }
      await city.delete()
      return response.status(200).json({ message: 'Cidade excluída com sucesso' })
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao excluir cidade')
      return response.status(500).json({ error: error.message })
    }
  }
}
