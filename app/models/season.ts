import { BaseModel, column, computed } from '@adonisjs/lucid/orm'

export default class Season extends BaseModel {
  public static table = 'safras'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string | null

  @column({ columnName: 'ano' })
  declare year: number | null

  @computed()
  public crops?: { id: number; name: string }[]
}
