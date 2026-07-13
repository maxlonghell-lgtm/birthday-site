const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.querySelector('.close');
let pages = [];
const applySettingsButton = document.getElementById('applySettings');
let settings = {
    music: './music/this december.mp3',
    countdown: 3,
    matrixText: 'HAPPYBIRTHDAY',
    matrixColor1: '#ff69b4', 
    matrixColor2: '#ff1493', 
    sequence: 'HAPPY|BIRTHDAY|TO|YOU|SHARON|❤',
    sequenceColor: '#ff69b4', 
    gift: '', 
    pages: [
        { image: './image/Birthday!/cover.jpg', content: '' }, 
        { image: './image/Birthday!/photo1.jpg', content: 'Dear sharon, you bring so much joy and happiness! 💕' },
        { image: './image/Birthday!/photo2.jpg', content: 'Your smile lights up every room you enter! ✨' },
        { image: './image/Birthday!/photo3.jpg', content: 'You are such an amazing and beautiful person! 🌸' },
        { image: './image/Birthday!/photo4.jpg', content: 'Your kindness and warmth touch hearts! 💖' },
        { image: './image/Birthday!/photo5.jpg', content: 'Wishing you the most wonderful birthday ever! 🎉' },
        { image: './image/Birthday!/photo6.jpg', content: 'May all your dreams come true! ⭐' },
        { image: './image/Birthday!/photo7.jpg', content: 'You deserve all the happiness! 🌈' },
        { image: './image/Birthday!/photo8.jpg', content: 'Love you so much! Have the best day! ❤️🎂' },
        { image: './image/Birthday!/9.jpg', content: '' } 
    ],
    enableBook: true,
    enableHeart: true,
    isSave: false,
};

window.lastIsSaveState = false;

const musicOptions = [
    { value: './music/zahra.mp3', label: 'Happy Birthday sharon' },
    { value: './music/custom.mp3', label: 'Custom Music (Add your own)' }
];
const gifOptions = [
    { value: '', label: 'None' }
];
const musicPreviewButton = document.getElementById('musicPreviewButton');
const musicPreviewStatus = document.getElementById('musicPreviewStatus');
const musicPreviewAudio = new Audio();
musicPreviewAudio.preload = 'auto';
let currentPreviewTrack = '';

function getSelectedMusicLabel() {
    const musicSelect = document.getElementById('backgroundMusic');
    if (!musicSelect) return '';
    const selectedOption = musicSelect.options[musicSelect.selectedIndex];
    return selectedOption ? selectedOption.textContent : '';
}

function getIdlePreviewMessage() {
    const label = getSelectedMusicLabel();
    return label ? `Đã chọn: ${label}` : 'Chọn bài nhạc rồi nhấn "Nghe thử"';
}

function setMusicPreviewState({ message, isPlaying }) {
    if (musicPreviewButton) {
        musicPreviewButton.textContent = isPlaying ? '⏸ Dừng nghe thử' : '▶ Nghe thử';
        if (isPlaying) {
            musicPreviewButton.classList.add('playing');
        } else {
            musicPreviewButton.classList.remove('playing');
        }
    }
    if (musicPreviewStatus && message) {
        musicPreviewStatus.textContent = message;
    }
}

function stopMusicPreview(customMessage) {
    musicPreviewAudio.pause();
    musicPreviewAudio.currentTime = 0;
    currentPreviewTrack = '';
    setMusicPreviewState({
        message: customMessage || getIdlePreviewMessage(),
        isPlaying: false
    });
}

function handleMusicPreview() {
    const musicSelect = document.getElementById('backgroundMusic');
    if (!musicSelect || !musicSelect.value) {
        setMusicPreviewState({
            message: 'Vui lòng chọn một bài nhạc trước khi nghe thử',
            isPlaying: false
        });
        return;
    }

    const selectedSrc = musicSelect.value;
    const selectedLabel = getSelectedMusicLabel();

    if (currentPreviewTrack === selectedSrc && !musicPreviewAudio.paused) {
        stopMusicPreview();
        return;
    }

    currentPreviewTrack = selectedSrc;
    musicPreviewAudio.pause();
    musicPreviewAudio.currentTime = 0;
    musicPreviewAudio.src = selectedSrc;

    musicPreviewAudio.play().then(() => {
        setMusicPreviewState({
            message: `Đang phát: ${selectedLabel}`,
            isPlaying: true
        });
    }).catch(error => {
        console.error('Không thể phát nhạc xem thử:', error);
        stopMusicPreview('Không phát được bản nghe thử. Vui lòng thử lại.');
    });
}

