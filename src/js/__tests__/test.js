const { validateCardNumber } = require('../validator');
const { 
    detectPaymentSystem, 
    getPaymentSystemName, 
    formatCardNumber 
} = require('../paymentSystems');

// Тесты для функции validateCardNumber
describe('validateCardNumber', () => {
    test('должен возвращать true для валидных номеров карт', () => {
        const validCards = [
            '4111111111111111', // Visa
            '5500000000000004', // Mastercard
            '2200000000000004', // МИР
            '340000000000009',  // American Express
            '6011000990139424'  // Discover
        ];

        validCards.forEach(card => {
            expect(validateCardNumber(card)).toBe(true);
        });
    });

    test('должен возвращать false для невалидных номеров карт', () => {
        const invalidCards = [
    '4111111111111112', // Изменена последняя цифра
    '5500000000000005', // Изменена последняя цифра
    '2200000000000005', // Изменена последняя цифра
    '1234567812345678', // Случайный номер
    '0000000000000001'  // Невалидный номер
];

        invalidCards.forEach(card => {
            expect(validateCardNumber(card)).toBe(false);
        });
    });

    test('должен возвращать false для номеров неправильной длины', () => {
        const invalidLengthCards = [
            '41111111111111',   // 14 цифр
            '55000000000000044',// 17 цифр
            '2200',             // 4 цифры
            '34000000000000912' // 17 цифр
        ];

        invalidLengthCards.forEach(card => {
            expect(validateCardNumber(card)).toBe(false);
        });
    });

    test('должен корректно обрабатывать номера с нецифровыми символами', () => {
        expect(validateCardNumber('4111-1111-1111-1111')).toBe(true);
        expect(validateCardNumber('5500 0000 0000 0004')).toBe(true);
        expect(validateCardNumber('2200-0000-0000-0004')).toBe(true);
        expect(validateCardNumber('3400-000000-00009')).toBe(true);
    });
});

// Тесты для функции detectPaymentSystem
describe('detectPaymentSystem', () => {
    test('должен корректно определять платежные системы', () => {
        const testCases = [
            { number: '4111111111111111', expected: 'visa' },
            { number: '4012888888881881', expected: 'visa' },
            { number: '4222222222222', expected: 'visa' }, // 13 цифр
            { number: '5500000000000004', expected: 'mastercard' },
            { number: '5555555555554444', expected: 'mastercard' },
            { number: '2223000048400011', expected: 'mastercard' }, // 2221-2720
            { number: '2720999999999999', expected: 'mastercard' }, // 2221-2720
            { number: '2200000000000004', expected: 'mir' },
            { number: '2201382000000013', expected: 'mir' },
            { number: '340000000000009', expected: 'amex' },
            { number: '370000000000002', expected: 'amex' },
            { number: '6011000990139424', expected: 'discover' },
            { number: '6500000000000004', expected: 'discover' },
            { number: '1234567812345678', expected: null }, // Неизвестная система
            { number: '9999999999999999', expected: null }  // Неизвестная система
        ];

        testCases.forEach(({ number, expected }) => {
            expect(detectPaymentSystem(number)).toBe(expected);
        });
    });

    test('должен игнорировать нецифровые символы', () => {
        expect(detectPaymentSystem('4111 1111 1111 1111')).toBe('visa');
        expect(detectPaymentSystem('5500-0000-0000-0004')).toBe('mastercard');
        expect(detectPaymentSystem('2200 0000 0000 0004')).toBe('mir');
        expect(detectPaymentSystem('3400-000000-00009')).toBe('amex');
    });

    test('должен возвращать null для коротких номеров', () => {
        expect(detectPaymentSystem('4')).toBe(null);
        expect(detectPaymentSystem('22')).toBe(null);
        expect(detectPaymentSystem('37')).toBe(null);
    });
});

// Тесты для функции getPaymentSystemName
describe('getPaymentSystemName', () => {
    test('должен возвращать правильные имена платежных систем', () => {
        const testCases = [
            { code: 'visa', expected: 'Visa' },
            { code: 'mastercard', expected: 'Mastercard' },
            { code: 'mir', expected: 'МИР' },
            { code: 'amex', expected: 'American Express' },
            { code: 'discover', expected: 'Discover' },
            { code: 'unknown', expected: 'Неизвестная система' },
            { code: null, expected: 'Неизвестная система' }
        ];

        testCases.forEach(({ code, expected }) => {
            expect(getPaymentSystemName(code)).toBe(expected);
        });
    });
});

// Тесты для функции formatCardNumber
describe('formatCardNumber', () => {
    test('должен правильно форматировать номера карт', () => {
        const testCases = [
            { number: '4111111111111111', expected: '4111 1111 1111 1111' },
            { number: '5500000000000004', expected: '5500 0000 0000 0004' },
            { number: '2200000000000004', expected: '2200 0000 0000 0004' },
            { number: '340000000000009', expected: '3400 0000 0000 009' },
            { number: '4111 1111 1111 1111', expected: '4111 1111 1111 1111' },
            { number: '5500-0000-0000-0004', expected: '5500 0000 0000 0004' },
            { number: '1234', expected: '1234' },
            { number: '12345678', expected: '1234 5678' },
            { number: '123456789012', expected: '1234 5678 9012' },
            { number: '', expected: '' }
        ];

        testCases.forEach(({ number, expected }) => {
            expect(formatCardNumber(number)).toBe(expected);
        });
    });
});