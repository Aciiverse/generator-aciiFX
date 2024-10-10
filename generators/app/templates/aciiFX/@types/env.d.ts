declare namespace NodeJS {
    interface ProcessEnv {
        FX_PORT?: string;
        FX_SYSTEM?: "LOCAL" | "SERVER" | "DEMO";
        FX_DOMAIN?: string;
        FX_SECRET_KEY?: string;
        DB_HOST?: string;
        DB_USER?: string;
        DB_NAME?: string;
        DB_PASS?: string;
        DB_PORT?: string;
        FX_LANG_DEFAULT_LANGUAGE?: string;
    }
}
