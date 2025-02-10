import type { HttpContext } from '@adonisjs/core/http'
import Farm from '#models/farm'
import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'

export default class ReportsController {
  /**
   * @swagger
   * /reports:
   *   get:
   *     summary: Retorna relatórios de fazendas e uso do solo
   *     responses:
   *       200:
   *         description: Relatório gerado com sucesso
   *       500:
   *         description: Erro ao buscar dados para os relatórios
   */
  public async index({ response }: HttpContext) {
    try {
      const farms = await Farm.all()
      const totalHectares = farms.reduce((sum, farm) => {
        const area = farm.totalArea !== null ? Number.parseFloat(String(farm.totalArea)) : 0
        return sum + area
      }, 0)

      const farmsByState = await db
        .from('propriedades as p')
        .select('e.nome as estado')
        .count('p.id as total_fazendas')
        .join('cidades as c', 'p.id_cidade', 'c.id')
        .join('estados as e', 'c.id_estado', 'e.id')
        .groupBy('e.id', 'e.nome')

      const farmsByCulture = await db
        .from('propriedades_safras_culturas as psc')
        .select('c.nome as cultura')
        .count('psc.id as total_propriedades')
        .join('culturas as c', 'psc.id_cultura', 'c.id')
        .groupBy('c.id', 'c.nome')

      const areaData = await db
        .from('propriedades')
        .select(
          db.raw(
            'SUM(area_agricultavel) AS total_area_agricultavel, SUM(area_vegetacao) AS total_area_vegetacao, SUM(area_total) AS total_area'
          )
        )
        .first()

      const totalArea = areaData?.total_area ?? 0
      const arablePercentage =
        totalArea > 0 ? (areaData?.total_area_agricultavel / totalArea) * 100 : 0
      const vegetationPercentage =
        totalArea > 0 ? (areaData?.total_area_vegetacao / totalArea) * 100 : 0

      return response.status(200).json({
        totalFarms: farms.length,
        totalHectares: Math.round(totalHectares * 100) / 100,
        farmsByState,
        farmsByCulture,
        areaUsage: {
          arable: Math.round(arablePercentage * 100) / 100,
          vegetation: Math.round(vegetationPercentage * 100) / 100,
        },
      })
    } catch (error) {
      logger.error({ err: error.message }, 'Erro ao buscar dados para os relatórios')
      return response.status(500).json({ error: 'Erro ao buscar dados para os relatórios' })
    }
  }
}