function attachMusicSelectChangeListener() {
    const musicSelect = document.getElementById('backgroundMusic');
    if (!musicSelect) return;
    musicSelect.onchange = () => {
        stopMusicPreview();
    };
}

if (musicPreviewButton) {
    musicPreviewButton.addEventListener('click', handleMusicPreview);
}

musicPreviewAudio.addEventListener('ended', () => stopMusicPreview());
musicPreviewAudio.addEventListener('pause', () => {
    if (musicPreviewAudio.currentTime === 0) {
        setMusicPreviewState({
            message: getIdlePreviewMessage(),
            isPlaying: false
        });
    }
});
musicPreviewAudio.addEventListener('error', () => {
    stopMusicPreview('Không phát được bản nghe thử. Vui lòng thử lại.');
});

stopMusicPreview();

const colorThemes = {
    pink: {
        matrixColor1: '#ff69b4',
        matrixColor2: '#ff1493',
        sequenceColor: '#ff69b4',
        name: 'Hồng ngọt ngào'
    },
    blue: {
        matrixColor1: '#87ceeb',
        matrixColor2: '#4169e1',
        sequenceColor: '#1e90ff',
        name: 'Xanh dương mát mẻ'
    },
    purple: {
        matrixColor1: '#dda0dd',
        matrixColor2: '#9370db',
        sequenceColor: '#8a2be2',
        name: 'Tím mộng mơ'
    },
    custom: {
        matrixColor1: '#ffb6c1',
        matrixColor2: '#ffc0cb',
        sequenceColor: '#d39b9b',
        name: 'Tùy chỉnh màu'
    }
};

function resetWebsiteState() {

    const book = document.getElementById('book');
    const bookContainer = document.querySelector('.book-container');
    const canvas = document.querySelector('.canvas');
    const matrixCanvas = document.getElementById('matrix-rain');
    const giftImageElement = document.getElementById('gift-image');
    const contentDisplay = document.getElementById('contentDisplay');
    const fireworkContainer = document.getElementById('fireworkContainer');
    const birthdayAudio = document.getElementById('birthdayAudio');

    S.initialized = false;

    if (typeof hideStars === 'function') {
        hideStars();
    }

    if (book) {
        book.style.display = 'none';
        book.classList.remove('show');
    }
    if (bookContainer) {
        bookContainer.style.display = 'none';
        bookContainer.classList.remove('show');
    }
    if (contentDisplay) {
        contentDisplay.classList.remove('show');
    }
    if (giftImageElement) {
        giftImageElement.style.display = 'none';
        giftImageElement.style.animation = '';
    }
    if (fireworkContainer) {
        fireworkContainer.style.display = 'none';
        fireworkContainer.style.opacity = '0';
        fireworkContainer.innerHTML = '';
    }

    const photos = document.querySelectorAll('.photo');
    photos.forEach(photo => photo.remove());

    if (canvas) {
        canvas.style.display = 'block';
    }
    if (matrixCanvas) {
        matrixCanvas.style.display = 'block';
    }

    if (typeof currentPage !== 'undefined') {
        currentPage = 0;
    }
    if (typeof isBookFinished !== 'undefined') {
        isBookFinished = false;
    }
    if (typeof isFlipping !== 'undefined') {
        isFlipping = false;
    }
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('flipped', 'flipping');
    });

    if (birthdayAudio && window.settings) {
        birthdayAudio.src = window.settings.music;
        if (typeof isPlaying !== 'undefined' && isPlaying) {
            birthdayAudio.play().catch(error => {
            });
        }
    }

    if (window.settings && typeof matrixChars !== 'undefined') {
        matrixChars = window.settings.matrixText.split('');

        if (typeof matrixInterval !== 'undefined' && matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
            if (matrixCanvas) {
                const matrixCtx = matrixCanvas.getContext('2d');
                matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            }
        }
        if (typeof initMatrixRain === 'function') {
            initMatrixRain();
        }
    }

    if (giftImageElement && window.settings) {
        if (window.settings.gift && window.settings.gift !== '') {
            giftImageElement.src = window.settings.gift;
        } else {
            giftImageElement.src = '';
        }
    }

    if (window.settings && window.settings.pages) {
        pages = window.settings.pages;
        createPages();
    }

    if (typeof S !== 'undefined' && S.UI && window.settings) {
        S.UI.reset(true);
        const sequence = `|#countdown ${window.settings.countdown}|${window.settings.sequence}|#gift|`;
        S.UI.simulate(sequence);
    }

}

