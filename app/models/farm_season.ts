import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FarmSeason extends BaseModel {
  public static table = 'propriedades_safras'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'id_propriedade' })
  declare farmId: number

  @column({ columnName: 'id_safra' })
  declare seasonId: number
}
