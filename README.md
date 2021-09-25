# Plantilla de express
## Descripción

Este proyecto corresponde al backend de una tienda de ecommerce. 

## Requisitos
- Node
- npm

## Instalación
**Clonar** el repositorio y **npm install**. Luego podrá ejecutarse con **npm run start** . Entrando en la dirección http://localhost:8080/api/docs podra probarse todos los endpoints de api. Aquellos que necesiten autentificacion podran accederse entrando con cualquier usuario y contraseña ya que por el momento solo es un placeholder para cuando se implemente.

## OPENAPI
### Documentation
The documentation is created with Swagger 3.0. Durante la creación de los ficheros yaml, utilizamos el paquete **swagger-ui-watcher** que debe estar instalado de forma global
Una vez instalado, podremos ver los cambios con **swagger-ui-watcher ./src/docs/openapi.yaml**

### Creation
Para crear el fichero definitivo que será importado por el proyecto, utilizamos : **swagger-ui-watcher ./src/docs/openapi.yaml --bundle=./src/docs/apidocs.json**