function initializeDefaultSettings() {

    window.settings = {
        music: './music/zahra.mp3',
        countdown: 3,
        matrixText: 'HAPPYBIRTHDAY',
        matrixColor1: '#ff69b4', 
        matrixColor2: '#ff1493', 
        sequence: 'HAPPY|BIRTHDAY|TO|YOU|SHARON|❤',
        sequenceColor: '#ff69b4', 
        gift: '', 
        enableBook: true,
        enableHeart: true,
        isSave: false
    };

    // Try to load settings from localStorage right after declaration
    try {
        const saved = localStorage.getItem('birthdaySettings');
        if (saved) {
            window.settings = Object.assign(window.settings, JSON.parse(saved));
        }
    } catch (e) {
        console.warn('Could not load settings from localStorage', e);
    }

    window.settings.pages = [
            { image: './image/Birthday!/cover.jpg', content: '' }, 
            { image: './image/Birthday!/photo1.jpg', content: 'Dear Sharon, you bring so much joy and happiness! 💕' },
            { image: './image/Birthday!/photo2.jpg', content: 'Your smile lights up every room you enter! ✨' },
            { image: './image/Birthday!/photo3.jpg', content: 'You are such an amazing and beautiful person! 🌸' },
            { image: './image/Birthday!/photo4.jpg', content: 'Your kindness and warmth touch hearts! 💖' },
            { image: './image/Birthday!/photo5.jpg', content: 'Wishing you the most wonderful birthday ever! 🎉' },
            { image: './image/Birthday!/photo6.jpg', content: 'May all your dreams come true! ⭐' },
            { image: './image/Birthday!/photo7.jpg', content: 'You deserve all the happiness! 💕' },
            { image: './image/Birthday!/photo8.jpg', content: 'Love you so much! Have the best day! ❤️🎂' },
            { image: './image/Birthday!/9.jpg', content: '' } 
        ];

    pages = window.settings.pages;
}

function applyLoadedSettings() {
    const settings = window.settings;

    const birthdayAudio = document.getElementById('birthdayAudio');
    if (birthdayAudio) {
        birthdayAudio.src = settings.music;
    }

    const giftImageElement = document.getElementById('gift-image');
    if (giftImageElement && settings.gift) {
        giftImageElement.src = settings.gift;
    }

    matrixChars = settings.matrixText.split('');

    if (matrixInterval) {
        clearInterval(matrixInterval);
        matrixInterval = null;
        const matrixCanvas = document.getElementById('matrix-rain');
        if (matrixCanvas) {
            const matrixCtx = matrixCanvas.getContext('2d');
            matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        }
    }
    initMatrixRain();

    createPages();

    S.UI.reset(true);
    const sequence = `|#countdown ${settings.countdown}||${settings.sequence}|#gift|`;
    S.UI.simulate(sequence);

}

settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    populateModal();
});

closeModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    stopMusicPreview();
});

