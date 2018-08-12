const puppeteer = require('puppeteer');
// 下拉加载图片的次数 (别太多不然营养跟不上:))
const maxScrollCount = 10;
// 等待下拉加载完成，默认1000ms,网络情况好可缩短,不佳可延长。
let wait = (ms = 1000) => new Promise(resolve => setTimeout(() => resolve(), ms));

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // 爬虫执行部分
  await page.goto('https://www.zhihu.com/question/61235373');
  console.log(`page reached`);
  await page.setViewport({
    width: 1920,
    height: 1080
  });
  let viewAllExists = await page.$('.QuestionMainAction');
  if (viewAllExists !== null) {
    await page.click('.QuestionMainAction');
    console.log(`'load all' button clicked`);
  }
  // 下拉加载，并且等待加载完成，重复n次
  for (let i = 0; i < maxScrollCount; i++) {
    console.log(`loading page ${i}`);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    })
    console.log(`wait for content loading`);
    await wait();
  }
  const targetLink = await page.evaluate(() => {
    console.log(`formatting img links`)
    return [...document.querySelectorAll('noscript')].map(item => {
      let srcLink = item.textContent.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
      return srcLink
    })
  });
  console.log(targetLink);
  console.log(`grabbed ${targetLink.length} pics`);
  await browser.close();
})()

