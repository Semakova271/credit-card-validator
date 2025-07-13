const path = require('path');
const puppeteer = require('puppeteer');
const express = require('express');
const http = require('http');

jest.setTimeout(60000);

describe('Credit Card Validator E2E Tests', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    const app = express();
    app.use(express.static(path.join(__dirname, '../dist')));

    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(9000, '127.0.0.1', resolve);
    });

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 1024 });
    await page.setDefaultTimeout(15000);

    await page.goto('http://localhost:9000', {
      waitUntil: 'networkidle0',
    });
    console.log('Opened page: http://localhost:9000');

    page.on('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.dismiss();
    });

    try {
      await page.waitForSelector('#cardNumber', { timeout: 30000 });
      console.log('Found #cardNumber element');
    } catch (error) {
      console.error('Could not find #cardNumber element:', error);
      await page.screenshot({ path: 'error-screenshot.png' });
      throw error;
    }
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.screenshot({ path: 'e2e-screenshot.png' });
    console.log('Saved final screenshot: e2e-screenshot.png');

    if (browser) await browser.close();
    if (server) server.close();
  });

  test('should validate card number', async () => {
    console.log('Starting validation test...');

    const consoleErrors = [];
    page.on('pageerror', (error) => consoleErrors.push(error.text()));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    try {
      await page.focus('#cardNumber');
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.keyboard.press('Backspace');

      await page.type('#cardNumber', '4111111111111111', { delay: 50 });

      const inputValue = await page.$eval('#cardNumber', (el) => el.value);
      expect(inputValue.replace(/\s/g, '')).toBe('4111111111111111');

      const btnDisabled = await page.$eval('#validateBtn', (el) => el.disabled);
      expect(btnDisabled).toBe(false);

      await page.click('#validateBtn');
      console.log('Clicked validate button');

      try {
        await page.waitForFunction(
          () => {
            const result = document.querySelector('#result .result-text');
            return result && result.textContent.includes('Карта');
          },
          { timeout: 30000 },
        );
      } catch (error) {
        console.log('Trying alternative selector...');
        await page.waitForSelector('#result.show', {
          timeout: 30000,
          visible: true,
        });
      }

      const resultText = await page.$eval('#result .result-text', (el) => el.textContent.trim());
      console.log('Result text:', resultText);
      expect(resultText).toContain('Карта действительна');
    } catch (error) {
      await page.screenshot({ path: `error-${Date.now()}.png` });
      console.error('Test failed, screenshot saved');
      throw error;
    }

    if (consoleErrors.length > 0) {
      console.error('Console errors:', consoleErrors);
      throw new Error(`Ошибки в консоли:\n${consoleErrors.join('\n')}`);
    }
  });
});
