import vine from '@vinejs/vine'

/**
 * Validates the creation action
 */
export const createStateValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    acronym: vine.string().trim(),
  })
)
