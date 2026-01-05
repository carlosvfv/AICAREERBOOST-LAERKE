# 🚀 DK Career AI Scheduler

**Tu asistente inteligente para coaching de carrera profesional**

Una aplicación moderna que combina inteligencia artificial conversacional con un sistema de agendamiento de sesiones, diseñada para ayudarte a impulsar tu carrera profesional.

## ✨ Características Principales

### 🤖 Chat con IA para Coaching
- Asistente conversacional inteligente especializado en carrera
- Orientación sobre desarrollo profesional
- Preparación para entrevistas
- Revisión y mejora de CV
- Planificación de carrera personalizada

### 📅 Sistema de Agendamiento
- Calendario interactivo para reservar sesiones
- Selección de horarios disponibles
- Confirmación instantánea
- Interfaz intuitiva en 3 pasos

### 🎨 Diseño Premium
- Interfaz moderna con glassmorphism
- Gradientes vibrantes y animaciones suaves
- Totalmente responsive (móvil y desktop)
- Tema oscuro profesional

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Producción

```bash
npm run build
npm run preview
```

## 💡 Cómo Usar

### Modo Chat
1. Inicia conversación con el AI Coach
2. Pregunta sobre cualquier tema de carrera:
   - Orientación profesional
   - Preparación de entrevistas
   - Mejora de CV
   - Desarrollo de habilidades
3. Recibe consejos personalizados en tiempo real

### Modo Agendamiento
1. **Selecciona Fecha**: Elige un día del calendario
2. **Elige Hora**: Selecciona un horario disponible
3. **Completa Datos**: Ingresa tu información de contacto
4. **Confirmación**: Recibe confirmación de tu sesión

## 🛠️ Stack Tecnológico

- **React 18** - Biblioteca de UI
- **Vite** - Build tool ultrarrápido
- **CSS Moderno** - Variables CSS, Glassmorphism, Animaciones
- **Google Fonts (Inter)** - Tipografía profesional

## 📁 Estructura del Proyecto

```
dk-career-scheduler/
├── src/
│   ├── components/
│   │   ├── AIChat.jsx         # Chat con IA
│   │   ├── Calendar.jsx       # Calendario interactivo
│   │   ├── TimeSlotPicker.jsx # Selector de horarios
│   │   └── BookingForm.jsx    # Formulario de reserva
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Funcionalidades del Chat IA

El asistente puede ayudarte con:

- ✅ **Exploración de Carrera**: Descubre opciones profesionales
- ✅ **Preparación de Entrevistas**: Técnicas y consejos
- ✅ **Optimización de CV**: Mejora tu currículum
- ✅ **Desarrollo Profesional**: Planifica tu crecimiento
- ✅ **Agendamiento**: Reserva sesiones personalizadas

## 🎨 Personalización

### Cambiar Colores

Edita las variables en `src/index.css`:

```css
:root {
  --color-primary: #8b5cf6;
  --color-primary-hover: #7c3aed;
}
```

### Modificar Horarios

Edita `src/components/TimeSlotPicker.jsx`:

```javascript
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00'
];
```

### Personalizar Respuestas de IA

Modifica la función `simulateAIResponse` en `src/components/AIChat.jsx`

## 🔮 Roadmap - Próximas Mejoras

### Versión 2.0
- [ ] Integración real con DeepSeek API
- [ ] Backend para persistencia de datos
- [ ] Autenticación de usuarios
- [ ] Historial de conversaciones

### Versión 3.0
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Integración con Google Calendar
- [ ] Panel de administración
- [ ] Analytics y métricas

### Versión 4.0
- [ ] App móvil nativa (React Native)
- [ ] Videollamadas integradas
- [ ] Sistema de pagos
- [ ] Múltiples coaches

## 🔐 Configuración de API (Futuro)

Para conectar con DeepSeek API real:

1. Obtén tu API key de DeepSeek
2. Crea archivo `.env`:
```
VITE_DEEPSEEK_API_KEY=tu_api_key_aqui
```
3. Actualiza `AIChat.jsx` para usar la API real

## 📝 Notas de Desarrollo

- **Versión Actual**: MVP 1.0
- **Estado**: Funcional con IA simulada
- **Próximo paso**: Integración con API real de DeepSeek

## 🤝 Contribuir

Este es un proyecto en desarrollo activo. Las sugerencias y mejoras son bienvenidas.

## 📄 Licencia

MIT

---

**Desarrollado con ❤️ para impulsar carreras profesionales**

*DK Career AI Scheduler - Donde la IA se encuentra con tu futuro profesional*
