import {
  detectPaymentSystem,
  getPaymentSystemName,
  formatCardNumber
} from './paymentSystems.js';
import { validateCardNumber } from './validator.js';

import visaImg from '../img/visa.png';
import mastercardImg from '../img/mastercard.png';
import mirImg from '../img/mir.png';
import amexImg from '../img/amex.png';
import discoverImg from '../img/discover.png';

export function initWidget () {
  const cardInput = document.getElementById('cardNumber');
  const validateBtn = document.getElementById('validateBtn');
  const resultDiv = document.getElementById('result');
  const cardHeader = document.getElementById('card-header');
  const resultText = resultDiv.querySelector('.result-text');

  const paymentSystemImages = {
    visa: visaImg,
    mastercard: mastercardImg,
    mir: mirImg,
    amex: amexImg,
    discover: discoverImg
  };

  function updatePaymentSystem (paymentSystem) {
    cardHeader.innerHTML = '';

    if (paymentSystem && paymentSystemImages[paymentSystem]) {
      const img = document.createElement('img');
      img.src = paymentSystemImages[paymentSystem];
      img.alt = getPaymentSystemName(paymentSystem);
      cardHeader.appendChild(img);
    } else if (paymentSystem) {
      const text = document.createElement('div');
      text.textContent = getPaymentSystemName(paymentSystem);
      cardHeader.appendChild(text);
    }
  }

  function showResult (isValid) {
    resultDiv.className = 'result';

    if (isValid) {
      resultDiv.classList.add('valid');
      resultText.textContent = 'Карта действительна!';
    } else {
      resultDiv.classList.add('invalid');
      resultText.textContent = 'Карта недействительна';
    }
  }

  // Автоформатирование номера карты
  cardInput.addEventListener('input', function () {
    this.value = formatCardNumber(this.value);
    const paymentSystem = detectPaymentSystem(this.value);
    updatePaymentSystem(paymentSystem);

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

  // Инициализация тестовой картой
  const testCard = '4111111111111111';
  cardInput.value = formatCardNumber(testCard);
  const paymentSystem = detectPaymentSystem(testCard);
  updatePaymentSystem(paymentSystem);
}
