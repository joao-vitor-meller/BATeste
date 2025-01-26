import vine from '@vinejs/vine'

/**
 * Validates the user's creation action
 */
export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    cpf: vine.string().trim().optional(),
    cnpj: vine.string().trim().optional(),
  })
)

/**
 * Validates the user's update action
 */
export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    cpf: vine.string().trim().optional(),
    cnpj: vine.string().trim().optional(),
  })
)
