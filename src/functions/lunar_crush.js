const chromium = require('chrome-aws-lambda')
const cheerio = require('cheerio')
const https = require("https")
const dotenv = require("dotenv").config();

exports.handler = async () => {
  let browser = null;
  let statusCode;
  try {
    const executablePath = await chromium.executablePath
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath,
      headless: chromium.headless,
    })

    const linkRefs = process.env.LIST_URL.split(',')
    const index = Math.floor(Math.random() * linkRefs.length);
    console.log('linkRef', linkRefs)

    // Do stuff with headless chrome
    const page = await browser.newPage()
    const targetUrl = linkRefs[index]
    console.log('targetUrl', targetUrl)
    await page.setViewport({ width: 1200, height: 800 });
    // Goto page and then do stuff
    await page.goto(targetUrl, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
      timeout: 0
    })

    await page.waitForTimeout(30000);

    statusCode = 200;
  } catch (err) {
    statusCode = 500;
    console.error('err', err);
  } finally {
    // close browser
    if (browser !== null) {
      await browser.close()
    }
  }

  return {
    statusCode: statusCode,
    body: 'OK'
  }
}

const autoScroll = async (page) => {
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          debugger;
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
               
              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}
