import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Farm from '#models/farm'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static table = 'usuarios'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string | null

  @column()
  declare cpf: string

  @column()
  declare cnpj: string

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @manyToMany(() => Farm, {
    pivotTable: 'propriedades_usuarios',
    localKey: 'id',
    pivotForeignKey: 'id_usuario',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'id_propriedade',
  })
  declare userFarms: ManyToMany<typeof Farm>
}
