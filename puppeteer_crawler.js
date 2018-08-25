const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
// 下拉加载图片的次数 (别太多不然营养跟不上:))
// const maxScrollCount = 10;
// 等待下拉加载完成，默认1000ms,网络情况好可缩短,不佳可延长。
let wait = (ms = 1000) => new Promise(resolve => setTimeout(() => resolve(), ms));

//api /sisterTitle?questionId=88888888
app.get('/sisterTitle', async (req, res) => {
  const browser = await puppeteer.launch();
  console.log('launched');
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('new page created');

  // 爬虫执行部分
  let questionId = req.query.questionId;
  let URL = `https://www.zhihu.com/question/${questionId}`;
  await page.goto(URL,{timeout:2000});
  console.log(`page reached`);
  let pageTitle = await page.title();
  await browser.close();
  res.json(pageTitle);
})

//api /sisterImg?questionId=88888888&pageCount=3

app.get('/sisterImg', async (req, res) => {
    const browser = await puppeteer.launch()
    console.log('launched');
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('new page created');
  
    // 爬虫执行部分
    let questionId = req.query.questionId;
    let pageCount = Number(req.query.pageCount);
    let URL = `https://www.zhihu.com/question/${questionId}`;
    await page.goto(URL,{timeout:6000});
    console.log(`page reached`);
    // await wait(2000);
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
    console.log(`page count is ${pageCount}`)
    for (let i = 0; i <= pageCount; i++) {
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
    res.json(targetLink);
})

let server = app.listen(8089, function () {

  console.log('服务器在8089端口启动');

})
















