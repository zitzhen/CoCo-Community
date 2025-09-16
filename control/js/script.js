// 获取DOM元素（提升到全局作用域，供所有函数使用）
const Navigation_bar = document.getElementById("Navigation_bar");
const File_Information = document.getElementById("File_Information");
const error_prompt_small_windows = document.getElementById('error_prompt_small_windows');
const error_windows = document.getElementById('error_windows');
const Something_went_wrong_text = document.getElementById('Something_went_wrong_text');
const error_prompt_text_one = document.getElementById('error_prompt_text_one');
const Loading = document.getElementById('Loading');
const error_windows_br = document.getElementById('error_windows_br');
const error_prompt_small_windows_br = document.getElementById('error_prompt_small_windows_br');
const presentation_of_the_document = document.getElementById('presentation_of_the_document');
const file_name = document.getElementById('file_name');
const html_size = document.getElementById('size');
const size2 = document.getElementById('size2');
const avatar_src = document.getElementById('avatar_src');
const HTML_author_name = document.getElementById('HTML_author_name');
const HTML_bio = document.getElementById("HTML_bio");
const download = document.getElementById("download");
const source = document.getElementById("source");

function new_error(error = "") {
    console.error("触发错误");
    Loading.style.display = 'none';
    File_Information.style.display = 'none';
    error_prompt_small_windows.style.display = 'block';
    error_windows.style.display = 'block';
    error_windows_br.style.display = 'block';
    error_prompt_small_windows_br.style.display = 'block';
    if (error){
        Something_went_wrong_text.innerHTML = "错误信息";
        error_prompt_text_one.innerHTML = "错误信息<br>" + error;
        document.title = "发生错误|ZIT-CoCo-Community";
        history.replaceState(null, "发生错误|ZIT-CoCo-Community", window.location.href);
    } else {
        Something_went_wrong_text.innerHTML = '找不到文件';
        error_prompt_text_one.innerHTML = '请检查参数中的文件名是否正确';
        document.title = "404 not found|找不到控件|ZIT-CoCo-Community";
        history.replaceState(null, "404 not found|找不到控件|ZIT-CoCo-Community", window.location.href);
    }
}

function off_error_button() {
    error_prompt_small_windows.style.display = 'none';
}

// 获取项目描述
async function Get_the_description(name) {
    try {
        const response = await fetch(`${name}/README.md`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        return content;
    } catch (error) {
        console.error('请求出错:', error);
        new_error(error);
        return '';
    }
}

// 获取版本列表
async function Get_the_version(path = '') {
    const apiUrl = `${path}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('网络请求失败');
        }
        const data = await response.text();
        if (!Array.isArray(data)) return [];
        return data
            .filter(item => item.type === 'dir')
            .map(dir => dir.name);
    } catch (error) {
        console.error('获取版本时出错:', error);
        new_error(error)
        return [];
    }
}

// 获取配置文件
async function Get_the_jsonData(name) {
    try {
        const url = `${name}/information.json`;
        const response = await fetch(url);  
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('获取配置文件出错:', error);
        new_error(error);  
        return [];
    }
}

//获取控件
async function Get_controls(name,version) {
    try{
        const url =`${name}/${version}/control.jsx`
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        const size = response.headers.get('Content-Length');
        return {
            data:data,
            size:size
        };
    }  catch (error) {
        console.error('获取控件出错:', error);
        new_error(error);  
        return [];
    }
}

//获取创作者信息
async function get_Creator_Information(id) {
    try{
        const url = `https://api.github.com/users/${id}`
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`HTTP error! status :${response.status}`)
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error("获取Github创作者信息出错",error);
        new_error(error);
        return [];
    }
    
}
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
    // 优先从URL查询参数获取name，否则从路径获取
    let filename = null;
    const urlParams = new URLSearchParams(window.location.search);
    filename = urlParams.get('name');
    if (!filename) {
        // 从路径 /control/xxx 获取 xxx
        const pathMatch = window.location.pathname.match(/\/control\/([^\/\?]+)/);
        if (pathMatch && pathMatch[1]) {
            filename = decodeURIComponent(pathMatch[1]);
        }
    }
    
    console.log(filename);
    // 检查是否提供了文件名参数
    if(filename == "index.html" || filename == "name" || filename == ":name" || !filename) {
        console.error("无效参数");
        Loading.style.display = 'none';
        File_Information.style.display = 'none';
        error_prompt_small_windows.style.display = 'block';
        error_windows.style.display = 'block';
        Something_went_wrong_text.innerHTML = '未检测到参数';
        error_prompt_text_one.innerHTML = '请检查URL中的name参数';
        document.title = "400 Bad Request|错误请求|ZIT-CoCo-Community";
        history.replaceState(null, "400 Bad Request|错误请求|ZIT-CoCo-Community", window.location.href);
    } else {
        // 隐藏错误提示元素
        error_windows_br.style.display = 'none';
        error_prompt_small_windows_br.style.display = 'none';
        
        try {
            // 获取版本列表和项目描述
            const versions = await Get_the_version(filename);
            console.log(versions)
            const introduce = await Get_the_description(filename);
            const jsonDataStr =  await Get_the_jsonData(filename);
            const jsonData = jsonDataStr; 
            const controls = await Get_controls(filename,jsonData.Version_number_list[jsonData.Version_number_list.length - 1]);
            let size =(controls.size/1024);
            size = size.toFixed(2);
            const creator_ID = jsonData.author;
            console.log(creator_ID);
            const creator_information = await get_Creator_Information(creator_ID);
            const avatar = creator_information.avatar_url;
            const author_name = creator_information.name;
            const author_bio = creator_information.bio;
            console.log(jsonData);
            // 使用marked库解析Markdown内容
            const html_introduce = marked.parse(introduce);
            presentation_of_the_document.innerHTML = html_introduce;
            file_name.innerHTML = filename;
            html_size.textContent = "大小："+size+"KIB";
            size2.innerHTML =size+"KIB";
            avatar_src.src = avatar;
            HTML_author_name.innerHTML = author_name;
            HTML_bio.innerHTML = author_bio;
            download.href = "https://cc.zitzhen.cn/control/" + filename + "/" + jsonData.Version_number_list[jsonData.Version_number_list.length - 1] + "/control.jsx";
            source.href = "https://cc.zitzhen.cn/control/" + filename + "/" + jsonData.Version_number_list[jsonData.Version_number_list.length - 1] + "/control.jsx";
            
            // 加载完成后隐藏加载动画
            Loading.style.display = 'none';
            document.title = filename + "|控件详情|ZIT-CoCo-Community";
            history.replaceState(null, filename + "|控件详情|ZIT-CoCo-Community", window.location.href);
        } catch (error) {
            console.error('加载内容出错:', error);
            new_error(error);
        }
    }
});