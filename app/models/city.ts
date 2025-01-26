import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import States from '#models/state'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class City extends BaseModel {
  public static table = 'cidades'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string | null

  @column({ columnName: 'id_estado' })
  declare stateId: number | null

  @belongsTo(() => States)
  declare state: BelongsTo<typeof States>
}
