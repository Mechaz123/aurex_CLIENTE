# AUREX_CLIENTE
:heavy_check_mark: Check: Repositorio api CLIENTE para AUREX.

## Especificaciones Tecnicas

### Tecnologías implementadas

<p align="center">
  <a href="http://reactnative.dev/" target="blank"><img src="https:/reactnative.dev/Home/Logo" width="120" alt="React-Native Logo" /></a>
</p>

<p align="Center">React-Native</p>

### Variables de entorno

Se debe crear un archivo .env para manejar las variables de entorno.

```bash
# API parametros
AUREX_CLIENTE_AUREX_MID_URL=[URL de AUREX_MID]
AUREX_CLIENTE_AUREX_CRUD_URL=[URL de AUREX_CRUD]
```

## Configuración del proyecto

```bash
$ npm install
```

## Compilación y ejecución del proyecto

```bash
# Desarrollo
$ npm start
```

## Despliegue

Actualmente para desplegar el sistema de debe generar el APK y este debe ser subido en un Azure Storage, de manera que se reemplace la versión antigua por la nueva generada, después de esto, se debe acceder al link que genere Azure y se descarga el APK y se instala.