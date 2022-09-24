import CloneItem from './CloneItem.js';
import TokenStorage from "./TokenStorage.js";

export default class ThreadStorage {

    constructor() {
        this._elThreadStoredTemplate = document.querySelector('[data-js-thread-stored-template]');
        this._elBasketContainer = document.querySelector('[data-js-threads-wrapper="basket"]');
        this._elBoxContainer = document.querySelector('[data-js-threads-wrapper="box"]');

        this.tokenStorage = new TokenStorage();
        this.token = this.tokenStorage.getLocalStorage()[0];

    }

    async displayStorage(storage) {
        // get the code of the threads stored
        const {data} = await axios.get(`/api/v1/storedThreads?category=${storage}`,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        // get the infos about the threads stored
        const threads = data.threads;
        let storedThreads = [];
        for (let thread in threads){
            const {data} = await axios.get(`/api/v1/threads?code=${threads[thread].threadCode}`);
            let infos = {
                id: threads[thread]._id,
                code: data[0].code,
                order: data[0].order
            };
            storedThreads[thread] = infos;
        }
        // sort by chromatic order
        storedThreads.sort((a,b) => a.order - b.order);
        // display in the DOM
        for (let infos in storedThreads) {
            let storageContainer;
            if (storage == 'basket') storageContainer = this._elBasketContainer;
            else storageContainer = this._elBoxContainer
            new CloneItem(storedThreads[infos], this._elThreadStoredTemplate, storageContainer, this.token);
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
        // store the thread in the DB of the user
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
        // display the stored thread in the DOM of the right container
        new CloneItem(infos, this._elThreadStoredTemplate, storageContainer, this.token);
    }

    async deleteThread(e) {
        const container = e.target.parentElement.parentElement.parentElement.parentElement;
        const thread = e.target.parentElement.parentElement.parentElement;
        //delete from DB
        await axios.delete(`/api/v1/storedThreads/${thread.id}`, 
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        //remove from DOM
        container.removeChild(thread);
    }

    
}

