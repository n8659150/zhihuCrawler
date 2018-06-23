const puppeteer = require('puppeteer');
(async () => {
  // const browser = await puppeteer.launch({ headless: false })
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

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




  await page.goto('https://www.zhihu.com/question/61235373');
  await page.setViewport({
    width: 1920,
    height: 1080
  });
  // 加载全部页面
  // 当问题已关闭时，“显示全部”按钮默认不显示，所以需要判断一下
  let viewAllExists = await page.$('.QuestionMainAction');
  if (viewAllExists !== null) {
    await page.click('.QuestionMainAction');
  }

  // 
  await page.evaluate(() => {
    
    // 模拟鼠标往上回滚，触发剩余图片的加载
    window.scrollTo(document.body.scrollHeight, 10);
    
    window.scrollTo(0,200000);
    
    
    });
    
    
    // 下滚5次
    // (function(j){
    //   for (let i = 0; i < j; i++) {
    //     window.scrollTo(0,document.body.scrollHeight);
    //   }
    // })(10)


  const targetLink = await page.evaluate(() => {
    return [...document.querySelectorAll('noscript')].map(item => {
      let srcLink = item.textContent.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1];
      return srcLink
    })

  });

  // const name = await page.evaluate(() => document.querySelector('.Avatar AppHeader-profileAvatar').innerText)

  console.log(targetLink);

  // await browser.close()
})()