document.getElementById('myForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 获取 Turnstile 响应令牌
    const token = document.querySelector('[name="cf-turnstile-response"]').value;
    
    try {
    const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // 验证成功，继续表单提交
        alert('验证成功！');
        // 这里可以添加实际表单提交逻辑
    } else {
        alert('人机验证失败，请重试');
    }
    } catch (error) {
    console.error('验证错误:', error);
    alert('验证过程中出错');
    }
});