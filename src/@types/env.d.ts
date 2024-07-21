declare namespace NodeJS {
    interface ProcessEnv {
        FX_PORT?:    string,
        FX_SYSTEM?:  "LOCAL" | "SERVER",
        FX_DOMAIN?:  string,
    }
}