import vine from '@vinejs/vine'

/**
 * Validates the creation action
 */
export const createCropValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
  })
)