function populateModal() {
    stopMusicPreview();
    const musicSelect = document.getElementById('backgroundMusic');
    musicSelect.innerHTML = musicOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    musicSelect.value = settings.music;
    attachMusicSelectChangeListener();
    setMusicPreviewState({
        message: getIdlePreviewMessage(),
        isPlaying: false
    });

    const countdownSelect = document.getElementById('countdownTime');
    countdownSelect.value = settings.countdown;

    const enableBookSelect = document.getElementById('enableBook');
    enableBookSelect.value = settings.enableBook.toString();

    const enableHeartSelect = document.getElementById('enableHeart');
    enableHeartSelect.value = settings.enableHeart.toString();

    const isSaveCheckbox = document.getElementById('isSave');
    if (isSaveCheckbox) {
        const savedState = window.lastIsSaveState !== undefined ? window.lastIsSaveState : settings.isSave;
        isSaveCheckbox.checked = savedState;
    }

    const giftSelect = document.getElementById('giftImage');
    giftSelect.innerHTML = gifOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    giftSelect.value = settings.gift;

    const matrixTextInput = document.getElementById('matrixText');
    matrixTextInput.value = settings.matrixText;

    const matrixColor1Input = document.getElementById('matrixColor1');
    matrixColor1Input.value = settings.matrixColor1;

    const matrixColor2Input = document.getElementById('matrixColor2');
    matrixColor2Input.value = settings.matrixColor2;

    const sequenceInput = document.getElementById('sequenceText');
    sequenceInput.value = settings.sequence;

    const sequenceColorInput = document.getElementById('sequenceColor');
    sequenceColorInput.value = settings.sequenceColor;

    const currentTheme = settings.colorTheme || detectCurrentColorTheme();

    const colorButtons = document.querySelectorAll('.color-theme-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            handleColorThemeChange(theme);
        });
    });

    handleColorThemeChange(currentTheme);

    addCustomColorListeners();

    const pageConfigs = document.getElementById('pageConfigs');
    if (pageConfigs) pageConfigs.innerHTML = '';

    enableBookSelect.addEventListener('change', function () {
        const bookSettingsSection = document.getElementById('bookSettingsSection');
        const enableHeartSelect = document.getElementById('enableHeart');

        if (this.value === 'true') {
            if (bookSettingsSection) bookSettingsSection.style.display = 'block';

            enableHeartSelect.disabled = false;
        } else {
            if (bookSettingsSection) bookSettingsSection.style.display = 'none';

            enableHeartSelect.value = 'false';
            enableHeartSelect.disabled = true;
        }

        updatePricingFromModal();
    });

    settings.pages.forEach((page, index) => {
        const pageConfig = document.createElement('div');
        pageConfig.className = 'page-config';

        const title = document.createElement('h3');
if (index === 0) {
    title.textContent = t('pageTitleCover', {num: index + 1});
} else {
    title.textContent = t('pageTitle', {num: index + 1});
}
        pageConfig.appendChild(title);

        if (settings.pages.length > 1) {
            const closeBtn = document.createElement('p');
            closeBtn.className = 'page-config-close';
            closeBtn.textContent = '×';
            closeBtn.onclick = () => removePage(index);
            pageConfig.appendChild(closeBtn);
        }

        const fileLabel = document.createElement('label');
        fileLabel.setAttribute('for', `pageImage${index}`);
        fileLabel.textContent = t('imageLabel');
        pageConfig.appendChild(fileLabel);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = `pageImage${index}`;
        fileInput.accept = 'image/*';
        pageConfig.appendChild(fileInput);

        const imagePreview = document.createElement('img');
        imagePreview.id = `imagePreview${index}`;
        imagePreview.style.cssText = `
            max-width: 150px;
            max-height: 150px;
            object-fit: cover;
            border: 1px solid #ddd;
            border-radius: 4px;
            display: block;
            margin-bottom: 10px;
            margin-top: 10px;
        `;

        if (page.image) {
            imagePreview.src = page.image;
            imagePreview.alt = `Ảnh trang ${index + 1}`;
        } else {

            const placeholderText = index === 0 ? t('coverPlaceholder') : t('pagePlaceholder', {num: index + 1});
            imagePreview.style.cssText += `
                display: flex;
                justify-content: center;
                align-items: center;
                width: 150px;
                height: 150px;
                background-color: #f0f0f0;
                font-size: 14px;
                color: #999;
                text-align: center;
            `;
            imagePreview.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2jGsGEgY8OzIOS6o25oPC90ZXh0Pjwvc3ZnPg==';
            imagePreview.alt = t('noImageAlt', {placeholder: placeholderText});
        }

        pageConfig.appendChild(imagePreview);

        if (page.selectedFile) {

            const dt = new DataTransfer();
            dt.items.add(page.selectedFile);
            fileInput.files = dt.files;

            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.alt = `Ảnh mới cho trang ${index + 1}`;
            };
            reader.readAsDataURL(page.selectedFile);
        }

        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {

                    imagePreview.src = e.target.result;
                    imagePreview.style.cssText = `
                        max-width: 150px;
                        max-height: 150px;
                        object-fit: cover;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        display: block;
                        margin-bottom: 10px;
                        margin-top: 10px;
                    `;
                    imagePreview.alt = `Ảnh mới cho trang ${index + 1}`;
                };
                reader.readAsDataURL(file);
            } else {

                if (page.image && !page.selectedFile) {
                    imagePreview.src = page.image;
                    imagePreview.alt = `Ảnh hiện tại trang ${index + 1}`;
                } else {

                    const placeholderText = index === 0 ? t('coverPlaceholder') : t('pagePlaceholder', {num: index + 1});
                    imagePreview.style.cssText += `
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 150px;
                        height: 150px;
                        background-color: #f0f0f0;
                        font-size: 14px;
                        color: #999;
                        text-align: center;
                    `;
                    imagePreview.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2jGsGEgY8OzIOS6o25oPC90ZXh0Pjwvc3ZnPg==';
                    imagePreview.alt = t('noImageAlt', {placeholder: placeholderText});
                }
            }
        });

        if (index >= 2 && index % 2 === 0) {

            const contentTextarea = document.createElement('textarea');
            contentTextarea.id = `pageContent${index}`;
            contentTextarea.placeholder = t('contentPlaceholder', {num: index + 1});
            contentTextarea.rows = 4;
            contentTextarea.value = page.content || '';
            pageConfig.appendChild(contentTextarea);
        }

        if (pageConfigs) pageConfigs.appendChild(pageConfig);
    });

    if (settings.pages.length < 19) {
        const addPageButton = document.createElement('button');
        addPageButton.textContent = t('addNewPage');
        addPageButton.onclick = addNewPage;
        addPageButton.style.cssText = `
                    background: linear-gradient(135deg, #4caf50, #45a049);
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-top: 10px;
                `;
        if (pageConfigs) pageConfigs.appendChild(addPageButton);
    }

    matrixColor1Input.addEventListener('input', () => {
        const matrixColor1Preview = document.getElementById('matrixColor1Preview');
        if (matrixColor1Preview) {
            matrixColor1Preview.style.backgroundColor = matrixColor1Input.value;
        }
    });

    matrixColor2Input.addEventListener('input', () => {
        const matrixColor2Preview = document.getElementById('matrixColor2Preview');
        if (matrixColor2Preview) {
            matrixColor2Preview.style.backgroundColor = matrixColor2Input.value;
        }
    });

    sequenceColorInput.addEventListener('input', () => {
        const sequenceColorPreview = document.getElementById('sequenceColorPreview');
        if (sequenceColorPreview) {
            sequenceColorPreview.style.backgroundColor = sequenceColorInput.value;
        }
    });

    const bookSettingsSection = document.getElementById('bookSettingsSection');
    if (settings.enableBook) {
        bookSettingsSection.style.display = 'block';
    } else {
        bookSettingsSection.style.display = 'none';
    }

    if (window.pricingCalculator) {
        window.pricingCalculator.updateFromSettings(settings);
    }

    const fieldsToWatch = [
        'backgroundMusic',
        'enableBook',
        'enableHeart'
    ];

    fieldsToWatch.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', function () {
                updatePricingFromModal();
            });
        }
    });

    const isSaveField = document.getElementById('isSave');
    if (isSaveField) {
        isSaveField.addEventListener('change', function () {

            window.lastIsSaveState = this.checked;
            updatePricingFromModal();
            updateExpireDateDisplay();
        });
    }

    updatePricingFromModal();
    updateExpireDateDisplay();

    const allInputs = document.querySelectorAll('.modal-content input[type="text"], .modal-content textarea');
    allInputs.forEach(input => {
        input.addEventListener('keydown', function (e) {
            if (e.key === ' ' || e.code === 'Space') {
                e.stopPropagation();
                return true;
            }
        });

        input.addEventListener('input', function (e) {
            e.stopPropagation();
        });
    });
}
function addNewPage() {
    if (settings.pages.length < 20) {

        saveFormDataToSettings();

        settings.pages.push({ image: '', content: '' });

        populateModal();

        updatePricingFromModal();
    }
}

