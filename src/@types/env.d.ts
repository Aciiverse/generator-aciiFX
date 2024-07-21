declare namespace NodeJS {
    interface ProcessEnv {
        FX_PORT?:    string,
        FX_SYSTEM?:  "LOCAL" | "SERVER" | "DEMO",
        FX_DOMAIN?:  string,
        FX_SECRET_KEY?: string
    }
}