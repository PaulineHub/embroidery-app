import CloneItem from './CloneItem.js';
import TokenStorage from "./TokenStorage.js";

export default class ThreadStorage {

    constructor() {
        this._elThreadBasketTemplate = document.querySelector('[data-js-thread-basket-template]');
        this._elThreadBoxTemplate = document.querySelector('[data-js-thread-box-template]');
        this._elBasketContainer = document.querySelector('[data-js-threads-wrapper="basket"]');
        this._elBoxContainer = document.querySelector('[data-js-threads-wrapper="box"]');

        this.url = '/api/v1/storedThreads';
        this.tokenStorage = new TokenStorage();
        this.token = this.tokenStorage.getLocalStorage()[0];

    }

    async displayStorage(storage) {
        // get the infos about the threads stored
        const {data} = await axios.get(`${this.url}?category=${storage}`,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        // get the chromatic order of the threads stored
        const threads = data.threads;
        let storedThreads = [];
        for (let thread in threads){
            const {data} = await axios.get(`/api/v1/threads?code=${threads[thread].threadCode}`);
            let infos = {
                id: threads[thread]._id,
                code: threads[thread].threadCode,
                order: data[0].order,
                quantity: threads[thread].quantity
            };
            storedThreads[thread] = infos;
        }
        // sort by chromatic order
        storedThreads.sort((a,b) => a.order - b.order);
        // display in the DOM
        for (let infos in storedThreads) {
            this.displayThread(storedThreads[infos], storage);
        }
    }

    async storeThread(e, quantity, containerFrom) {
        const storage = e.target.dataset.jsSubmitQuantity;
        const threadTitle = e.target.previousElementSibling.previousElementSibling;
        const code = threadTitle.dataset.jsCode;
        const id = threadTitle.dataset.jsId;
        const params = {
            category: storage,
            threadCode: code,
            quantity: quantity
        }
        // store the thread in the DB of the user
        const {data} = await axios.post(`${this.url}`, 
                        params,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        let infos = {
                id: data.storedThread._id,
                code: code,
                quantity:quantity
        };
        // display the stored thread in the DOM of the right container
        this.displayThread(infos, storage);
        // remove thread if it comes from shopping container et go to thread box
        if (containerFrom == 'basket') {
            const elThread = document.getElementById(`${id}`);
            this.deleteThread(this._elBasketContainer, elThread);
        }
    }

    displayThread(infos, storage) {
         let storageContainer;   
            let threadTemplate;
            if (storage == 'basket') {
                storageContainer = this._elBasketContainer;
                threadTemplate = this._elThreadBasketTemplate;
            }
            else {
                storageContainer = this._elBoxContainer;
                threadTemplate = this._elThreadBoxTemplate;
            }
            new CloneItem(infos, threadTemplate, storageContainer, this.token);
    }

    async deleteThread(container, thread) {
        //delete from DB
        await axios.delete(`${this.url}/${thread.id}`, 
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        //remove from DOM
        container.removeChild(thread);
    }

    async updateThread(e, quantity) {
        const threadTitle = e.target.previousElementSibling.previousElementSibling;
        const id = threadTitle.dataset.jsId;
        const params = {quantity};
        await axios.patch(`${this.url}/${id}`, 
                            params,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        // update quantity of the thread in the DOM
        const thread = document.getElementById(`${id}`);
        thread.dataset.jsThreadQuantity = quantity;
        const threadSpanQuantity = thread.querySelector('.quantity');
        threadSpanQuantity.innerHTML = quantity;
    }

    
}

