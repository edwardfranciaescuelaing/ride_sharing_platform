
# Despliegue de Aplicación Completa (Frontend en EC2, Backend en Lambda) en AWS

Este documento proporciona una guía paso a paso para desplegar tu aplicación completa en AWS. El frontend se desplegará en una instancia EC2 y consumirá el backend desde una API Gateway que expone las funciones Lambda en AWS.

## Índice

- # Requisitos previos
- # 1. Configuración del Backend en AWS Lambda y API Gateway
- # 2. Configuración del Frontend en EC2
- # 3. Configuración de Grupos de Seguridad en AWS
- # 4. Configuración de NGINX para el Frontend en EC2
- # 5. Conexión entre el Frontend y el Backend
- # 6. Prueba de Despliegue
  
---

## Requisitos previos

1. **Cuenta en AWS** con permisos para crear y configurar instancias EC2, funciones Lambda y API Gateway.
2. **Código del frontend** listo para desplegarse.
3. **Conexión SSH** habilitada (guarda la clave privada que usaste al lanzar la instancia).

## 1. Configuración del Backend en AWS Lambda y API Gateway

Este tutorial asume que ya tienes tus funciones Lambda implementadas y funcionando, y que estas funciones devuelven los datos que tu frontend necesita.

### 1.1 Configuración del API Gateway

1. Ve a **API Gateway** en la consola de AWS.
2. Crea una nueva API REST o usa una existente para tus funciones Lambda.
3. Configura los **endpoints** necesarios para cada función Lambda:
   - Asocia cada función Lambda al endpoint correspondiente.
   - Configura la **URL de invocación** en el formato que tu frontend necesita.
4. **Implementa** la API en una etapa (por ejemplo, `beta` o `prod`) y anota la URL base, ya que será utilizada en el frontend para las solicitudes HTTP.

### 1.2 Probar la API Gateway

Haz pruebas desde Postman o cURL para asegurarte de que los endpoints de API Gateway están funcionando y devuelven los datos en el formato esperado.

´´´

curl -X GET "https://api-id.execute-api.region.amazonaws.com/beta/coordinates/position?coords='5.6097:-74.0709:4.6357:-74.0709'"

´´´

Si todo está correcto, esta URL se utilizará en tu frontend para interactuar con el backend.

---

## 2. Configuración del Frontend en EC2

### 2.1 Lanzar una Instancia EC2 para el Frontend

1. Inicia sesión en AWS y ve a **EC2 > Instancias**.
2. Selecciona **Launch Instance** y configura:
   - **Nombre**: `Frontend-Instance`.
   - **AMI**: Ubuntu 20.04 o Amazon Linux 2.
   - **Tipo de instancia**: t2.micro (o más, según tus necesidades).
3. Configura el **Security Group** permitiendo el tráfico HTTP (puerto 80).
4. Completa la creación de la instancia y asegúrate de descargar el archivo `.pem` si aún no tienes una clave privada.

### 2.2 Conectar a la Instancia EC2

Conéctate a la instancia EC2 mediante SSH:

´´´

ssh -i /ruta/a/tu_clave.pem ubuntu@IP_de_la_Instancia_Frontend

´´´

### 2.3 Configuración del Entorno del Frontend

1. **Actualizar paquetes del sistema**:
   
´´´

sudo apt update ## sudo apt upgrade -y

´´´

2. **Instalar NGINX** como servidor web:

´´´

sudo apt install nginx -y

´´´

3. **Clonar tu repositorio frontend**:

´´´

git clone <URL_DEL_REPOSITORIO_FRONTEND>
cd <directorio_frontend>

´´´

4. **Construir el frontend** (si está hecho en React, Vue, etc.):

´´´

npm install
npm run build

´´´

Este comando generará una carpeta de **build** con los archivos listos para producción.

5. **Copiar los archivos de build a la carpeta de NGINX**:

´´´

sudo cp -r build/* /var/www/html/

´´´

---

## 3. Configuración de Grupos de Seguridad en AWS

1. En **EC2 > Security Groups**, asegúrate de que el grupo de seguridad de tu instancia permite el tráfico HTTP (puerto 80) y SSH (puerto 22).
2. **API Gateway** no requiere configuraciones adicionales de seguridad para ser accedido por tu instancia EC2.

---

## 4. Configuración de NGINX para el Frontend en EC2

1. Abre el archivo de configuración de NGINX:

´´´

sudo nano /etc/nginx/sites-available/default

´´´

2. Configura NGINX para servir los archivos de tu frontend, reemplazando el contenido con:

´´´

server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

´´´

3. **Reinicia NGINX** para aplicar los cambios:

´´´

sudo systemctl restart nginx

´´´

---

## 5. Conexión entre el Frontend y el Backend

1. En el código del frontend, encuentra los lugares donde se realizan las solicitudes a la API.
2. Sustituye las URLs de prueba o locales con la URL de la API Gateway en AWS:

´´´

const API_BASE_URL = "https://api-id.execute-api.region.amazonaws.com/beta";

´´´

3. Asegúrate de que cada llamada a la API utiliza esta URL base concatenada con los endpoints correspondientes.

---

## 6. Prueba de Despliegue

1. **Abrir el frontend**: Ingresa la dirección IP pública de tu instancia EC2 en un navegador web para ver la aplicación frontend desplegada.
   
´´´

http://IP_de_la_Instancia_Frontend

´´´

2. **Probar la funcionalidad completa**: Navega por la aplicación y verifica que el frontend está interactuando correctamente con el backend a través del API Gateway.

---

# Notas adicionales

- Si deseas mantener el frontend activo en segundo plano, puedes configurar **PM2** para manejar NGINX o el servidor.
- Configura tus variables de entorno en un archivo `.env` para proteger tus claves y URLs de API sensibles.
