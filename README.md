# ZenithList - Production Ready Assets Guide

The following assets are required for a production-ready build. Please place them in the `assets/` directory with the exact names and dimensions specified below.

## 1. App Icon
- **File:** `assets/icon.png`
- **Dimension:** 1024x1024 px
- **Format:** PNG
- **Description:** The main app icon displayed on the home screen.

## 2. Adaptive Icon (Android)
- **File:** `assets/adaptive-icon.png`
- **Dimension:** 1024x1024 px
- **Format:** PNG
- **Description:** Foreground image for Android adaptive icons. Ensure the main logo is centered within the "safe zone" (inner 66% of the image).

## 3. Splash Screen
- **File:** `assets/splash.png`
- **Dimension:** 2048x2048 px (or optimized for multiple screens)
- **Format:** PNG
- **Description:** The image shown during app launch.

## 4. Brand Colors
The app uses the following Tailwind palette:
- Primary: `#6366f1` (Indigo 500)
- Background: `#f8fafc` (Slate 50) / `#000000` (Black)
- Text: `#0f172a` (Slate 900) / `#f8fafc` (Slate 50)

---

To generate these assets, you can use tools like Figma or Canva. Once placed, `app.json` is already configured to reference them.
