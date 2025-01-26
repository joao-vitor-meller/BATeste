import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Crop extends BaseModel {
  public static table = 'culturas'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string | null
}
