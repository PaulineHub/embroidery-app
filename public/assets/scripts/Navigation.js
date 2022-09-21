import TokenStorage from './TokenStorage.js';

export default class Navigation {

    constructor() {
        this._elLogoutBtn = document.querySelector('[data-js-logout-btn]');

        this.init();
    }

    init() {
        this._elLogoutBtn.addEventListener('click', this.logout.bind(this));
    }

    logout() {
        const storage = new TokenStorage();
        storage.deleteTokenLocalStorage();
        window.location.pathname = '/index.html';
    }

}