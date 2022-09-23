import CloneItem from './CloneItem.js';
import TokenStorage from "./TokenStorage.js";

export default class ThreadStorage {

    constructor(token) {
        this._elThreadTemplate = document.querySelector('[data-js-thread-template]');
        this._elBasketContainer = document.querySelector('[data-js-threads-wrapper="basket"]');
        this._elBoxContainer = document.querySelector('[data-js-threads-wrapper="box"]');

        this.tokenStorage = new TokenStorage();
        this.token = this.tokenStorage.getLocalStorage()[0];

    }

    async displayStorage(storage) {
        const {data} = await axios.get(`/api/v1/storedThreads?category=${storage}`,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        const threads = data.threads;
        for (let thread in threads){
            console.log(threads[thread])
            const {data} = await axios.get(`/api/v1/threads?code=${threads[thread].threadCode}`);
            let infos = {
                id: threads[thread]._id,
                code: data[0].code,
                order: data[0].order
            };
            let storageContainer;
            if (storage == 'basket') storageContainer = this._elBasketContainer;
            else storageContainer = this._elBoxContainer
            new CloneItem(infos, this._elThreadTemplate, storageContainer, this.token);
        }

    }

    async storeThread(e) {
        let storageContainer;
        const storage = e.target.dataset.jsStorage;
        if (storage == 'basket') storageContainer = this._elBasketContainer;
        else storageContainer = this._elBoxContainer
        const elThread = e.currentTarget.parentElement.parentElement.parentElement;
        const code = elThread.querySelector(".item-code").innerHTML;
        const order = elThread.dataset.colorOrder;
        const params = {
            category: storage,
            threadCode: code
        }
        const {data} = await axios.post(`/api/v1/storedThreads`, 
                        params,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        let infos = {
                id: data.storedThread._id,
                code: code,
                order: order
        };
        new CloneItem(infos, this._elThreadTemplate, storageContainer, this.token);
    }

    async deleteThread(e) {
        // const container = e.target.parentElement.parentElement.parentElement.parentElement;
        // const containerType = container.dataset.jsThreadsWrapper;
        const threadId = e.target.parentElement.parentElement.parentElement.id;
        await axios.delete(`/api/v1/storedThreads/${threadId}`, 
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
    }

    
}

