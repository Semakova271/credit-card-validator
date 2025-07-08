document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, что все необходимые элементы существуют
    if (document.getElementById('cardNumber') && 
        document.getElementById('validateBtn') && 
        document.getElementById('result')) {
        initWidget();
    } else {
        console.error('Не удалось найти необходимые элементы для инициализации виджета');
    }
});