# Venge Hardware - Frontend Ecommerce

Un frontend moderno y minimalista para la tienda de hardware gaming "Venge Hardware", diseñado específicamente para la experiencia del cliente.

## 🚀 Características

- **Diseño Minimalista**: Interfaz limpia y moderna con enfoque en la experiencia del usuario
- **Productos en Inicio**: Los productos se muestran directamente en la página principal
- **Navegación Intuitiva**: Menú simple y fácil de usar
- **Filtros Avanzados**: Búsqueda por nombre, filtrado por categoría y ordenamiento
- **Carrito de Compras**: Gestión completa del carrito con persistencia local
- **Responsive Design**: Optimizado para dispositivos móviles y desktop
- **Integración con Backend**: Conectado con tu API Java Spring Boot

## 📁 Estructura del Proyecto

```
front/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Este archivo
```

## 🛠️ Configuración

### Requisitos Previos

1. **Backend Java**: Asegúrate de que tu backend esté corriendo en `http://localhost:8080`
2. **Navegador Web**: Cualquier navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalación

1. **Clona o descarga** los archivos del frontend
2. **Abre** el archivo `index.html` en tu navegador
3. **¡Listo!** La aplicación debería funcionar automáticamente

### Configuración del Backend

Si tu backend está corriendo en un puerto diferente, modifica la URL en `script.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api'; // Cambia el puerto si es necesario
```

## 🎯 Funcionalidades

### Página de Inicio
- **Hero Section**: Presentación atractiva de la marca
- **Productos Destacados**: Muestra los primeros 6 productos
- **Categorías**: Acceso rápido a las categorías principales

### Gestión de Productos
- **Vista de Productos**: Grid responsive con información completa
- **Búsqueda en Tiempo Real**: Filtrado instantáneo por nombre o descripción
- **Filtros por Categoría**: Selección de categorías específicas
- **Ordenamiento**: Por nombre, precio (ascendente/descendente), stock
- **Vista Detallada**: Modal con información completa del producto

### Carrito de Compras
- **Agregar Productos**: Desde cualquier vista de producto
- **Gestión de Cantidades**: Aumentar/disminuir cantidades
- **Persistencia Local**: Los productos se mantienen entre sesiones
- **Cálculo Automático**: Total actualizado en tiempo real
- **Validación de Stock**: Previene agregar más productos que el stock disponible

### Proceso de Compra
- **Formulario de Pedido**: Datos del cliente y dirección
- **Resumen del Pedido**: Confirmación antes de finalizar
- **Integración con API**: Envío del pedido al backend
- **Confirmación**: Modal de éxito con detalles del pedido

### Historial de Pedidos
- **Lista de Pedidos**: Vista de todos los pedidos realizados
- **Estados**: Información del estado actual de cada pedido
- **Detalles**: Información completa de cada transacción

## 🎨 Diseño

### Paleta de Colores
- **Primario**: Azul (#3b82f6)
- **Secundario**: Verde (#059669)
- **Neutro**: Grises (#1a1a1a, #6b7280, #9ca3af)
- **Fondo**: Blanco (#ffffff)
- **Bordes**: Gris claro (#e5e7eb)

### Tipografía
- **Fuente Principal**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

### Componentes
- **Cards**: Bordes redondeados con sombras sutiles
- **Botones**: Estados hover con animaciones suaves
- **Formularios**: Inputs con focus states
- **Modales**: Overlay con backdrop blur

## 📱 Responsive Design

El frontend está optimizado para:
- **Desktop**: 1200px+ (3 columnas de productos)
- **Tablet**: 768px - 1199px (2 columnas de productos)
- **Mobile**: < 768px (1 columna de productos)

### Características Mobile
- Menú hamburguesa para navegación
- Layout adaptativo
- Touch-friendly buttons
- Optimización de imágenes

## 🔧 API Endpoints Utilizados

El frontend se conecta con los siguientes endpoints de tu backend:

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/buscar?q={query}` - Buscar productos
- `POST /api/productos` - Crear producto (admin)

### Categorías
- `GET /api/categorias` - Obtener todas las categorías
- `POST /api/categorias` - Crear categoría (admin)

### Pedidos
- `POST /api/pedidos` - Crear nuevo pedido
- `GET /api/pedidos` - Obtener historial de pedidos

## 🚀 Uso

### Para Clientes
1. **Explorar Productos**: Navega por las categorías o usa la búsqueda
2. **Agregar al Carrito**: Haz clic en "Agregar" en cualquier producto
3. **Gestionar Carrito**: Ajusta cantidades o elimina productos
4. **Realizar Pedido**: Completa el formulario y confirma la compra
5. **Seguir Pedido**: Revisa el estado en "Mis Pedidos"

### Para Desarrolladores
- **Modificar Estilos**: Edita `styles.css` para personalizar el diseño
- **Agregar Funcionalidades**: Extiende `script.js` con nuevas features
- **Integrar APIs**: Modifica las llamadas a la API según tu backend

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Los productos no se cargan**
   - Verifica que el backend esté corriendo
   - Revisa la URL en `API_BASE_URL`
   - Abre las herramientas de desarrollador para ver errores

2. **Errores de CORS**
   - Asegúrate de que tu backend permita requests desde el frontend
   - Configura CORS en tu aplicación Spring Boot

3. **Imágenes no se muestran**
   - Verifica que las URLs de las imágenes sean válidas
   - Las imágenes fallidas muestran un placeholder automáticamente

### Debugging
- Abre las **Herramientas de Desarrollador** (F12)
- Revisa la **Consola** para errores JavaScript
- Verifica la **Pestaña Network** para requests fallidos

## 📈 Próximas Mejoras

- [ ] Sistema de autenticación de usuarios
- [ ] Wishlist de productos
- [ ] Sistema de reseñas y calificaciones
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Integración con pasarelas de pago

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

## 📄 Licencia

Este proyecto es parte del curso de Backend en Java. Todos los derechos reservados.

---

**Desarrollado con ❤️ para Venge Hardware**
