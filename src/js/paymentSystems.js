function detectPaymentSystem(cardNumber) {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    // Visa: начинается с 4, длина 13, 16 или 19
    if (/^4/.test(cleanNumber) && [13, 16, 19].includes(cleanNumber.length)) {
        return 'visa';
    }
    
    // MasterCard: начинается с 51-55 или 2221-2720, длина 16
    if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(cleanNumber) && cleanNumber.length === 16) {
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
    
    return null;
}

function getPaymentSystemName(systemCode) {
    const names = {
        'visa': 'Visa',
        'mastercard': 'Mastercard',
        'mir': 'МИР',
        'amex': 'American Express',
        'discover': 'Discover'
    };
    return names[systemCode] || 'Неизвестная система';
}

function formatCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\D/g, '');
  
  const chunks = [];
  for (let i = 0; i < digits.length; i += 4) {
    chunks.push(digits.substring(i, i + 4));
  }
  
  return chunks.join(' ');
}

module.exports = { 
    detectPaymentSystem, 
    getPaymentSystemName, 
    formatCardNumber 
};