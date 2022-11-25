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
        console.log(email, password);
        $.ajax({
            url: 'loginStore',
            type: 'POST',
            data: {
                email,
                password,
            },
            success: (response) => {
                console.log(response);
                if (response.success == true) {
                    document.cookie = `jwt=${response.token}; SameSite=strict; Secure`;
                    window.location.href = '/?isLogin=true';
                }
            },
            error: (err) => {
                console.log(err);
            },
        });
    });
}
