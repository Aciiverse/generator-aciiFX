export interface LangGetTextOptions {
    language?: string;
    values?: string[]
}

export module Language {
    export function getText(key: string, options?: LangGetTextOptions): string {
        const   languageArr: string[] = [],
                configLanguageKey = process.env.FX_LANG_DEFAULT_LANGUAGE;
        let foundTxt = undefined as string | undefined;

        // Add manually defined language key to []
        if (options) {
            // -> options set
            if (    options.language 
                &&  typeof options.language === 'string' ) {
                // -> language set
                languageArr.push(options.language);
            }
        }

        // Add config language key to []
        if (    configLanguageKey
            &&  typeof configLanguageKey === 'string'
            &&  !languageArr.includes(configLanguageKey) ) {
            // -> config language code valid & unique
            languageArr.push(configLanguageKey);
        }
        
        // Add default language key to []
        if (!languageArr.includes('en')) {
            // -> default language code unique
            languageArr.push('en');
        }

        languageArr.some(code => {
            // Get Language file
            const defaultLang = importLangFile(code);

            if (defaultLang) {
                // -> file successfully loaded
                try {
                    const langTxt = defaultLang[key];

                    if (langTxt && typeof langTxt === 'string') {
                        // -> langtxt valid
                        foundTxt = langTxt;
                        return true;
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        });
        
        if (foundTxt && typeof foundTxt === 'string') {
            return foundTxt;
        } else {
            console.error(`LanguageModule: Text "${key}" not founded`);
            return '';
        }
    }

    function importLangFile (lang: string) {
        try {

            const translations: {[key: string]: string} | undefined = require(`../../lang/${lang}.lang.json`);
            return translations;

        } catch (error) {
            console.error("Error at translation file loading:", error);
            if (    !(error instanceof Error)
                ||  (error as NodeJS.ErrnoException).code !== "MODULE_NOT_FOUND") {
                // -> unexpected error
                throw Error;
            }
            return undefined;
        }
    }
}