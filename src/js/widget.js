import {
  detectPaymentSystem,
  getPaymentSystemName,
  formatCardNumber
} from './paymentSystems.js';
import { validateCardNumber } from './validator.js';

// Импортируем изображения
import visaImg from '../img/visa.png';
import mastercardImg from '../img/mastercard.png';
import mirImg from '../img/mir.png';
import amexImg from '../img/amex.png';

export function initWidget () {
  const cardInput = document.getElementById('cardNumber');
  const validateBtn = document.getElementById('validateBtn');
  const resultDiv = document.getElementById('result');
  const cardHeader = document.getElementById('card-header');

  const paymentSystemImages = {
    visa: visaImg,
    mastercard: mastercardImg,
    mir: mirImg,
    amex: amexImg
  };

  function updatePaymentSystem (paymentSystem) {
    cardHeader.innerHTML = '';

    if (paymentSystem && paymentSystemImages[paymentSystem]) {
      const img = document.createElement('img');
      img.src = paymentSystemImages[paymentSystem];
      img.alt = getPaymentSystemName(paymentSystem);
      img.style.maxHeight = '40px';
      cardHeader.appendChild(img);
    } else if (paymentSystem) {
      cardHeader.textContent = getPaymentSystemName(paymentSystem);
    }
  }

  function showResult (isValid, paymentSystem) {
    const resultIcon = resultDiv.querySelector('.result-icon');
    const resultText = resultDiv.querySelector('.result-text');
    const resultDetails = resultDiv.querySelector('.result-details');

    resultDiv.className = 'result';

    if (isValid) {
      resultDiv.classList.add('valid');
      resultIcon.innerHTML = '✓';
      resultText.textContent = 'Карта действительна!';
      resultDetails.textContent = `Платежная система: ${getPaymentSystemName(paymentSystem)}`;
    } else {
      resultDiv.classList.add('invalid');
      resultIcon.innerHTML = '✗';
      resultText.textContent = 'Номер карты недействителен';
      resultDetails.textContent = paymentSystem
        ? `Определена система: ${getPaymentSystemName(paymentSystem)}`
        : 'Платежная система не определена';
    }
  }

  cardInput.addEventListener('input', function () {
    this.value = formatCardNumber(this.value);
    const paymentSystem = detectPaymentSystem(this.value);
    updatePaymentSystem(paymentSystem);

    resultDiv.classList.remove('show');
  });

  validateBtn.addEventListener('click', function () {
    const cardNumber = cardInput.value.replace(/\D/g, '');

    if (!cardNumber) {
      showResult(false, null);
      return;
    }

    const paymentSystem = detectPaymentSystem(cardNumber);
    const isValid = validateCardNumber(cardNumber);
    showResult(isValid, paymentSystem);
    resultDiv.classList.add('show');
  });

  // Инициализация тестовой картой
  const testCard = '4111111111111111';
  cardInput.value = formatCardNumber(testCard);
  const paymentSystem = detectPaymentSystem(testCard);
  updatePaymentSystem(paymentSystem);
}
