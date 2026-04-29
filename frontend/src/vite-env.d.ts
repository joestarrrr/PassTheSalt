/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string
  readonly VITE_BASE_PATH?: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  const __BACKEND_URL__: string | undefined
}

export {}
