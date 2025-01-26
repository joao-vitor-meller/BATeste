import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class State extends BaseModel {
  public static table = 'estados'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string | null

  @column({ columnName: 'sigla' })
  declare acronym: string | null
}
