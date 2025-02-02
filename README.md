# Instalacion del Script con Node.js en Segundo Plano

Para ejecutar un script de Node.js en segundo plano sin que se detenga.

---

### Instalación y uso

1. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
1. Instala `pm2` globalmente:
   ```bash
   npm install -g pm2
   ```
1. Compila el código TypeScript:
   ```bash
   npx tsc
   ```
1. Ejecuta tu script con `pm2`:
   ```bash
   pm2 start dist/index.js --name "dgprc-documents"
   ```
1. Para asegurarte de que se inicie al reiniciar el servidor:
   ```bash
   pm2 startup
   ```
1. Guarda el estado actual de los procesos:
   ```bash
   pm2 save
   ```
1. Ver el estado del proceso:
   ```bash
   pm2 list
   ```
1. Para detenerlo:
   ```bash
   pm2 stop dgprc-documents
   ```
   ```bash
   pm2 stop all
   ```
1. Para eliminarlo:
   ```bash
   pm2 delete dgprc-documents
   ```
   ```bash
   pm2 delete all
   ```
1. Ver los logs:
   ```bash
   pm2 logs dgprc-documents
   ```
1. Ver los errores:
   ```bash
   pm2 logs dgprc-documents --err
   ```
1. Limpiar los logs:
   ```bash
   pm2 flush
   ```
