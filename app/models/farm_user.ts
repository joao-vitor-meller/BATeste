import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FarmUser extends BaseModel {
  public static table = 'propriedades_usuarios'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'id_usuario' })
  declare userId: number

  @column({ columnName: 'id_propriedade' })
  declare farmId: number
}
