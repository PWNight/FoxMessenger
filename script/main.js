function gen_loginPage(){
    const container = document.getElementById('container');
    let form = document.createElement('form');
    let inpt_login = document.createElement('input');
    let inpt_pass = document.createElement('input');
    let btn_login = document.createElement('button')
    inpt_login.type = 'text';
    inpt_pass.type = 'password';
    inpt_login.name = 'login';
    inpt_pass.name = 'password';
    inpt_login.placeholder = 'Логин';
    inpt_pass.placeholder = 'Пароль';
    inpt_login.required = true;
    inpt_pass.required = true;
    btn_login.type = 'submit';
    btn_login.textContent = 'Авторизоваться';
    container.append(form);
    form.append(inpt_login);
    form.append(inpt_pass)
    form.append(btn_login);
    return form;
}
function gen_mainPage(){
    const container = document.getElementById('container');
    let cont_msgs = document.createElement('div');
    let form = document.createElement('form');
    let input = document.createElement('input');
    let btn = document.createElement('button');
    cont_msgs.id = 'cont_msgs';
    form.id = 'msg_form';
    input.name = 'message';
    input.placeholder = 'Введите сообщение';
    btn.textContent = 'Отправить';
    container.append(cont_msgs);
    container.append(form);
    form.append(input);
    form.append(btn);
    return form;
}
function apiFetch(data,url,method){
    var requestOptions;
    if(!data){
        requestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }else{
        requestOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
    }
    var resultData = fetch(url, requestOptions)
    .then(async response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return resultData;
}
function getMessages(){
    let cont_msgs = document.getElementById('cont_msgs');
    cont_msgs.innerHTML = '';
    apiFetch('',"http://localhost/messenger/getMessages.php","GET")
    .then(resultData => {
        if(resultData.status == 200){
            var messages;
            var data = JSON.parse(resultData.body.message);
            for (var i = 0; i < data.length; i++) {
                var innerData = data[i];
                var from_u = innerData[0];
                var message = innerData[1];
                //var date = innerData['created_at']
                messages += '<p>' + from_u + ': ' + message + '</p>';
            }
            cont_msgs.innerHTML = messages
        }
    })
}
window.onload = e => {
    form = gen_loginPage()
    const loginHandler = e => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const data = {
            'login': formData.get('login'),
            'password': formData.get('password')
        }
        apiFetch(data,"http://localhost/messenger/login.php","POST")
        .then(resultData => {
            if(resultData.status == 200){
                container.innerHTML = "";
                form = gen_mainPage();
                form.addEventListener('submit', sendHandler)
                getMessages()
                setInterval(getMessages,10000)
            }
        })
    }
    const sendHandler = e => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const data = {
            'from_u': 'tt',
            'content': formData.get('message')
        }
        apiFetch(data,"http://localhost/messenger/sendMessage.php","POST")
        .then(resultData => {
            if(resultData.status == 200){
                container.innerHTML = "";
                form = gen_mainPage();
                form.addEventListener('submit', sendHandler)
                getMessages()
                setInterval(getMessages,10000)
            }
        })
    }
    form.addEventListener('submit', loginHandler)
}