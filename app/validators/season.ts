import vine from '@vinejs/vine'

/**
 * Validates the creation action
 */
export const createSeasonValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    year: vine.number(),
  })
)
