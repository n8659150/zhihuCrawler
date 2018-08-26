const crawler = require('./crawler');
const express = require('express');
const app = express();

app.get('/sisterTitle', async (req, res) => {
  try {
    const questionId = req.query.questionId;
    let zhihuCrawler = new crawler(questionId);
    let result = await zhihuCrawler.getQuestion();
    (result['type'] === 'question' && result['id'] > 0) ? res.send(result) : res.send({'code':404,'log':'没有找到对应的问题'});
  }
  catch(error) {
    res.send({'code':500,'log':'调用api出错，请检查参数是否正确或者网络连接是否正常'});
  }
})

app.get('/sisterImg', async (req, res) => {
  try {
    const {questionId,offset,limit} = req.query
    let zhihuCrawler = new crawler(questionId);
    // init(offset,limit);
    let result = await zhihuCrawler.init(offset,limit);
    res.send(result);
  }
  catch(error) {
    res.send({'code':500,'log':'调用api出错，请检查参数是否正确或者网络连接是否正常'});
  }
})

let server = app.listen(8089, function () {

  console.log('服务器在8089端口启动');

})
