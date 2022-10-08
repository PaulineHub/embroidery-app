export default class TokenStorage {

    /**
     * Save the token in the Local Storage.
     * @param {string} token - Token.
     */
    saveTokenLocalStorage(token) {
        const arrayLS = this.getLocalStorage('tokenList');
        arrayLS.push(token);
        localStorage.setItem('tokenList', JSON.stringify(arrayLS));
    }

    /**
     * Delete the token from the Local Storage.
     */
    deleteTokenLocalStorage() {
        localStorage.setItem('tokenList', JSON.stringify([]));
    }

    /**
     * Get the token in the Local Storage.
     */
    getLocalStorage() {
       const dataLS = localStorage.getItem('tokenList');
        if (dataLS === null){
            return [];
        } else {
            return JSON.parse(dataLS);
        }
    }

}