function removePage(index) {
    if (settings.pages.length > 1) {

        saveFormDataToSettings();

        settings.pages.splice(index, 1);

        populateModal();

        updatePricingFromModal();
    }
}

function handleColorThemeChange(selectedTheme) {
    const matrixColor1Input = document.getElementById('matrixColor1');
    const matrixColor2Input = document.getElementById('matrixColor2');
    const sequenceColorInput = document.getElementById('sequenceColor');
    const customColorSection = document.getElementById('customColorSection');
    const sequenceColorSection = document.getElementById('sequenceColorSection');

    settings.colorTheme = selectedTheme;

    const allButtons = document.querySelectorAll('.color-theme-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`[data-theme="${selectedTheme}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    if (selectedTheme === 'custom') {
        customColorSection.style.display = 'flex';
        sequenceColorSection.style.display = 'block';
    } else {
        customColorSection.style.display = 'none';
        sequenceColorSection.style.display = 'none';

        const theme = colorThemes[selectedTheme];
        if (theme && matrixColor1Input && matrixColor2Input && sequenceColorInput) {
            matrixColor1Input.value = theme.matrixColor1;
            matrixColor2Input.value = theme.matrixColor2;
            sequenceColorInput.value = theme.sequenceColor;

            settings.matrixColor1 = theme.matrixColor1;
            settings.matrixColor2 = theme.matrixColor2;
            settings.sequenceColor = theme.sequenceColor;

            matrixColor1Input.dispatchEvent(new Event('input'));
            matrixColor2Input.dispatchEvent(new Event('input'));
            sequenceColorInput.dispatchEvent(new Event('input'));
        }
    }
}

