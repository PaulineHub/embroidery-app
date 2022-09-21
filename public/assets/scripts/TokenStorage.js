export default class TokenStorage {

    saveTokenLocalStorage(token) {
        const arrayLS = this.getLocalStorage('tokenList');
        arrayLS.push(token);
        localStorage.setItem('tokenList', JSON.stringify(arrayLS));
    }

    deleteTokenLocalStorage() {
        localStorage.setItem('tokenList', JSON.stringify([]));
    }

    getLocalStorage() {
       const dataLS = localStorage.getItem('tokenList');
        if (dataLS === null){
            return [];
        } else {
            return JSON.parse(dataLS);
        }
    }

}