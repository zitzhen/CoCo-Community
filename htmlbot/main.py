from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def crawl_with_selenium(url, wait_time=10):
    """
    使用Selenium执行JavaScript并获取完整HTML
    
    Args:
        url (str): 要爬取的网址
        wait_time (int): 等待页面加载的时间（秒）
    
    Returns:
        str: 完整的HTML内容
    """
    # 配置Chrome选项
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # 无头模式
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    
    # 初始化浏览器
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # 访问网页
        driver.get(url)
        
        # 等待页面完全加载
        WebDriverWait(driver, wait_time).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # 可选：等待特定元素加载（根据需要修改）
        # WebDriverWait(driver, wait_time).until(
        #     EC.presence_of_element_located((By.ID, "content"))
        # )
        
        # 获取完整HTML
        html_content = driver.page_source
        
        return html_content
        
    except Exception as e:
        print(f"爬取过程中出现错误: {e}")
        return None
        
    finally:
        # 关闭浏览器
        driver.quit()

# 使用示例
if __name__ == "__main__":
    url = "https://cc.zitzhen.cn"  # 替换为你要爬取的网址
    html = crawl_with_selenium(url)
    
    if html:
        print("成功获取HTML内容")
        print(f"HTML长度: {len(html)}")
        # 保存到文件
        with open("crawled_page.html", "w", encoding="utf-8") as f:
            f.write(html)
    else:
        print("获取HTML内容失败")