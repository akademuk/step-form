const apiUrl = 'https://www.mocky.io/v2/5dfcef48310000ee0ed2c281';
let currentSlide = 1;

// Оголошення об'єкту, що містить посилання на елементи сторінки
const elements = {
    slider: document.querySelector('.slides'), // Слайдер
    dots: document.querySelectorAll('.dot'), // Точки
    submitButton: document.querySelector('.submit-form'), // Кнопка "Відправити"
    nextButton: document.querySelector('.btn-next') // Кнопка "Наступний"
};

// Оновлення вигляду слайдера
const updateSliderView = () => {
    elements.slider.style.transform = `translateX(-${(currentSlide - 1) * 100}%)`;

    elements.dots.forEach((dot, index) => {
        const isActive = index + 1 === currentSlide;
        dot.classList.toggle('active', isActive);
    });

    const isLastSlide = currentSlide === 5;
    elements.submitButton.style.display = isLastSlide ? 'flex' : 'none';
    elements.nextButton.style.display = isLastSlide ? 'none' : 'flex';
};

// Валідація поля
const validateField = (fieldName, errorMessage) => {
    const fieldValue = document.getElementById(fieldName).value.trim();
    if (!fieldValue) {
        alert(errorMessage);
        return false;
    }
    return true;
};

// Валідація електронної пошти
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Валідація паролю
const validatePassword = (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);

// Валідація обов'язкових полів на поточному слайді
const validateRequiredFields = () => {
    const currentSlideElement = document.querySelector(`.slide[data-slide="${currentSlide}"]`);
    const requiredInputs = currentSlideElement.querySelectorAll('[required]');

    for (const input of requiredInputs) {
        if (!input.value.trim()) {
            alert(`Будь ласка, заповніть поле`);
            return false;
        }
    }
    return true;
};

// Перехід до наступного слайду
const nextSlide = () => {
    const isRequiredFieldsValid = validateRequiredFields();

    if (!isRequiredFieldsValid) {
        return;
    }

    if (currentSlide === 1 && !document.getElementById('whoAreYou').value) {
        alert('Будь ласка, оберіть професію.');
        return;
    }
    if (currentSlide === 2 && !document.getElementById('age').value) {
        alert('Будь ласка, оберіть вік.');
        return;
    }

    if (currentSlide === 4) {
        const email = document.getElementById('email').value;
        if (!validateEmail(email)) {
            alert('Будь ласка, введіть правильну адресу електронної пошти.');
            return;
        }
    }

    currentSlide = Math.min(currentSlide + 1, 5);
    updateSliderView();
};

// Перехід до попереднього слайду
const prevSlide = () => {
    currentSlide = Math.max(currentSlide - 1, 1);
    updateSliderView();
};

// Відправка даних форми на мок-сервер
const sendRequestToMockServer = (formData) => {
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error') {
                alert('Помилка при відправленні форми.');
            } else {
                alert('Форму успішно відправлено!');
            }
        })
        .catch(error => {
            console.error('Помилка при відправці форми на мок-сервер', error);
            alert('Помилка при відправленні форми.');
        });
};

// Обробник події для відправки форми
document.getElementById('stepForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const password = document.getElementById('password').value;

    if (validatePassword(password)) {
        const formData = {
            age: document.getElementById('age').value,
            email: document.getElementById('email').value,
            password: password,
            location: document.getElementById('location').value
        };

        console.log('Відправка даних форми на мок-сервер:', formData);

        sendRequestToMockServer(formData);
    } else {
        alert('Будь ласка, введіть правильний пароль.');
    }
});

// Оновлення вигляду слайдера при завантаженні сторінки
window.addEventListener('load', () => updateSliderView());
