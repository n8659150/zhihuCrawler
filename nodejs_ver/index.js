const crawler = require("./crawler");
const express = require("express");
const app = express();
const allowCrossDomain = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
};
app.use(allowCrossDomain);

app.get("/sisterTitle", async (req, res) => {
    try {
        const questionId = req.query.questionId;
        const zhihuCrawler = new crawler(questionId);
        const result = await zhihuCrawler.getQuestion();
        result["type"] === "question" && result["id"] > 0
            ? res.send(result)
            : res.send({ code: 404, log: "没有找到对应的问题" });
    } catch (error) {
        res.send({
            code: 500,
            log: "调用api出错，请检查参数是否正确或者网络连接是否正常",
        });
    }
});

app.get("/sisterImg", async (req, res) => {
    try {
        const { questionId, offset, limit } = req.query;
        const zhihuCrawler = new crawler(questionId);
        const result = await zhihuCrawler.init(offset, limit);
        res.send(result);
    } catch (error) {
        res.send({
            code: 500,
            log: "调用api出错，请检查参数是否正确或者网络连接是否正常",
        });
    }
});

app.listen(8089, () => {
    console.log("服务器在8089端口启动");
});
