import vine from '@vinejs/vine'

/**
 * Validates the creation action
 */
export const createCityValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    stateId: vine.number(),
  })
)
