import TokenStorage from './TokenStorage.js';

export default class Authentification {

    constructor() {
        this._elFormTitle = document.querySelector('[data-js-form-title]');
        this._elFormButton = document.querySelector('[data-js-login-btn]');
        this._elSpanLogin = document.querySelector('[data-js-span-login]');
        this._elInputEmail = document.getElementById('email');
        this._elSpanPassword = document.querySelector('[data-js-span-password]');
        this._elInputPassword = document.getElementById('password');
        this._elSpanForm = document.querySelector('[data-js-span-form]');

        this.init();
    }

    /**
     * Set the initial behaviors.
     */
    init() {
        this._elSpanLogin.addEventListener('click', this.updateForm.bind(this));
        this._elFormButton.addEventListener('click', this.sendForm.bind(this));
    }

    /**
     * Update authentification form (login or register).
     */
    updateForm() {
        let loginState = this._elSpanLogin.dataset.jsSpanLogin;
        let spanString;
        let newState;
        let label;
        if (loginState == 'register') {
            spanString = 'Already have an account? Log in!';
            newState = 'login';
            label = '6 to 20 characters, one numeric digit, one uppercase and one lowercase letter';
        } else {
            spanString = 'Not a member yet? Register!';
            newState = 'register';
            label = '';
        }
        this.replaceTextForm(loginState, spanString, newState, label)
    }

    /**
     * Replace the text in the authentification form accordingly to the type of form required.
     */
    replaceTextForm(state, sentence, newState, label) {
        this._elFormTitle.innerHTML = state;
        this._elFormButton.innerHTML = state;
        this._elSpanLogin.innerHTML = sentence;
        this._elSpanLogin.dataset.jsSpanLogin = newState;
        this._elSpanPassword.innerHTML = label;
    }

    /**
     * Post the informations of the form in the DB and save the token created in the local storage. 
     * Then, redirect the user to the inventory page.
     * @param {string} e - The event.
     */
    async sendForm(e) {
        e.preventDefault();
        let email = this._elInputEmail.value;
        let password = this._elInputPassword.value;
        let route = this._elFormButton.innerHTML.toLowerCase();
        this.validateForm(email, password);
        try {
            const {data} = await axios.post(`/api/v1/auth/${route}`, { email, password });
            console.log('data', data);
            const token = data.user;
            const storage = new TokenStorage();
            storage.saveTokenLocalStorage(token);
            if (route === 'register' && token) {
                this._elSpanForm.innerHTML = 'Your account has been created. Please log in!'
            }
            if (token) {
                window.location.pathname = '/inventory.html';
            }
        } catch (error) {
            console.log(error);
            if (route == 'register') {
                this._elSpanForm.innerHTML = 'You already have an account with this email.';
            } else {
                this._elSpanForm.innerHTML = 'Wrong email or password.'
            }
        }
    }

    /**
     * Validate the authentification form.
     * Source : https://www.w3resource.com/javascript/form/email-validation.php
     * @param {string} mail - The email entered.
     * @param {string} password - The password entered.
     */
    validateForm(email, password) {
        this._elSpanForm.innerHTML = '';
        if (email == '' || password == '') {
            this._elSpanForm.innerHTML = 'Please fill in all the fields.';
        } else {
            let isEmailTrue = this.validateEmail(email);
            if (!isEmailTrue) {
                this._elSpanForm.innerHTML = 'Please enter a valid email.';
            }
            let isPasswordTrue = this.validatePassword(password);
            if (!isPasswordTrue) {
                this._elSpanForm.innerHTML = 'Please enter a valid password.';
            }
        }
        
    }

    /**
     * Validate the email entered by the user in the form.
     * Source : https://www.w3resource.com/javascript/form/email-validation.php
     * @param {string} mail - The email entered.
     */
    validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    {
        return (true)
    }
        return (false)
    }

    /**
     * Validate the password entered by the user in the form.
     * Source : https://www.w3resource.com/javascript/form/password-validation.php
     * @param {string} password - The password entered.
     */
    validatePassword(password) {
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password))
    {
        return (true)
    }
        return (false)
    }

}