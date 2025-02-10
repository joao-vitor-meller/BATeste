/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const usersController = () => import('#controllers/users_controller')
const statesController = () => import('#controllers/states_controller')
const citiesController = () => import('#controllers/cities_controller')
const farmsController = () => import('#controllers/farms_controller')
const seasonsController = () => import('#controllers/seasons_controller')
const cropsController = () => import('#controllers/crops_controller')
const reportsController = () => import('#controllers/reports_controller')
import { swaggerSpec, swaggerUi } from '#start/swagger'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/swagger', async ({ response }) => {
  return response.json(swaggerSpec)
})

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Interface Swagger UI
 *     description: Exibe a documentação da API em uma interface web
 *     responses:
 *       200:
 *         description: Página do Swagger UI
 */
router.get('/api-docs', async ({ response }) => {
  response.header('Content-Type', 'text/html')
  response.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Swagger UI</title>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js"></script>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script>
            window.onload = function() {
                const ui = SwaggerUIBundle({
                    url: "/swagger", // Carrega o JSON da documentação
                    dom_id: "#swagger-ui",
                    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                    layout: "StandaloneLayout"
                });
            };
        </script>
    </body>
    </html>
  `)
})

router
  .group(() => {
    router.get('/', [usersController, 'index'])
    router.post('/', [usersController, 'store'])
    router.put('/:id', [usersController, 'update'])
    router.delete('/:id', [usersController, 'destroy'])
  })
  .prefix('/users')

router
  .group(() => {
    router.get('/', [statesController, 'index'])
    router.post('/', [statesController, 'store'])
    router.put('/:id', [statesController, 'update'])
    router.delete('/:id', [statesController, 'destroy'])
  })
  .prefix('/states')

router
  .group(() => {
    router.get('/', [citiesController, 'index'])
    router.post('/', [citiesController, 'store'])
    router.put('/:id', [citiesController, 'update'])
    router.delete('/:id', [citiesController, 'destroy'])
  })
  .prefix('/cities')

router
  .group(() => {
    router.get('/', [farmsController, 'index'])
    router.post('/', [farmsController, 'store'])
    router.delete('/:id', [farmsController, 'destroy'])
  })
  .prefix('/farms')

router
  .group(() => {
    router.get('/', [seasonsController, 'index'])
    router.post('/', [seasonsController, 'store'])
    router.put('/:id', [seasonsController, 'update'])
    router.delete('/:id', [seasonsController, 'destroy'])
  })
  .prefix('/seasons')

router
  .group(() => {
    router.get('/', [cropsController, 'index'])
    router.post('/', [cropsController, 'store'])
    router.put('/:id', [cropsController, 'update'])
    router.delete('/:id', [cropsController, 'destroy'])
  })
  .prefix('/crops')

router.get('/users-farms', [usersController, 'userFarms'])

router.post('/farm-seasons', [farmsController, 'storeFarmSeasons'])

router.get('/reports', [reportsController, 'index'])
