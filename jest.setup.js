//este archivo fue creado porque Jest no corre en Node.js y no tiene soporte nativo para APIs del navegador como Chart y Recharts
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;