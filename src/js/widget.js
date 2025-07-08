function initWidget() {
    const cardInput = document.getElementById('cardNumber');
    const validateBtn = document.getElementById('validateBtn');
    const resultDiv = document.getElementById('result');
    const paymentSystems = document.querySelectorAll('.payment-system');
    const testCards = document.querySelectorAll('.card-example');
    
    // Обновление отображения платежных систем
    function updatePaymentSystems(paymentSystem) {
        paymentSystems.forEach(system => {
            system.classList.remove('active');
            if (system.dataset.type === paymentSystem) {
                system.classList.add('active');
            }
        });
    }
    
    // Отображение результата проверки
    function showResult(isValid, paymentSystem) {
        const resultIcon = resultDiv.querySelector('.result-icon');
        const resultText = resultDiv.querySelector('.result-text');
        const resultDetails = resultDiv.querySelector('.result-details');
        
        resultDiv.className = 'result';
        
        if (isValid) {
            resultDiv.classList.add('valid');
            resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            resultText.textContent = 'Карта действительна!';
            resultDetails.textContent = `Платежная система: ${getPaymentSystemName(paymentSystem)}`;
        } else {
            resultDiv.classList.add('invalid');
            resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            resultText.textContent = 'Номер карты недействителен';
            
            if (paymentSystem) {
                resultDetails.textContent = `Определена система: ${getPaymentSystemName(paymentSystem)}`;
            } else {
                resultDetails.textContent = 'Платежная система не определена';
            }
        }
        
        setTimeout(() => {
            resultDiv.classList.add('show');
        }, 10);
    }
    
    // Обработка ввода номера карты
    cardInput.addEventListener('input', function() {
        this.value = formatCardNumber(this.value);
        
        const paymentSystem = detectPaymentSystem(this.value);
        updatePaymentSystems(paymentSystem);
        
        resultDiv.classList.remove('show');
    });
    
    // Обработка кнопки проверки
    validateBtn.addEventListener('click', function() {
        const cardNumber = cardInput.value.replace(/\D/g, '');
        
        if (!cardNumber) {
            showResult(false, null);
            return;
        }
        
        const paymentSystem = detectPaymentSystem(cardNumber);
        const isValid = validateCardNumber(cardNumber);
        
        showResult(isValid, paymentSystem);
    });
    
    // Обработка тестовых карт
    testCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardNumber = card.dataset.card;
            cardInput.value = formatCardNumber(cardNumber);
            
            // Имитируем событие ввода
            const event = new Event('input', { bubbles: true });
            cardInput.dispatchEvent(event);
            
            // Выполняем валидацию
            setTimeout(() => {
                validateBtn.click();
            }, 300);
        });
    });
    
    // Автоматическое определение платежной системы при загрузке
    const initialCardNumber = cardInput.value.replace(/\D/g, '');
    const initialPaymentSystem = detectPaymentSystem(initialCardNumber);
    updatePaymentSystems(initialPaymentSystem);
    
    // Автоматическая валидация при загрузке
    setTimeout(() => {
        validateBtn.click();
    }, 500);
}