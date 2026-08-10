/// <reference types="vite/client"/>
interface ImpMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImpMeta {
  readonly env: ImpMetaEnv
}
