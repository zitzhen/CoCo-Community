const essay = document.getElementById("essay");
const q1essay = document.getElementById("q1essay");
const Loading = document.getElementById("Loading");

async function fetch_information(name) {
  try {
    const response = await fetch("all/" + name + "/information.json");
    if (!response.ok) throw new Error('请求失败');
    const data = await response.text();
    //console.log(data);
    return data;
  } catch (error) {
    console.error('错误:', error);
    return null;
  }
}

function add_essay(essay_name,url = "",author = "",release_date = ""){
  essay.innerHTML += `
    <div class="article-card">
      <img src="${url}" alt="${essay_name}" class="article-thumbnail">
      <div class="article-content">
          <h3 class="article-title"><a href="all/${essay_name}">${essay_name}</a></h3>
          <div class="article-meta">
              <span class="article-meta-item"><i class="fas fa-user"></i>${author}</span>
              <span class="article-meta-item"><i class="fas fa-calendar-alt"></i>${release_date}</span>
              <span class="article-meta-item"><i class="fas fa-eye"></i> 正在加载</span>
              <span class="article-meta-item"><i class="fas fa-comments"></i> 正在加载</span>
          </div>
          <p class="article-excerpt">
              正在加载
          </p>
      </div>
    </div>`;
}

async function main() {
  try {
    const response = await fetch('https://api.github.com/repos/zitzhen/CoCo-Community/contents/essay/all');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log(data);
    q1essay.style.display = 'none';
    
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
      let name = data[i].name;
      console.log(name);
      
      if (name !== "example") {
        const information = await fetch_information(name);
        console.log(information);
        add_essay(name);
      }

    }
    
    Loading.style.display = 'none';
  } catch (error) {
    console.error('Error:', error);
  }
}

main();