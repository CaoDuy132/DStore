$(document).ready(() => {
    register();
    login();
});
const signUpButton = $('#signUp');
const signInButton = $('#signIn');
const container = $('#container');
signUpButton.on('click', () => {
    container.addClass('right-panel-active');
});
signInButton.on('click', () => {
    container.removeClass('right-panel-active');
});
function register() {
    $('form.form-register').on('submit', (e) => {
        e.preventDefault();
        const fullname = $('.fullname').val().trim();
        const email = $('.email').val().trim();
        const phone = $('.phone').val().trim();
        const password = $('.password').val().trim();
        $.ajax({
            url: 'registerStore',
            type: 'POST',
            data: {
                fullname,
                email,
                phone,
                password,
            },
            success: (response) => {
                if (response.success == true) {
                    container.removeClass('right-panel-active');
                }
            },
            error: (response) => {
                console.log(response);
            },
        });
    });
}
function login() {
    $('form.form-login').on('submit', (e) => {
        e.preventDefault();
        const email = $('.emailLogin').val().trim();
        const password = $('.passwordLogin').val().trim();
        axios({
            method: 'POST',
            url: 'loginStore',
            data: {email, password}
        })
        .then(res=>{
            if(res.data.success==true) {
                const token = res.data.token;
                localStorage.setItem('token', res.data.token);
                document.cookie = `jwt=${token}; SameSite=strict; Secure`;
                window.location.href = '/?isLogin=true';
            }
        })
        .catch(err=>console.log(err))
        axios.get('/protected', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }).then(response => {
            // Handle response from server
          }).catch(error => {
            console.error(error);
          });
    });
}
