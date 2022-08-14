const login = async (email, password) => {
    const res = await axios({
        method: 'POST',
        url: 'localhost:27017/education_Nodejs.users',
        data: {
            email,
            password,
        },
    });
    console.log(res);
};
const email = document.getElementById('email').value;
document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});
