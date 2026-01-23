import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resources } from './resources';

const LANGUAGE_KEY = 'settings.language';

const getLanguage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage) {
            return savedLanguage;
        }
    } catch (error) {
        console.log('Error reading language from storage', error);
    }

    const locales = Localization.getLocales();
    return locales[0]?.languageCode ?? 'en';
};

const initI18n = async () => {
    const language = await getLanguage();

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: language,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
        });
};

initI18n();

export default i18n;

export const changeLanguage = async (lang: string) => {
    try {
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (error) {
        console.log('Error saving language to storage', error);
    }
};
