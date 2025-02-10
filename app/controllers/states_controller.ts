import type { HttpContext } from '@adonisjs/core/http'
import States from '#models/state'
import { createStateValidator } from '#validators/state'
import logger from '@adonisjs/core/services/logger'

export default class StatesController {
  /**
   * @swagger
   * /states:
   *   post:
   *     summary: Cria um novo estado
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               acronym:
   *                 type: string
   *     responses:
   *       201:
   *         description: Estado criado com sucesso
   *       400:
   *         description: Erro de validação
   *       500:
   *         description: Erro interno do servidor
   */
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.all()
      const payload = await createStateValidator.validate(data)

      const state = await States.create(payload)
      return response.status(201).json(state)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao criar estado')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /states:
   *   get:
   *     summary: Lista todos os estados
   *     responses:
   *       200:
   *         description: Lista de estados
   *       500:
   *         description: Erro interno do servidor
   */
  public async index({ response }: HttpContext) {
    try {
      const states = await States.all()
      return response.status(200).json(states)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao buscar estados')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /states/{id}:
   *   put:
   *     summary: Atualiza um estado pelo ID
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
   *               acronym:
   *                 type: string
   *     responses:
   *       200:
   *         description: Estado atualizado com sucesso
   *       404:
   *         description: Estado não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const state = await States.find(params.id)

      if (!state) {
        return response.status(404).json({ message: 'Estado não encontrado' })
      }

      const data = request.only(['name', 'acronym'])
      state.merge(data)
      await state.save()

      return response.status(200).json(state)
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao atualizar estado')
      return response.status(500).json({ error: error.message })
    }
  }

  /**
   * @swagger
   * /states/{id}:
   *   delete:
   *     summary: Exclui um estado pelo ID
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Estado excluído com sucesso
   *       404:
   *         description: Estado não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const state = await States.find(params.id)

      if (!state) {
        return response.status(404).json({ message: 'Estado não encontrado' })
      }

      await state.delete()
      return response.status(200).json({ message: 'Estado excluído com sucesso' })
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao excluir estado')
      return response.status(500).json({ error: error.message })
    }
  }
}
