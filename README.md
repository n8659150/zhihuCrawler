# 知乎问题图片爬虫

## python版

## python + selenium

- selenium 打开知乎主页，点击登录按钮弹出登录框

- 用户手动输入用户名密码并登录（在代码中设置用户名和密码后，可自动填充）

- 时限过后，根据用户指定的问题URL开始模拟浏览并爬取图片

- 将图片存入本地

## nodejs版

## nodejs + puppeteer

- 跳转到用户指定的问题URL开始模拟浏览并爬取图片

- 正则筛选img标签中的src部分

- TODO:图片保存至本地


