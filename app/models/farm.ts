import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import City from '#models/city'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Season from '#models/season'

export default class Farm extends BaseModel {
  public static table = 'propriedades'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'nome' })
  declare name: string | null

  @column({ columnName: 'id_cidade' })
  declare cityId: number | null

  @column({ columnName: 'area_total' })
  declare totalArea: number | null

  @column({ columnName: 'area_agricultavel' })
  declare arableArea: number | null

  @column({ columnName: 'area_vegetacao' })
  declare vegetationArea: number | null

  @belongsTo(() => City)
  declare city: BelongsTo<typeof City>

  @manyToMany(() => Season, {
    pivotTable: 'propriedades_safras',
    localKey: 'id',
    pivotForeignKey: 'id_propriedade',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'id_safra',
  })
  declare farmSeasons: ManyToMany<typeof Season>
}
