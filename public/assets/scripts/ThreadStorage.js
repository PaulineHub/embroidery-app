import CloneItem from './CloneItem.js';

export default class ThreadStorage {

    constructor(token) {
        this._elThreadTemplate = document.querySelector('[data-js-thread-template]');
        this._elBasketContainer = document.querySelector('[data-js-basket-container]');
        this._elBoxContainer = document.querySelector('[data-js-box-container]');

        this.token = token;

        // this.init();
    }
    
    /***
     * Initiate behaviors by default 
     */
    // init() {


    // }

    async displayStorage(storage) {
        const {data} = await axios.get(`/api/v1/storedThreads?category=${storage}`,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        console.log(data);
    }

    async storeThread(e) {
        let storageContainer;
        const storage = e.target.dataset.jsStorage;
        if (storage == 'basket') storageContainer = this._elBasketContainer;
        else storageContainer = this._elBoxContainer;
        const elThread = e.currentTarget.parentElement.parentElement.parentElement;
        const code = elThread.querySelector(".item-code").innerHTML;
        const order = elThread.dataset.colorOrder;
        const params = {
            category: storage,
            threadCode: code
        }
        await axios.post(`/api/v1/storedThreads`, 
                        params,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        let infos = {
                code: code,
                order: order
            }
        new CloneItem(infos, this._elThreadTemplate, storageContainer);
    }

    
}

