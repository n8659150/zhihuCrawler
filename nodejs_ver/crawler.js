const rp = require("request-promise");
class zhihuCrawler {
    constructor(questionId) {
        this.isEnd = false;
        this.questionId = questionId;
    }

    async init(offset = 0, limit = 20) {
        if (this.isEnd) {
            console.log("到底了");
            return;
        }
        const { isEnd, uri, imgs, question } = await this.getAnswers(
            limit,
            offset
        );
        this.isEnd = isEnd;
        this.uri = uri;
        this.imgs = imgs;
        this.question = question;
        return { meta: question, imgSrc: imgs, total: imgs.length };
    }

    async getQuestion() {
        const uri = `https://www.zhihu.com/api/v4/questions/${this.questionId}`;
        try {
          return await rp({ uri, json: true, timeout: 5000 });
        } catch (error) {
            console.log("知乎API调用出错，请检查网络");
        }
    }

    async getAnswers(limit, offset) {
        const uri = `https://www.zhihu.com/api/v4/questions/${this.questionId}/answers?include=data%5B%2A%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Cis_sticky%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Ceditable_content%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Ccreated_time%2Cupdated_time%2Creview_info%2Crelevant_info%2Cquestion%2Cexcerpt%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%3Bdata%5B%2A%5D.mark_infos%5B%2A%5D.url%3Bdata%5B%2A%5D.author.follower_count%2Cbadge%5B%2A%5D.topics&limit=${limit}&offset=${offset}&sort_by=default`;
        try {
            const { paging, data } = await rp({
                uri,
                json: true,
                timeout: 5000,
            });
            const { is_end: isEnd, next } = paging;
            const { question } = Object(data[0]);
            const content = data.reduce(
                (content, it) => content + it.content,
                ""
            );
            const imgs = this.matchImg(content);
            return { isEnd, uri: next, imgs, question };
        } catch (error) {
            console.log("知乎API调用出错，请检查网络");
            console.log(error);
        }
    }

    matchImg(content) {
        const imgs = [];
        const matchImgOriginRe = /<img.*?data-original="(.*?)"/g;
        content.replace(matchImgOriginRe, ($0, $1) => imgs.push($1));
        return [...new Set(imgs)];
    }
}
module.exports = zhihuCrawler;
