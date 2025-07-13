import {
  detectPaymentSystemByPrefix, // Используем быструю функцию
  formatCardNumber,
  validateCardNumber,
} from './paymentSystems.js';

import visaImg from '../img/visa.png';
import mastercardImg from '../img/mastercard.png';
import mirImg from '../img/mir.png';
import amexImg from '../img/amex.png';
import discoverImg from '../img/discover.png';
import jcbImg from '../img/jcb.png';

export function initWidget() {
  const cardInput = document.getElementById('cardNumber');
  const validateBtn = document.getElementById('validateBtn');
  const resultDiv = document.getElementById('result');
  const resultText = document.getElementById('resultText');
  const cardHeader = document.getElementById('card-header');

  // Проверяем, что все необходимые элементы существуют
  if (!cardInput || !validateBtn || !resultDiv || !resultText || !cardHeader) {
    console.error('Не удалось найти необходимые элементы для инициализации виджета');
    return;
  }

  // Создаем и добавляем логотипы платежных систем
  const paymentSystems = [
    { id: 'visa', name: 'Visa', img: visaImg },
    { id: 'mastercard', name: 'Mastercard', img: mastercardImg },
    { id: 'mir', name: 'МИР', img: mirImg },
    { id: 'amex', name: 'American Express', img: amexImg },
    { id: 'discover', name: 'Discover', img: discoverImg },
    { id: 'jcb', name: 'JCB', img: jcbImg },
  ];

  paymentSystems.forEach((system) => {
    const img = document.createElement('img');
    img.src = system.img;
    img.alt = system.name;
    img.dataset.system = system.id;
    cardHeader.appendChild(img);
  });

  const paymentLogos = document.querySelectorAll('#card-header img');

  // Функция обновления подсветки платежных систем
  function updatePaymentSystem(paymentSystem) {
    // Сбрасываем все логотипы в серый цвет
    paymentLogos.forEach((logo) => {
      logo.classList.remove('active');
    });

    // Подсвечиваем активную систему
    if (paymentSystem) {
      const activeLogo = document.querySelector(`#card-header img[data-system="${paymentSystem}"]`);
      if (activeLogo) {
        activeLogo.classList.add('active');
      }
    }
  }

  // Функция показа результата
  function showResult(isValid) {
    // Очищаем классы
    resultDiv.className = 'result';
    resultDiv.classList.add('show');

    if (isValid) {
      resultDiv.classList.add('valid');
      resultText.textContent = 'Карта действительна!';
    } else {
      resultDiv.classList.add('invalid');
      resultText.textContent = 'Карта недействительна';
    }
  }

  // Обработка ввода номера карты
  cardInput.addEventListener('input', function () {
    this.value = formatCardNumber(this.value);
    const cleanNumber = this.value.replace(/\D/g, '');

    // Быстрое определение системы по первым цифрам
    if (cleanNumber.length >= 2) {
      const paymentSystem = detectPaymentSystemByPrefix(cleanNumber);
      updatePaymentSystem(paymentSystem);
    } else {
      // Сбрасываем подсветку при очистке поля
      paymentLogos.forEach((logo) => logo.classList.remove('active'));
    }

    // Скрываем предыдущий результат
    resultDiv.className = 'result';
  });

  // Обработка кнопки проверки
  validateBtn.addEventListener('click', function () {
    const cardNumber = cardInput.value.replace(/\D/g, '');

    if (!cardNumber) {
      showResult(false);
      return;
    }

    const isValid = validateCardNumber(cardNumber);
    showResult(isValid);
  });

  // Инициализация при загрузке
  const testCard = '4111111111111111';
  cardInput.value = formatCardNumber(testCard);

  // Автоматическая подсветка Visa при загрузке
  updatePaymentSystem('visa');
}
