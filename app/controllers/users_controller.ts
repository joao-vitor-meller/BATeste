import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { createUserValidator, updateUserValidator } from '#validators/user'
import Season from '#models/season'

export default class UserController {
  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Cria um novo usuário
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               cpf:
   *                 type: string
   *               cnpj:
   *                 type: string
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 cpf:
   *                   type: string
   *                 cnpj:
   *                   type: string
   *       400:
   *         description: CPF ou CNPJ inválido
   */
  public async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createUserValidator.validate(data)

    // Validar CPF
    if (payload.cpf && !cpf.isValid(payload.cpf)) {
      return response.status(400).json({ error: 'CPF invalid' })
    }

    // Validar CNPJ
    if (payload.cnpj && !cnpj.isValid(payload.cnpj)) {
      return response.status(400).json({ error: 'CNPJ invalid' })
    }

    const user = await User.create(payload)

    return response.status(201).json(user)
  }

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Retorna a lista de usuários produtores
   *     description: Retorna todos os usuários registrados no sistema.
   *     responses:
   *       200:
   *         description: Lista de usuários produtores
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *                   cpf:
   *                     type: string
   *                   cnpj:
   *                     type: string
   */
  public async index({ response }: HttpContext) {
    const users = await User.all()

    return response.status(200).json(users)
  }

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Atualiza um usuário
   *     description: Atualiza os dados de um usuário existente pelo ID.
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID do usuário a ser atualizado
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
   *                 description: Nome do usuário
   *               cpf:
   *                 type: string
   *                 description: CPF do usuário
   *               cnpj:
   *                 type: string
   *                 description: CNPJ do usuário
   *     responses:
   *       200:
   *         description: Usuário atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 cpf:
   *                   type: string
   *                 cnpj:
   *                   type: string
   *       400:
   *         description: CPF ou CNPJ inválido
   *       404:
   *         description: Usuário não encontrado
   */

  public async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    const data = request.all()
    const payload = await updateUserValidator.validate(data)

    // Validar CPF
    if (payload.cpf && !cpf.isValid(payload.cpf)) {
      return response.status(400).json({ error: 'CPF invalid' })
    }

    // Validar CNPJ
    if (payload.cnpj && !cnpj.isValid(payload.cnpj)) {
      return response.status(400).json({ error: 'CNPJ invalid' })
    }

    user.merge(payload)
    await user.save()

    return response.status(200).json(user)
  }

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Exclui um usuário
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Usuário excluído com sucesso
   *       404:
   *         description: Usuário não encontrado
   */
  public async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    await user.delete()

    return response.status(200).json({ message: 'User deleted successfully' })
  }

  /**
   * @swagger
   * /users/farms:
   *   get:
   *     summary: Retorna usuários com suas fazendas e safras
   *     responses:
   *       200:
   *         description: Lista de usuários com fazendas e safras
   */
  public async userFarms({ response }: HttpContext) {
    const users = await User.query().preload('userFarms', (userFarmsQuery) => {
      userFarmsQuery.preload('city', (cityQuery) => {
        cityQuery.preload('state')
      }),
        userFarmsQuery.preload('farmSeasons')
    })

    for (const user of users) {
      for (const farm of user.userFarms) {
        for (const season of farm.farmSeasons) {
          const crops = (await Season.query()
            .from('propriedades_safras as ps')
            .select('c.id', 'c.nome')
            .join('propriedades_safras_culturas as psc', 'psc.id_propriedade_safra', 'ps.id')
            .join('culturas as c', 'c.id', 'psc.id_cultura')
            .where('ps.id_propriedade', season.$extras.pivot_id_propriedade)
            .andWhere('ps.id_safra', season.$extras.pivot_id_safra)
            .exec()) as { id: number; name: string }[]

          Object.assign(season, {
            ...season.toJSON(),
            crops,
          })
        }
      }
    }

    return response.status(200).json(users)
  }
}
