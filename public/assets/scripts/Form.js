import TokenStorage from './TokenStorage.js';

export default class Form {

    constructor() {
        this._elFormTitle = document.querySelector('[data-js-form-title]');
        this._elFormButton = document.querySelector('[data-js-login-btn]');
        this._elSpanLogin = document.querySelector('[data-js-span-login]');
        this._elInputEmail = document.getElementById('email');
        this._elInputPassword = document.getElementById('password');

        this.init();
    }

    init() {
        this._elSpanLogin.addEventListener('click', this.updateForm.bind(this));
        this._elFormButton.addEventListener('click', this.sendForm.bind(this));
    }

    updateForm() {
        let loginState = this._elSpanLogin.dataset.jsSpanLogin;
        let spanString;
        let newState;
        if (loginState == 'register') {
            spanString = 'Already have an account? Log in!';
            newState = 'login';
        } else {
            spanString = 'Not a member yet? Register!';
            newState = 'register';
        }
        this.replaceTextForm(loginState, spanString, newState)
    }

    replaceTextForm(state, sentence, newState) {
        this._elFormTitle.innerHTML = state;
        this._elFormButton.innerHTML = state;
        this._elSpanLogin.innerHTML = sentence;
        this._elSpanLogin.dataset.jsSpanLogin = newState;
    }

    async sendForm(e) {
        e.preventDefault();
        try {
            let route = this._elFormButton.innerHTML.toLowerCase();
            let email = this._elInputEmail.value;
            let password = this._elInputPassword.value;
            const {data} = await axios.post(`/api/v1/auth/${route}`, { email, password });
            const token = data.user;
            const storage = new TokenStorage();
            storage.saveTokenLocalStorage(token);
            if (token) {
                window.location.pathname = '/inventory.html';
            }
        } catch (error) {
            console.log(error);
        }
    }

    



}