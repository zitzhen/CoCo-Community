from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from tqdm import tqdm
import sys


def crawl_with_selenium(url, wait_time=10):
    """
    使用Selenium执行JavaScript并获取完整HTML
    """
    # 配置Chrome选项
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--blink-settings=imagesEnabled=false')

    try:
        # 使用webdriver-manager自动管理ChromeDriver
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    except Exception as e:
        print(f"Chrome驱动初始化失败: {e}")
        return None

    try:
        print(f"正在访问: {url}")
        driver.get(url)

        # 使用tqdm显示进度条
        print("等待页面加载中...")
        with tqdm(total=wait_time, desc="加载进度", unit="秒", file=sys.stdout) as pbar:
            for second in range(wait_time):
                time.sleep(1)
                pbar.update(1)

                # 检查页面是否已加载完成
                try:
                    # 检查body元素是否存在且页面状态为complete
                    driver.execute_script("return document.readyState") == "complete"
                    # 可以添加更多检查条件
                    pbar.set_description("页面加载完成")
                    break
                except:
                    continue

        # 获取完整HTML
        html_content = driver.page_source
        print(f"页面加载完成，HTML长度: {len(html_content)}")
        return html_content

    except Exception as e:
        print(f"爬取过程中出现错误: {e}")
        return None
    finally:
        driver.quit()


# 使用示例
if __name__ == "__main__":
    print("进程开始")
    url = "https://cc.zitzhen.cn"

    html = crawl_with_selenium(url, wait_time=10)

    if html:
        print("成功获取HTML内容")
        # 保存到文件
        with open("crawled_page.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("已保存到 crawled_page.html")
    else:
        print("获取HTML内容失败")