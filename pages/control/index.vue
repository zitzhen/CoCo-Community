<template>
    <div class="container-error-card">
        <div class="error-content">
            <div class="error-icon">
                <i aria-hidden="true" class="fas fa-exclamation-triangle"></i>
            </div>
            <h1 class="error-title">请检查路径</h1>
            <p class="error-message">
                抱歉，您访问的是根路径。不能使用路径访问。
            </p>
        </div>
    </div>
</template>
<style>
@import url(@/assets/css/dark.css);

    :root {
    --primary-color: var(--primary);
    --secondary-color: var(--secondary);
    --background-color: var(--background);
    --card-color: var(--card);
    --text-color: var(--foreground);
    --shadow: var(--shadow-sm);
}

.container-error-card{
    display: flex;
    justify-content: center;
    align-items: center;
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
    color: #ef4444;
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



<script setup>

useHead({
  title: '请勿使用根路径访问|CoCo-Community',
  meta: [{
    name: 'robots',
    content: 'noindex, nofollow',
  }]
})
</script>