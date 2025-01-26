import vine from '@vinejs/vine'

/**
 * Validates the creation action
 */
export const createFarmValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    cityId: vine.number(),
    totalArea: vine.number(),
    arableArea: vine.number(),
    vegetationArea: vine.number(),
    userId: vine.number(),
  })
)

export const createFarmSeasonsValidator = vine.compile(
  vine.object({
    farmId: vine.number(),
    seasonId: vine.number(),
    cropsIds: vine.array(vine.number()),
  })
)
