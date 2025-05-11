# 🏖️ ClimaApp PWA

Bienvenido a **ClimaApp**, una aplicación web progresiva (PWA) para consultar el clima actual y prever el tiempo tanto a nivel diario como por franjas horarias. Está diseñada con **JavaScript puro**, **HTML5**, **CSS3** y la **OpenWeatherMap API**, y ofrece:

* 🌍 **Geolocalización automática** para mostrar el clima de tu ubicación.
* 🔎 **Búsqueda manual** por ciudad (y muestra la Comunidad Autónoma en España).
* 🌡️ **Clima actual**: temperatura, humedad y descripción.
* 📅 **Previsión 5 días** (día a las 12:00).
* ⏰ **Previsión por horas** para el día en curso.
* 📱 **Instalable** como PWA en móviles y escritorios.
* 🚫 **Funciona offline** gracias a Service Worker.

---

## 🛠️ Tecnologías

* **Vanilla JavaScript** (ES6+)
* **HTML5** y **CSS3** (Flexbox, Responsive design)
* **OpenWeatherMap API** (Endpoints: `/weather`, `/forecast`, geocoding/reverse)
* **PWA**: Web Manifest + Service Worker

---

## 🚀 Instalación y puesta en marcha

1. **Clona este repositorio**:

   ```bash
   git clone https://github.com/tu-usuario/climaapp-pwa.git
   cd climaapp-pwa
   ```

2. **Obtén tu API Key** en [https://openweathermap.org/api](https://openweathermap.org/api) y reemplázala en `src/main.js`:

   ```js
   const apiKey = 'TU_API_KEY_AQUÍ';
   ```

3. **Sirve tu proyecto por HTTPS** (necesario para PWA). Por ejemplo, con `http-server`:

   ```bash
   npx http-server . -p 8080 --ssl --cert ./cert.pem --key ./key.pem
   ```

4. **Abre** en tu navegador: `https://localhost:8080`. ¡Y list\@s!

---

## 🔧 Estructura de archivos

```
/ (raíz pública)
├─ index.html             # punto de entrada
├─ manifest.json          # PWA Web Manifest
├─ service-worker.js      # Service Worker
├─ icons/
│   ├─ icon-192.png       # icono instalable
│   └─ icon-512.png       # icono instalable
└─ src/
    ├─ style.css          # estilos globales y layout
    ├─ main.js            # lógica de la app
    └─ img/
        ├─ icon.svg       # logo / favicon
        └─ logo.png       # logo para el footer
```

---

## ⚙️ PWA y offline

* **`manifest.json`** define el nombre, colores y el icono para la instalación.
* **`service-worker.js`** cachea recursos estáticos y permite funcionar sin conexión.
* Al registrar el Service Worker, tu app se instala desde el navegador y se mostrará como una app independiente.

---

## 📐 Personalización

* Cambia **colores** y **tipografías** en `src/style.css`.
* Adapta el **mapa de Comunidades Autónomas** en `src/main.js` si quieres otro país.
* Modifica los **endpoints** de OpenWeatherMap para añadir más datos (por ejemplo, alertas o aire).

---

## 🤝 Contribuciones

¡Contribuciones, sugerencias y mejoras son bienvenidas! Abre un issue o un pull request en GitHub.

---

## 📜 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

Gracias por tu interés y ¡que disfrutes consultando el clima! 🌦️🌈
