export interface LangGetTextOptions {
    language?: string;
    values?: string[];
}

interface LangFile {
    [key: string]: string;
}

export module lang {
    /**
     * @method gets the language text
     * @param {string} key query for sql database
     * @param {LangGetTextOptions?} options optional for `language` & `values`
     * @returns {string} the searched text
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 11.08.2024
     */
    export function getText(key: string, options?: LangGetTextOptions): string {
        const languageArr: string[] = [],
            configLanguageKey = process.env.FX_LANG_DEFAULT_LANGUAGE;
        let foundTxt = undefined as string | undefined;

        // Add manually defined language key to []
        if (options) {
            // -> options set
            if (options.language && typeof options.language === "string") {
                // -> language set
                languageArr.push(options.language);
            }
        }

        // Add config language key to []
        if (configLanguageKey && typeof configLanguageKey === "string" && !languageArr.includes(configLanguageKey)) {
            // -> config language code valid & unique
            languageArr.push(configLanguageKey);
        }

        // Add default language key to []
        if (!languageArr.includes("en")) {
            // -> default language code unique
            languageArr.push("en");
        }

        languageArr.some((code) => {
            // Get Language file
            const defaultLang = importLangFile(code);

            if (defaultLang) {
                // -> file successfully loaded
                try {
                    const langTxt = defaultLang[key];

                    if (langTxt && typeof langTxt === "string") {
                        // -> langtxt valid
                        foundTxt = langTxt;
                        return true;
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        });

        if (foundTxt && typeof foundTxt === "string") {
            return foundTxt;
        } else {
            console.error(`LanguageModule: Text "${key}" not founded`);
            return "";
        }
    }

    /**
     * @method imports a language file dynamically
     * @param {string} lang the language key for example: `en`, `de`, `fr`
     * @returns {LangFile | undefined} the requested language file
     * @author Flowtastisch
     * @memberof Aciiverse
     * @date 11.08.2024
     */
    function importLangFile(lang: string): LangFile | undefined {
        try {
            const translations: LangFile | undefined = require(`../../lang/${lang}.lang.json`);
            return translations;
        } catch (error) {
            if (!(error instanceof Error) || (error as NodeJS.ErrnoException).code !== "MODULE_NOT_FOUND") {
                // -> unexpected error
                console.error("Error at translation file loading:", error);
                throw Error;
            } else {
                // -> expected error if no file dir founded
                console.info(`language file for '${lang}' not founded`);
            }
            return undefined;
        }
    }
}
