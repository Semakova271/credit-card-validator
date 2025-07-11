const path = require('path');
const puppeteer = require('puppeteer');
const express = require('express');
const http = require('http');

jest.setTimeout(40000); // Установка глобального таймаута

describe('Credit Card Validator E2E Tests', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    // Создаем express-приложение
    const app = express();
    // Раздаем статические файлы из корня проекта
    app.use(express.static(path.join(__dirname, '../dist')));

    // Запускаем сервер
    server = http.createServer(app);
    await new Promise(resolve => {
      server.listen(9000, '127.0.0.1', resolve);
    });

    // Запуск браузера
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    page = await browser.newPage();

    // Переходим на страницу
    await page.goto('http://localhost:9000');
    console.log('Opened page: http://localhost:9000');

    // Проверка загрузки страницы
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);

    // Проверка содержимого страницы
    const content = await page.content();
    console.log('Page content (first 500 chars):', content.substring(0, 500));

    // Сохраняем скриншот для диагностики
    await page.screenshot({ path: 'before-test-screenshot.png' });
    console.log('Took screenshot: before-test-screenshot.png');

    // Ожидание элемента с увеличенным таймаутом (исправленный селектор)
    try {
      await page.waitForSelector('#cardNumber', { timeout: 30000 });
      console.log('Found #cardNumber element');
    } catch (error) {
      console.error('Could not find #cardNumber element:', error);
      // Повторный скриншот при ошибке
      await page.screenshot({ path: 'error-screenshot.png' });
      throw error;
    }
  });

  afterAll(async () => {
    // Сохраняем скриншот для диагностики
    await page.screenshot({ path: 'e2e-screenshot.png' });
    console.log('Saved final screenshot: e2e-screenshot.png');

    if (browser) await browser.close();
    if (server) server.close();
  });

  test('should validate card number', async () => {
    console.log('Starting validation test...');

    // Проверяем, есть ли body на странице
    const bodyExists = await page.$('body') !== null;
    expect(bodyExists).toBe(true);
    console.log('Body exists:', bodyExists);

    // Очищаем поле ввода
    await page.click('#cardNumber', { clickCount: 3 });
    await page.keyboard.press('Backspace');

    // Вводим номер карты
    await page.type('#cardNumber', '4111111111111111');
    console.log('Typed card number');

    // Нажимаем кнопку (исправленный селектор)
    await page.click('#validateBtn');
    console.log('Clicked validate button');

    // Ждем появления результата
    await page.waitForSelector('#result.show', { timeout: 15000 });
    console.log('Result element appeared');

    // Проверяем результат
    const resultText = await page.$eval('#result .result-text', el => el.textContent);
    console.log('Result text:', resultText);
    expect(resultText).toContain('Карта действительна');
  });
});