function addCustomColorListeners() {
    const matrixColor1Input = document.getElementById('matrixColor1');
    const matrixColor2Input = document.getElementById('matrixColor2');
    const sequenceColorInput = document.getElementById('sequenceColor');

    if (matrixColor1Input) {
        matrixColor1Input.addEventListener('input', function() {

            if (settings.colorTheme === 'custom') {
                settings.matrixColor1 = this.value;

                const matrixColor1Preview = document.getElementById('matrixColor1Preview');
                if (matrixColor1Preview) {
                    matrixColor1Preview.style.backgroundColor = this.value;
                }
            }
        });
    }

    if (matrixColor2Input) {
        matrixColor2Input.addEventListener('input', function() {
            if (settings.colorTheme === 'custom') {
                settings.matrixColor2 = this.value;

                const matrixColor2Preview = document.getElementById('matrixColor2Preview');
                if (matrixColor2Preview) {
                    matrixColor2Preview.style.backgroundColor = this.value;
                }
            }
        });
    }

    if (sequenceColorInput) {
        sequenceColorInput.addEventListener('input', function() {
            if (settings.colorTheme === 'custom') {
                settings.sequenceColor = this.value;

                const sequenceColorPreview = document.getElementById('sequenceColorPreview');
                if (sequenceColorPreview) {
                    sequenceColorPreview.style.backgroundColor = this.value;
                }
            }
        });
    }
}

