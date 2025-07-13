// Быстрая функция определения платежной системы по первым цифрам
export function detectPaymentSystemByPrefix(cardNumber) {
  const cleanNumber = cardNumber.replace(/\D/g, '');

  // Минимальная длина для определения - 2 цифры
  if (cleanNumber.length < 2) return null;

  const firstTwo = cleanNumber.substring(0, 2);
  const firstOne = cleanNumber.substring(0, 1);
  const firstFour = cleanNumber.substring(0, 4);

  // Visa: начинается с 4
  if (firstOne === '4') return 'visa';

  // MasterCard: 51-55 или 2221-2720
  if (/^(5[1-5])|(22)|(27)/.test(firstTwo)) {
    if (firstFour) {
      const prefix = parseInt(firstFour, 10);
      if (prefix >= 2221 && prefix <= 2720) return 'mastercard';
    }
    return 'mastercard';
  }

  // МИР: начинается с 2
  if (firstOne === '2') return 'mir';

  // American Express: 34 или 37
  if (['34', '37'].includes(firstTwo)) return 'amex';

  // Discover: 6011, 644-649, 65
  if (firstTwo === '65') return 'discover';
  if (firstFour === '6011') return 'discover';
  if (firstTwo === '64' && cleanNumber.length >= 3) {
    const thirdDigit = cleanNumber.charAt(2);
    if (thirdDigit >= '4' && thirdDigit <= '9') return 'discover';
  }

  // JCB: 35
  if (firstTwo === '35') return 'jcb';

  return null;
}

// Оригинальная функция для полной проверки (оставляем как есть)
export function detectPaymentSystem(cardNumber) {
  const cleanNumber = cardNumber.replace(/\D/g, '');

  // Visa: начинается с 4, длина 13, 16 или 19
  if (/^4/.test(cleanNumber) && [13, 16, 19].includes(cleanNumber.length)) {
    return 'visa';
  }

  // MasterCard: начинается с 51-55 или 2221-2720, длина 16
  if (
    /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(cleanNumber) &&
    cleanNumber.length === 16
  ) {
    return 'mastercard';
  }

  // МИР: начинается с 2, длина 16
  if (/^2/.test(cleanNumber) && cleanNumber.length === 16) {
    return 'mir';
  }

  // American Express: начинается с 34 или 37, длина 15
  if (/^3[47]/.test(cleanNumber) && cleanNumber.length === 15) {
    return 'amex';
  }

  // Discover: начинается с 6011, 644-649 или 65, длина 16
  if (/^(6011|64[4-9]|65)/.test(cleanNumber) && cleanNumber.length === 16) {
    return 'discover';
  }

  // JCB: начинается с 35, длина 16
  if (/^35/.test(cleanNumber) && cleanNumber.length === 16) {
    return 'jcb';
  }

  return null;
}

export function getPaymentSystemName(systemCode) {
  const names = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    mir: 'МИР',
    amex: 'American Express',
    discover: 'Discover',
    jcb: 'JCB',
  };
  return names[systemCode] || 'Неизвестная система';
}

export function formatCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '');
  const chunks = [];

  for (let i = 0; i < digits.length; i += 4) {
    chunks.push(digits.substring(i, i + 4));
  }

  return chunks.join(' ');
}

export function validateCardNumber(cardNumber) {
  const cleanNumber = cardNumber.replace(/\D/g, '');

  // Проверка длины номера карты
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  // Реализация алгоритма Луна
  let sum = 0;
  let shouldDouble = false;

  // Проходим по цифрам справа налево
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
