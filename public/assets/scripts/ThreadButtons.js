import ThreadStorage from './ThreadStorage.js';

export default class ThreadButtons {

    constructor(el, token) {
        this._el = el;
        this._elShopBtn = this._el.querySelector('[data-js-storage="basket"]');
        this._elStoreBtn = this._el.querySelector('[data-js-storage="box"]');
        this._elDeleteBtn = this._el.querySelector('[data-js-delete]');

        this.storage = new ThreadStorage(this.token);
        this.token = token;

        this.init();
    }
    
    /***
     * Initiate behaviors by default 
     */
    init() {  

        this._elShopBtn.addEventListener('click', (e) => {
            this.storage.storeThread(e);
        });

        this._elStoreBtn.addEventListener('click', (e) => {
            this.storage.storeThread(e);
        });
        if (this._elDeleteBtn) { // no present on the threads in the color browser
            this._elDeleteBtn.addEventListener('click', (e) => {
                this.storage.deleteThread(e);
            });
        }

    }





}

