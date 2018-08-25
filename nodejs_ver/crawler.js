let fs = require('fs');
let rp = require('request-promise');
class zhihuCrawler {
  
  constructor(questionId) {
    this.isEnd = false;
    this.questionId = questionId;
  }

  async init(offset, limit) {
    if (this.isEnd) {
      console.log('到底了');
      return
    }
    let { isEnd, uri, imgs, question } = await this.getAnswers(limit, offset);
    this.isEnd = isEnd;
    this.uri = uri;
    this.imgs = imgs;
    this.question = question;
    return { 'meta': question, 'imgSrc': imgs, 'total': imgs.length }
  }

  async getAnswers(limit, offset) {
    let uri = `https://www.zhihu.com/api/v4/questions/${this.questionId}/answers?limit=${limit}&offset=${offset}&include=data%5B%2A%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Cis_sticky%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Ceditable_content%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Ccreated_time%2Cupdated_time%2Creview_info%2Crelevant_info%2Cquestion%2Cexcerpt%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%3Bdata%5B%2A%5D.mark_infos%5B%2A%5D.url%3Bdata%5B%2A%5D.author.follower_count%2Cbadge%5B%3F%28type%3Dbest_answerer%29%5D.topics&sort_by=default`;
    let response = {};
    try {
      const { paging, data } = await rp({ uri, json: true, timeout: 10000 });
      const { is_end: isEnd, next } = paging;
      const { question } = Object(data[0]);
      const content = data.reduce((content, it) => content + it.content, '');
      const imgs = this.matchImg(content);
      response = { isEnd, uri: next, imgs, question }
    } catch (error) {
      console.log('知乎API调用出错，请检查网络');
      console.log(error);
    }
    return response
  }

  matchImg(content) {
    let imgs = [];
    let matchImgOriginRe = /<img.*?data-original="(.*?)"/g;
    content.replace(matchImgOriginRe, ($0, $1) => imgs.push($1));
    return [...new Set(imgs)]
  }

}
module.exports = zhihuCrawler;