import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Crop from '#models/crop'

export default class FarmSeasonsCrop extends BaseModel {
  public static table = 'propriedades_safras_culturas'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'id_propriedade_safra' })
  declare farmSeasonId: number

  @column({ columnName: 'id_cultura' })
  declare cropId: number

  @belongsTo(() => Crop)
  declare crop: BelongsTo<typeof Crop>
}
