from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
from tqdm import tqdm


def crawl_website(url, wait_time=8):
    """简洁版本的网页爬取函数"""
    # 配置浏览器选项
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')

    try:
        # 启动浏览器
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )

        print(f"正在爬取: {url}")
        driver.get(url)

        # 显示进度条
        with tqdm(total=wait_time, desc="加载进度", unit="秒") as pbar:
            for i in range(wait_time):
                time.sleep(1)
                pbar.update(1)

                # 检查页面状态但不提前结束
                if i == 0:  # 只在第一次检查
                    ready_state = driver.execute_script("return document.readyState")
                    pbar.set_description(f"状态: {ready_state}")

        # 获取HTML
        html = driver.page_source
        print(f"完成! HTML长度: {len(html)}")

        return html

    except Exception as e:
        print(f"错误: {e}")
        return None
    finally:
        driver.quit()


# 主程序
if __name__ == "__main__":
    url = "https://cc.zitzhen.cn"
    html_content = crawl_website(url)

    if html_content:
        with open("website.html", "w", encoding="utf-8") as f:
            f.write(html_content)
        print("网页已保存为 website.html")