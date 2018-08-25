const crawler = require('./crawler');
const express = require('express');
const app = express();

app.get('/sisterImg', async (req, res) => {
    let questionId = req.query.questionId;
    let zhihuCrawler = new crawler(questionId);
    // init(offset,limit);
    let result = await zhihuCrawler.init(0,100);
    res.send(result);
})

let server = app.listen(8089, function () {

  console.log('服务器在8089端口启动');

})