function detectCurrentColorTheme() {

    if (settings.colorTheme) {
        return settings.colorTheme;
    }

    const matrixColor1Input = document.getElementById('matrixColor1');
    const matrixColor2Input = document.getElementById('matrixColor2');
    const sequenceColorInput = document.getElementById('sequenceColor');

    if (matrixColor1Input && matrixColor2Input && sequenceColorInput) {
        const currentMatrix1 = matrixColor1Input.value;
        const currentMatrix2 = matrixColor2Input.value;
        const currentSequence = sequenceColorInput.value;

        for (const [themeKey, theme] of Object.entries(colorThemes)) {
            if (theme.matrixColor1 === currentMatrix1 && 
                theme.matrixColor2 === currentMatrix2 && 
                theme.sequenceColor === currentSequence) {
                return themeKey;
            }
        }
    }

    return 'pink';
}
function saveFormDataToSettings() {
    try {

        const musicSelect = document.getElementById('backgroundMusic');
        if (musicSelect) settings.music = musicSelect.value;

        const countdownSelect = document.getElementById('countdownTime');
        if (countdownSelect) settings.countdown = parseInt(countdownSelect.value) || 3;

        const enableBookSelect = document.getElementById('enableBook');
        if (enableBookSelect) settings.enableBook = enableBookSelect.value === 'true';

        const enableHeartSelect = document.getElementById('enableHeart');
        if (enableHeartSelect) settings.enableHeart = enableHeartSelect.value === 'true';

        const isSaveCheckbox = document.getElementById('isSave');
        if (isSaveCheckbox) settings.isSave = isSaveCheckbox.checked;

        const giftSelect = document.getElementById('giftImage');
        if (giftSelect) settings.gift = giftSelect.value;

        const matrixTextInput = document.getElementById('matrixText');
        if (matrixTextInput) settings.matrixText = matrixTextInput.value;

        const matrixColor1Input = document.getElementById('matrixColor1');
        if (matrixColor1Input) settings.matrixColor1 = matrixColor1Input.value;

        const matrixColor2Input = document.getElementById('matrixColor2');
        if (matrixColor2Input) settings.matrixColor2 = matrixColor2Input.value;

        const sequenceInput = document.getElementById('sequenceText');
        if (sequenceInput) settings.sequence = sequenceInput.value;

        const sequenceColorInput = document.getElementById('sequenceColor');
        if (sequenceColorInput) settings.sequenceColor = sequenceColorInput.value;

        const activeButton = document.querySelector('.color-theme-btn.active');
        if (activeButton) {
            settings.colorTheme = activeButton.getAttribute('data-theme');
        }

        settings.pages.forEach((page, index) => {
            const fileInput = document.getElementById(`pageImage${index}`);
            const contentInput = document.getElementById(`pageContent${index}`);

            if (fileInput && fileInput.files.length > 0) {
                const newImageURL = URL.createObjectURL(fileInput.files[0]);
                settings.pages[index].image = newImageURL;
                settings.pages[index].selectedFile = fileInput.files[0];
            }

            if (contentInput) {
                settings.pages[index].content = contentInput.value;
            }
        });

    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

function updatePricingFromModal() {
    if (window.pricingCalculator) {
        const currentModalSettings = {
            music: document.getElementById('backgroundMusic')?.value || './music/happybirtday_uia.mp3',
            enableBook: document.getElementById('enableBook')?.value === 'true',
            enableHeart: document.getElementById('enableHeart')?.value === 'true',
            isSave: document.getElementById('isSave')?.checked || false,
            pages: settings.pages || []
        };

        window.pricingCalculator.updateFromSettings(currentModalSettings);
    }
}

function updateExpireDateDisplay() {
    const isSaveCheckbox = document.getElementById('isSave');
    const expireDateElement = document.getElementById('expireDate');
    const expireContainer = expireDateElement?.parentElement;

    if (isSaveCheckbox && expireDateElement && expireContainer) {
        if (isSaveCheckbox.checked) {
            expireDateElement.textContent = t('saveForever');
            expireDateElement.style.color = '#4caf50'; 
            expireContainer.innerHTML = `⏳ ${t('expireText')} <b id="expireDate" style="color: #4caf50;">${t('saveForever')}</b>`;
        } else {
            expireDateElement.textContent = t('thirtyDays');
            expireDateElement.style.color = ''; 
            expireContainer.innerHTML = `⏳ ${t('expireText')} <b id="expireDate">${t('thirtyDays')}</b>`;
        }
    }
}
function createPages() {

    book.innerHTML = '';
    const totalLogicalPages = pages.length;
    const totalPhysicalPages = Math.ceil(totalLogicalPages / 2);

    for (let physicalPageIndex = 0; physicalPageIndex < totalPhysicalPages; physicalPageIndex++) {
        const page = document.createElement('div');
        page.classList.add('page');
        page.dataset.page = physicalPageIndex;

        const frontLogicalIndex = physicalPageIndex * 2;
        const backLogicalIndex = frontLogicalIndex + 1;

        const front = document.createElement('div');
        front.classList.add('page-front');

        if (frontLogicalIndex < pages.length && pages[frontLogicalIndex]) {
            const frontPageData = pages[frontLogicalIndex];

            if (frontPageData.image) {
                const frontImg = document.createElement('img');
                frontImg.src = frontPageData.image;
                frontImg.onerror = function () {
                    const placeholderText = frontLogicalIndex === 0 ? 'Bìa Sách' : `Trang ${frontLogicalIndex + 1}`;
                    this.src = createPlaceholderImage(placeholderText);
                };
                front.appendChild(frontImg);

                if (frontPageData.content) {
                    const textDiv = document.createElement('div');
                    textDiv.classList.add('page-text');
                    textDiv.textContent = frontPageData.content;
                    front.appendChild(textDiv);
                }
            } else if (frontPageData.content) {

                front.classList.add('text-page');
                const textDiv = document.createElement('div');
                textDiv.classList.add('page-text');
                textDiv.textContent = frontPageData.content;
                front.appendChild(textDiv);
            } else {
                front.classList.add('empty-page');
               front.textContent = t('emptyPage');
            }
        } else {
            front.classList.add('empty-page');
           front.textContent = t('emptyPage');
        }

        const back = document.createElement('div');
        back.classList.add('page-back');

        if (backLogicalIndex < pages.length && pages[backLogicalIndex]) {
            const backPageData = pages[backLogicalIndex];

            if (backPageData.image) {
                const backImg = document.createElement('img');
                backImg.src = backPageData.image;
                backImg.onerror = function () {
                    const placeholderText = `Trang ${backLogicalIndex + 1}`;
                    this.src = createPlaceholderImage(placeholderText);
                };
                back.appendChild(backImg);

                if (backPageData.content) {
                    const textDiv = document.createElement('div');
                    textDiv.classList.add('page-text');
                    textDiv.textContent = backPageData.content;
                    back.appendChild(textDiv);
                }
            } else if (backPageData.content) {

                back.classList.add('text-page');
                const textDiv = document.createElement('div');
                textDiv.classList.add('page-text');
                textDiv.textContent = backPageData.content;
                back.appendChild(textDiv);
            } else {
                back.classList.add('empty-page');
                back.textContent = t('emptyPage');
            }
        } else {
            const endImg = document.createElement('img');
            endImg.src = './image/theend.jpg';
            endImg.onerror = function () {
                back.classList.add('empty-page');
               back.textContent = t('endOfBook');
            };
            back.appendChild(endImg);
        }

        page.appendChild(front);
        page.appendChild(back);
        book.appendChild(page);

        page.addEventListener('click', (e) => {
            if (!isFlipping) {
                const rect = page.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pageWidth = rect.width;
                if (clickX < pageWidth / 2 && page.classList.contains('flipped')) {
                    prevPage();
                } else if (clickX >= pageWidth / 2 && !page.classList.contains('flipped')) {
                    nextPage();
                }
            }
        });
    }

    photoUrls = pages.filter(page => page.image).map(page => page.image);

    if (typeof calculatePageZIndexes === 'function') {
        calculatePageZIndexes();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const book = document.getElementById('book');
    const bookContainer = document.querySelector('.book-container');
    if (book) {
        book.style.display = 'none';
        book.classList.remove('show');
    }
    if (bookContainer) {
        bookContainer.style.display = 'none';
        bookContainer.classList.remove('show');
    }

    createPages();
    initializeDefaultSettings();
    applyLoadedSettings();
    window.isWebsiteReady = true;
});

applySettingsButton.addEventListener('click', () => {

    const enableBookSelect = document.getElementById('enableBook');
    const isBookEnabled = enableBookSelect ? enableBookSelect.value === 'true' : false;

    if (isBookEnabled) {
        if (settings.pages.length === 0) {
            alert('❌ Sách cần có trang!\n\nVui lòng thêm ít nhất 1 trang cho sách hoặc tắt tính năng sách.');
            return;
        }
    }


    settings.music = document.getElementById('backgroundMusic')?.value || settings.music;
    settings.countdown = parseInt(document.getElementById('countdownTime')?.value) || settings.countdown || 3;
    settings.matrixText = document.getElementById('matrixText')?.value || settings.matrixText || 'HAPPYBIRTHDAY';
    settings.matrixColor1 = document.getElementById('matrixColor1')?.value || settings.matrixColor1;
    settings.matrixColor2 = document.getElementById('matrixColor2')?.value || settings.matrixColor2;
    settings.sequence = document.getElementById('sequenceText')?.value || settings.sequence || 'HAPPY|BIRTHDAY|TO|YOU|SHARON|❤';
    settings.sequenceColor = document.getElementById('sequenceColor')?.value || settings.sequenceColor;
    settings.gift = document.getElementById('giftImage')?.value || settings.gift;

    const activeButton = document.querySelector('.color-theme-btn.active');
    if (activeButton) {
        settings.colorTheme = activeButton.getAttribute('data-theme');
    }

    const enableBookInput = document.getElementById('enableBook');
    settings.enableBook = enableBookInput ? enableBookInput.value === 'true' : settings.enableBook;
    
    const enableHeartInput = document.getElementById('enableHeart');
    settings.enableHeart = enableHeartInput ? enableHeartInput.value === 'true' : settings.enableHeart;
    
    settings.isSave = document.getElementById('isSave')?.checked || false;

    window.lastIsSaveState = settings.isSave;

    const newPages = [];
    settings.pages.forEach((page, index) => {
        const fileInput = document.getElementById(`pageImage${index}`);
        const contentInput = document.getElementById(`pageContent${index}`);

        const newPage = {};
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            newPage.image = URL.createObjectURL(fileInput.files[0]);
        } else {
            newPage.image = page.image;
        }
        if (contentInput) {
            newPage.content = contentInput.value;
        } else {
            newPage.content = page.content || '';
        }
        newPages.push(newPage);
    });
    settings.pages = newPages;

    if (window.pricingCalculator) {
        window.pricingCalculator.updateFromSettings(settings);
    }

    window.settings = settings;
    try {
        localStorage.setItem('birthdaySettings', JSON.stringify(settings));
    } catch (e) {
        console.warn('Could not save settings to localStorage', e);
    }

    resetWebsiteState();

    stopMusicPreview();

    settingsModal.style.display = 'none';

    if (typeof startWebsite === 'function') {
        tryStartWebsiteWhenLandscape();;
    }
});

function isAndroid() {
    return /android/i.test(navigator.userAgent);
}
const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn.style.zIndex = 9009999;

function updateFullscreenBtnVisibility() {
    if (
        fullscreenBtn &&
        isAndroid() &&
        !document.fullscreenElement 
    ) {
        fullscreenBtn.style.display = 'block';

        if (fullscreenBtn.hideTimeout) clearTimeout(fullscreenBtn.hideTimeout);
        fullscreenBtn.hideTimeout = setTimeout(() => {
            fullscreenBtn.style.display = 'none';
        }, 2500);
    } else if (fullscreenBtn) {
        fullscreenBtn.style.display = 'none';
        if (fullscreenBtn.hideTimeout) clearTimeout(fullscreenBtn.hideTimeout);
    }
}

updateFullscreenBtnVisibility();

fullscreenBtn.onclick = function () {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            elem.requestFullscreen();
        }
    } else {
        alert(t('fullscreenNotSupported'));
    }

    fullscreenBtn.style.display = 'none';
    if (fullscreenBtn.hideTimeout) clearTimeout(fullscreenBtn.hideTimeout);
};

document.addEventListener('fullscreenchange', function () {
    updateFullscreenBtnVisibility();
});
function isLandscapeMode() {
    return window.innerWidth > window.innerHeight;
}

function tryStartWebsiteWhenLandscape() {
    if (window.isWebsiteReady && typeof startWebsite === 'function') {
        if (isLandscapeMode()) {
            startWebsite();
        } else {

            window.addEventListener('resize', function onResize() {
                if (isLandscapeMode()) {
                    startWebsite();
                    window.removeEventListener('resize', onResize);
                }
            });
        }
    }
}
