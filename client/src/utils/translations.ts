interface Translations {
    [key: string]: {
        fa: string;
        en: string;
    };
}

export const translations: Translations = {
    homeTitle: {
        fa: "صفحه اصلی",
        en: "Home Page",
    },
    authenticated: {
        fa: "وضعیت ورود",
        en: "Authenticated",
    },
    yes: {
        fa: "بله",
        en: "Yes",
    },
    no: {
        fa: "خیر",
        en: "No",
    },
    login: {
        fa: "ورود",
        en: "Login",
    },
    logout: {
        fa: "خروج",
        en: "Logout",
    },
    aboutTitle: {
        fa: "درباره ما",
        en: "About Page",
    },
    goToAbout: {
        fa: "برو به درباره",
        en: "Go to About",
    },
    backToHome: {
        fa: "برگشت به خانه",
        en: "Back to Home",
    },
    loading: {
        fa: "در حال بارگذاری...",
        en: "Loading...",
    },
    error: {
        fa: "خطا در بارگذاری داده",
        en: "Error loading data",
    },
};
