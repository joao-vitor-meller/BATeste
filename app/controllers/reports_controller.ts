import type { HttpContext } from '@adonisjs/core/http'
import Farm from '#models/farm'
import db from '@adonisjs/lucid/services/db'

export default class ReportsController {
  public async index({ response }: HttpContext) {
    const farms = await Farm.all()

    const totalHectares = farms.reduce((sum, farm) => {
      const area = farm.totalArea !== null ? Number.parseFloat(String(farm.totalArea)) : 0
      return sum + area
    }, 0)

    // Fazendo a consulta para farms por estado
    const farmsByState = await db
      .from('propriedades as p')
      .select('e.nome as estado')
      .count('p.id as total_fazendas')
      .join('cidades as c', 'p.id_cidade', 'c.id')
      .join('estados as e', 'c.id_estado', 'e.id')
      .groupBy('e.id', 'e.nome')

    // Fazendo a consulta para farms por cultura
    const farmsByCulture = await db
      .from('propriedades_safras_culturas as psc')
      .select('c.nome as cultura')
      .count('psc.id as total_propriedades')
      .join('culturas as c', 'psc.id_cultura', 'c.id')
      .groupBy('c.id', 'c.nome')

    // Consultando os totais de áreas
    const dados = await db
      .from('propriedades')
      .select(
        db.raw(
          'SUM(area_agricultavel) AS total_area_agricultavel, SUM(area_vegetacao) AS total_area_vegetacao, SUM(area_total) AS total_area'
        )
      )
      .first()

    // Garantir que as variáveis existem e fazer o cálculo das proporções
    const areaAgricultavel = dados?.total_area_agricultavel
      ? Number.parseFloat(dados.total_area_agricultavel)
      : 0
    const areaVegetacao = dados?.total_area_vegetacao
      ? Number.parseFloat(dados.total_area_vegetacao)
      : 0

    const areaTotal = dados?.total_area ? Number.parseFloat(dados.total_area) : 0

    const porcentagemAgricultavel = areaTotal > 0 ? (areaAgricultavel / areaTotal) * 100 : 0
    const porcentagemVegetacao = areaTotal > 0 ? (areaVegetacao / areaTotal) * 100 : 0

    // Garantir que a soma das porcentagens não ultrapasse 100
    const totalPorcentagem = porcentagemAgricultavel + porcentagemVegetacao
    const areaUsage = {
      agriculturable: Math.round(porcentagemAgricultavel * 100) / 100, // Arredondar para 2 casas decimais
      vegetation: Math.round(porcentagemVegetacao * 100) / 100, // Arredondar para 2 casas decimais
    }

    // Ajustar se a soma ultrapassar 100%
    if (totalPorcentagem > 100) {
      areaUsage.agriculturable = Math.min(areaUsage.agriculturable, 100)
      areaUsage.vegetation = 100 - areaUsage.agriculturable
    }

    // Retornar a resposta
    return response.status(200).json({
      totalFarms: farms.length, // Não precisa do || 0, pois `farms.length` será sempre um número
      totalHectares: Math.round(totalHectares * 100) / 100, // Arredondar para 2 casas decimais
      farmsByState: farmsByState, // Não precisa do || 0
      farmsByCulture: farmsByCulture, // Não precisa do || 0
      areaUsage, // Retorna o uso de solo já formatado
    })
  }
}
