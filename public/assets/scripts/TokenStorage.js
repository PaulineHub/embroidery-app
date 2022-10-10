export default class TokenStorage {

    /**
     * Save the token in the Local Storage.
     * @param {string} token - Token.
     */
    saveTokenLocalStorage(token) {
        localStorage.setItem('tokenString', token);
    }

    /**
     * Delete the token from the Local Storage.
     */
    deleteTokenLocalStorage() {
        localStorage.deleteItem('tokenString')
    }

    /**
     * Get the token in the Local Storage.
     */
    getLocalStorage() {
       return localStorage.getItem('tokenString');
    }

}