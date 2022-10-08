import TokenStorage from './TokenStorage.js';

export default class Navigation {

    constructor() {
        this._elLogoutBtn = document.querySelector('[data-js-logout-btn]');

        this.init();
    }

    /***
     * Initiate behaviors by default (listen event on logout button).
     */
    init() {
        this._elLogoutBtn.addEventListener('click', this.logout.bind(this));
    }

    /***
     * Logout the user by deleting his/her token from the local storage.
     */
    logout() {
        const storage = new TokenStorage();
        storage.deleteTokenLocalStorage();
        window.location.pathname = '/index.html';
    }

}