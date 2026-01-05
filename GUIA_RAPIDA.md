# 📖 Guía Rápida - DK Career AI Scheduler

## 🎯 ¿Qué es esta aplicación?

**DK Career AI Scheduler** es tu asistente personal de carrera que combina:
- 🤖 **Inteligencia Artificial** para coaching conversacional
- 📅 **Sistema de Agendamiento** para sesiones personalizadas

---

## 🚀 Cómo Empezar

### 1. Iniciar la Aplicación

```bash
npm run dev
```

Abre tu navegador en: **http://localhost:5173**

---

## 💬 Usando el Chat con IA

### ¿Qué puedes preguntar?

**Sobre tu Carrera:**
- "¿Qué opciones de carrera tengo en tecnología?"
- "¿Cómo puedo cambiar de carrera?"
- "¿Qué habilidades debería desarrollar?"

**Preparación de Entrevistas:**
- "¿Cómo prepararme para una entrevista técnica?"
- "Dame ejemplos de preguntas comunes"
- "¿Qué es la técnica STAR?"

**Mejora de CV:**
- "¿Cómo mejorar mi currículum?"
- "¿Qué debería incluir en mi CV?"
- "¿Cómo destacar mis logros?"

**Agendamiento:**
- "Quiero agendar una cita"
- "Necesito una sesión de coaching"
- "¿Puedo reservar una reunión?"

### Ejemplo de Conversación

```
Tú: Hola, necesito ayuda con mi CV

IA: Un CV efectivo debe:
    • Ser conciso (1-2 páginas)
    • Destacar logros cuantificables
    • Usar verbos de acción
    • Estar adaptado al puesto
    
    ¿Quieres que revisemos tu CV en una sesión personalizada?

Tú: Sí, quiero agendar una cita

IA: ¿Te gustaría agendar una sesión de coaching personalizada? 
    Haz clic en el botón "📅 Agendar Sesión"
```

---

## 📅 Agendando una Sesión

### Paso 1: Cambiar a Vista de Agendamiento
- Click en el botón **"📅 Agendar Sesión"** en la parte superior
- O haz click en **"📅 Agendar Sesión"** dentro del chat

### Paso 2: Seleccionar Fecha
- Verás un calendario interactivo
- Los días pasados están deshabilitados (gris)
- Haz click en cualquier día futuro disponible

### Paso 3: Elegir Hora
- Verás los horarios disponibles:
  - 09:00, 10:00, 11:00, 12:00
  - 14:00, 15:00, 16:00, 17:00
- Haz click en tu horario preferido

### Paso 4: Completar Datos
- **Nombre completo**: Tu nombre
- **Email**: Para recibir confirmación
- **Notas** (opcional): Temas que quieres tratar

### Paso 5: Confirmación
- Verás un resumen de tu reserva
- Recibirás confirmación por email (simulado en MVP)
- Click en **"Volver al Chat"** para continuar

---

## 🎨 Características de la Interfaz

### Indicador de Progreso
Cuando estés agendando, verás 3 pasos:
1. **Fecha** - Selecciona el día
2. **Hora** - Elige el horario
3. **Detalles** - Completa tu información

Los pasos completados se marcan con ✓

### Navegación
- **💬 Chat con IA**: Vuelve al chat en cualquier momento
- **📅 Agendar Sesión**: Accede al calendario
- **← Atrás**: Retrocede un paso en el agendamiento

---

## 💡 Tips y Trucos

### Para el Chat
1. **Sé específico**: Cuanto más detalles des, mejor será la respuesta
2. **Usa Enter**: Presiona Enter para enviar mensajes
3. **Scroll automático**: Los mensajes nuevos aparecen automáticamente

### Para Agendar
1. **Planifica con anticipación**: Selecciona fechas futuras
2. **Revisa antes de confirmar**: Verifica fecha y hora
3. **Guarda tu confirmación**: Toma captura de la pantalla final

---

## 🔧 Solución de Problemas

### El chat no responde
- Verifica que el servidor esté corriendo (`npm run dev`)
- Recarga la página (F5)

### No puedo seleccionar una fecha
- Las fechas pasadas están deshabilitadas
- Solo puedes seleccionar días futuros

### El botón "Confirmar" no funciona
- Asegúrate de llenar todos los campos requeridos
- Nombre y Email son obligatorios

---

## 📱 Atajos de Teclado

- **Enter**: Enviar mensaje en el chat
- **Shift + Enter**: Nueva línea en el chat
- **F5**: Recargar aplicación

---

## 🎯 Próximos Pasos

Una vez que domines el MVP, podrás:
- Conectar con API real de DeepSeek
- Guardar historial de conversaciones
- Recibir notificaciones reales
- Integrar con Google Calendar
- Usar como PWA en tu móvil

---

## 📞 Soporte

¿Tienes preguntas o sugerencias?
- Revisa el README.md completo
- Consulta el código fuente
- Experimenta con las funcionalidades

---

**¡Disfruta tu experiencia con DK Career AI Scheduler!** 🚀

*Tu futuro profesional comienza aquí*
