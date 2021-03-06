const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
// 下拉加载图片的次数 (别太多不然营养跟不上:))
const maxScrollCount = 10;
// 等待下拉加载完成，默认1000ms,网络情况好可缩短,不佳可延长。
let wait = (ms = 1000) => new Promise(resolve => setTimeout(() => resolve(), ms));

//api /sister?questionId=88888888

app.get('/sister', async (req, res) => {
    const browser = await puppeteer.launch()
    console.log('launched');
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('new page created')
    // // 登录部分
    // await page.goto('http://zhihu.com');
    // // 视口宽度默认800*600，不设置视口宽度的话 无法点击页面右侧“登录”按钮
    // await page.setViewport({
    //   width: 1920,
    //   height: 1080
    // });
    // // 未登录状态下的右侧“登录”按钮
    // await page.click('button.Button.HomeSidebar-signBannerButton.Button--blue.Button--spread');
    // // 输入用户名密码模拟登录
    // await page.type('input[name="username"]', 'xxxxxx', {delay: 300});
    // await page.type('input[name="password"]', 'xxxxxx', {delay: 300});
    // await page.keyboard.down('Enter');
    // await page.waitForNavigation()
    // // 登录部分结束
  
    // 爬虫执行部分
    let questionId = req.query.questionId;
    let URL = `https://www.zhihu.com/question/${questionId}`;
    await page.goto(URL,{timeout:2000});
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
    res.json(targetLink);
})

let server = app.listen(8089, function () {

  console.log('服务器在8089端口启动');

})
















