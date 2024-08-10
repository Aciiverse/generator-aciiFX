declare namespace NodeJS {
    interface ProcessEnv {
        FX_PORT?: string;
        FX_SYSTEM?: "LOCAL" | "SERVER" | "DEMO";
        FX_DOMAIN?: string;
        FX_SECRET_KEY?: string;
        FX_DB_HOST?: string;
        FX_DB_USER?: string;
        FX_DB_NAME?: string;
        FX_DB_PASS?: string;
        FX_DB_PORT?: string;
        FX_LANG_DEFAULT_LANGUAGE?: string;
    }
}