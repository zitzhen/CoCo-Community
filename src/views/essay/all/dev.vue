<template>
    <header>
      <div class="container">
        <h1>ZIT-CoCo-Community</h1>
      </div>
    </header>
    <br></br>
    <div class="container">
        <div class="error-content">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2 class="error-title">此页面搭建中</h2>
            <p class="error-message">
                抱歉，您此页面搭建中，敬请期待。
                <br />
                CoCo-Community是开源项目，如果您是开发人员，您可以参与此<a href="https://github.com/zitzhen/CoCo-Community">项目</a>
            </p>
        </div>
    </div>
</template>
<style scoped>
    :root {
    --primary-color: #3498db;
    --secondary-color: #2980b9;
    --background-color: #f5f7fa;
    --card-color: #ffffff;
    --text-color: #333333;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


.error-content {
    background-color: var(--card-color);
    border-radius: 8px;
    padding: 2rem;
    box-shadow: var(--shadow);
    text-align: center;
}

.error-icon {
    font-size: 5rem;
    color: #e74c3c;
    margin-bottom: 1.5rem;
}


.error-message {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.7;
}


@media (max-width: 600px) {
    .container {
        padding: 1rem;
    }
    
    .error-icon {
        font-size: 4rem;
    }
    
    .error-title {
        font-size: 1.5rem;
    }
}
</style>