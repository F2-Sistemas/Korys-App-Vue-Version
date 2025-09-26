---
question: "como-instalar-postgresql?"
created_at: "2025-09-26T14:59:52.720Z"
---

Para instalar PostgreSQL, debes primero descargar el instalador oficial desde la página de PostgreSQL, correspondiente a tu sistema operativo (Windows, macOS, Linux) y luego seguir los pasos del instalador[1][6].

Aquí tienes un resumen de la instalación para varios sistemas comunes:

**En Windows:**

1. Descarga el instalador oficial desde la página de PostgreSQL o desde el instalador proporcionado por EDB.

2. Ejecuta el archivo descargado para iniciar el asistente de instalación.

3. Selecciona la carpeta donde se instalará PostgreSQL (puedes dejar la opción por defecto).

4. Elige los componentes que deseas instalar: servidor, pgAdmin 4 (herramienta gráfica), herramientas de línea de comandos, etc.

5. Define la carpeta para almacenar los datos de la base de datos (por defecto).

6. Establece una contraseña para el usuario administrador "postgres". Recuerda esta contraseña para futuras conexiones.

7. Selecciona el puerto que usará el servidor (por defecto es 5432).

8. Configura la localización del servidor (idioma/región).

9. Revisa el resumen y confirma para comenzar la instalación.

10. Espera a que finalice la instalación y cierra el asistente[1][3][4][7].

**En Ubuntu (Linux):**

1. Agrega el repositorio oficial de PostgreSQL y su llave al gestor de paquetes APT con comandos específicos.

2. Actualiza el índice de paquetes con `sudo apt update`.

3. Instala PostgreSQL con `sudo apt-get -y install postgresql`.

4. Comprueba que PostgreSQL está activo y funcionando con `sudo -u postgres psql`.

5. Puedes consultar la versión con la consulta SQL: `SELECT version();`[2].

**En macOS:**

1. Descarga el instalador oficial para macOS desde la página de PostgreSQL.

2. Ejecuta el instalador y sigue un proceso similar al de Windows: seleccionar ubicación, componentes, contraseña usuario "postgres", puerto, localización.

3. Finaliza la instalación y verifica su correcto funcionamiento[5].

En todos los casos, tras la instalación podrás usar pgAdmin 4 o la línea de comandos para administrar las bases de datos PostgreSQL.

Si quieres una guía paso a paso con comandos o imágenes, los enlaces ofrecen tutoriales útiles para cada plataforma[1][2][3][5].