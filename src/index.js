const puppeteer = require('puppeteer');
const { passTaobaoVerify, writeConfigInfo } = require('./utils');
const hackBrowser = require('./utils/hackBrowser');
const config = require('./config.json');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled', // webdriver 信息去除
    ],
    dumpio: false,
  });
  const page = await browser.newPage();
  await hackBrowser(page);
  await page.goto(config.alipay.url, { waitUntil: 'networkidle2' });

  await page.type('#fm-login-id', config.alipay.username, { delay: 80 });
  await page.waitForTimeout(500);
  await page.type('#fm-login-password', config.alipay.password, { delay: 80 });
  await passTaobaoVerify(page);
  await page.click('#login-form > div.fm-btn > button');
  await page.waitForNavigation();
  await page.waitForNavigation();

  // 获取页面数据
  try {
    const data = await page.evaluate(() => {
      const lines = [...document.querySelectorAll('tbody tr')];
      return lines.map(tr => ({
        date: tr.querySelector('.time-d').textContent.match(/\d{4}\.\d{2}\.\d{2}/)[0],
        time: tr.querySelector('.time-h').textContent.match(/\d{2}\:\d{2}/)[0],
        amount: +tr.querySelector('.amount-pay').textContent.replace(/\s/g, ''),
        name: tr.querySelector('p.name').textContent.match(/\n\t\t\t\t\t(.+)\n\t\t\t/)[1],
        title: tr.querySelector('.consume-title').textContent.match(/\n\n\n\t(.+)\n/)[1],
        id: tr.querySelector('.tradeNo').textContent.match(/(?:\u4ea4\u6613\u53f7|\u6d41\u6c34\u53f7):(\d{28})/)[1],
        status: tr.querySelector('td.status').innerHTML.match(/\n\t\t<p>(.+)<\/p>\n/)[1]
      })).filter(res => !res.status.includes('交易关闭'));
    });
    const targetIndex = data.findIndex(item => item.id === config.alipay.data.lastRecortId);
    console.log('data===',targetIndex, data.slice(0, targetIndex));
    writeConfigInfo({
      lastRecortId: data[0].id
    });
  } catch (error) {
    console.log('error===', error);
  }
})();
