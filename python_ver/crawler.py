from selenium import webdriver
import time
import requests
from bs4 import BeautifulSoup
import html.parser

# 模拟真人打开浏览器进行浏览部分
driver = webdriver.Chrome(executable_path = 'C:\Anaconda2\chromedriver\chromedriver.exe') # 注意chromedriver的路径
driver.get("https://www.zhihu.com/") #利用selenium打开知乎首页
driver.find_element_by_css_selector('button.Button.HomeSidebar-signBannerButton.Button--blue.Button--spread').click() #点击主页右侧登录按钮
driver.find_element_by_css_selector('input[name="username"]').send_keys('*****') #设定输入的用户名
driver.find_element_by_css_selector('input[name="password"]').send_keys('*****') #设定输入的密码
time.sleep(40) # 用户有40秒时间点击"登录"按钮。

# 开始爬
driver.get("https://www.zhihu.com/question/20196263") # 打开指定的 URL :)

for i in range(5):# 向下滑动触发内容加载,1代表向下滑动加载一次
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);") #滑动到浏览器底部，触发加载信息
    time.sleep(3) #等待页面加载时间

# 爬虫部分
source = driver.page_source  # 原网页中 HTML 信息
soup = BeautifulSoup(source,'lxml') 
data_in = soup.find_all('noscript') # 找到所有的 <noscript>
data_inner_all = "" #存储全部的 <noscript> 中的 text
for data in data_in:
   data_inner = data.get_text() # 获取 <noscript> 的 text 内容
   data_inner_all += data_inner + "\n"
data_all = html.parser.unescape(data_inner_all) # 将解码成 HTML

# parse及保存图片部分
img_soup = BeautifulSoup(data_all,'lxml') # 再次解析 HTML 
imgs = img_soup.find_all('img') # 找到所有的 img 
count = 0  # 用来标记图片数量及作为名字
for img in imgs: # 保存所有的图片
    if img.get('src') is not None: # 判断是否包含图片的 url 
        img_url = img.get('src')
        with open('./img/' + str(count) + '.jpg','wb+') as f: #保存图片到本地,img文件夹需要提前建好
            f.write(requests.get(img_url).content)
            count += 1
print("craw done") # 保存成功！



