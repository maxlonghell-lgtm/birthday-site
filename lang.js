// Bilingual translations for Zahra's Birthday Website
// Created by geniusinsanity

let currentLang = localStorage.getItem('lang') || 'en';

const translations = {
    en: {
        title: "Happy Birthday Zahra 🎁",
        description: "A special birthday surprise for Zahra! Click to see the special message!",
        login: "Sign in with Google",
        logout: "Logout",
        settings: "Website Settings",
        music: "Music Settings",
        backgroundMusic: "Background Music:",
        countdown: "Countdown Settings",
        countdownTime: "Countdown Time:",
        matrix: "Matrix Rain Effect Settings",
        matrixText: "Matrix main text:",
        matrixColor1: "Matrix color 1:",
        matrixColor2: "Matrix color 2:",
        sequence: "Main Text Settings",
        sequenceText: "Main text content:",
        sequenceColor: "Main text color:",
        gift: "Animated Image Settings",
        giftImage: "Animated Image (optional):",
        enableBook: "Show book:",
        book: "Book Page Settings",
        enableHeart: "Show heart effect:",
        note: "⏳ Enjoy this special birthday website!",
        follow: "💝 This special birthday website was lovingly created by geniusinsanity",
        apply: "Apply Settings",
        copyright: 'Made with 💕 by geniusinsanity for Zahra\'s Birthday',
        fullscreen: "Fullscreen",
        on: "On",
        off: "Off",
        sec3: "3 seconds",
        sec5: "5 seconds",
        sec10: "10 seconds",
        noGif: "None",
        colorTheme: "Choose color:",
        settingsHint: "click here to customize settings",
        pinkTheme: "Sweet Pink",
       blueTheme: "Cool Blue",
        purpleTheme: "Dreamy Purple",
        customTheme: "Custom Color",
        noteSequence: "Note: Please separate words with | and don't make a line too long",
        noteExpire: "⏳ <b>Note:</b> Enjoy this special birthday surprise! 🎉",
        followNote: "💝 This special birthday website was lovingly created by geniusinsanity",
        notVietnamWarning: '🎉 Happy Birthday Zahra! Wishing you a wonderful day filled with joy and love! 💕',
        pageTitleCover: "Page {num} (Cover)",
        pageTitle: "Page {num}",
        imageLabel: "Image:",
        coverPlaceholder: "Book Cover",
        pagePlaceholder: "Page {num}",
        noImageAlt: "No image yet - {placeholder}",
        contentLabel: "Content:",
        contentPlaceholder: "Enter content for page {num}",
        addNewPage: "➕ Add New Page",
        emptyPage: "Empty page",
        endOfBook: "End of book"
    },
    fr: {
        title: "Joyeux Anniversaire Zahra 🎁",
        description: "Une surprise spéciale pour Zahra ! Cliquez pour voir le message !",
        login: "Se connecter avec Google",
        logout: "Déconnexion",
        settings: "Paramètres du site",
        music: "Paramètres de la musique",
        backgroundMusic: "Musique de fond :",
        countdown: "Paramètres du compte à rebours",
        countdownTime: "Temps du compte à rebours :",
        matrix: "Paramètres de l'effet Matrix",
        matrixText: "Texte principal Matrix :",
        matrixColor1: "Couleur Matrix 1 :",
        matrixColor2: "Couleur Matrix 2 :",
        sequence: "Paramètres du texte principal",
        sequenceText: "Contenu du texte principal :",
        sequenceColor: "Couleur du texte principal :",
        gift: "Paramètres de l'image animée",
        giftImage: "Image animée (optionnel) :",
        enableBook: "Afficher le livre :",
        book: "Paramètres des pages du livre",
        enableHeart: "Afficher l'effet cœur :",
        note: "⏳ Profitez de ce site d'anniversaire spécial !",
        follow: "💝 Ce site spécial a été créé avec amour par geniusinsanity",
        apply: "Appliquer les paramètres",
        copyright: 'Fait avec 💕 par geniusinsanity pour l\'anniversaire de Zahra',
        fullscreen: "Plein écran",
        on: "Activé",
        off: "Désactivé",
        sec3: "3 secondes",
        sec5: "5 secondes",
        sec10: "10 secondes",
        noGif: "Aucun",
        colorTheme: "Choisir la couleur :",
        settingsHint: "cliquez ici pour personnaliser",
        pinkTheme: "Rose Doux",
        blueTheme: "Bleu Frais",
        purpleTheme: "Violet Rêveur",
        customTheme: "Couleur Personnalisée",
        noteSequence: "Note : Séparez les mots par | et ne faites pas de ligne trop longue",
        noteExpire: "⏳ <b>Note:</b> Profitez de cette surprise ! 🎉",
        followNote: "💝 Ce site spécial a été créé avec amour par geniusinsanity",
        notVietnamWarning: '🎉 Joyeux Anniversaire Zahra ! En te souhaitant une merveilleuse journée pleine de joie et d\'amour ! 💕',
        pageTitleCover: "Page {num} (Couverture)",
        pageTitle: "Page {num}",
        imageLabel: "Image :",
        coverPlaceholder: "Couverture du livre",
        pagePlaceholder: "Page {num}",
        noImageAlt: "Pas encore d'image - {placeholder}",
        contentLabel: "Contenu :",
        contentPlaceholder: "Entrez le contenu pour la page {num}",
        addNewPage: "➕ Ajouter une nouvelle page",
        emptyPage: "Page vide",
        endOfBook: "Fin du livre"
    }
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    
    // Set title and meta
    document.title = translations[lang].title;
    document.querySelector('meta[name="description"]').setAttribute('content', translations[lang].description);

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (
                translations[lang][key].includes('<b>') ||
                translations[lang][key].includes('<a')
            ) {
                el.innerHTML = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });

    // Update lang button text if exists
    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
        langBtn.innerText = lang === 'en' ? 'FR' : 'EN';
    }
}

function switchLanguage() {
    const newLang = currentLang === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    
    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
        langBtn.addEventListener('click', switchLanguage);
    }
});

function t(key, vars = {}) {
    let str = (translations[currentLang] && translations[currentLang][key]) || key;
    Object.keys(vars).forEach(k => {
        str = str.replace(`{${k}}`, vars[k]);
    });
    return str;
}
