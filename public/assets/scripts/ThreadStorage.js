import CloneItem from './CloneItem.js';
import TokenStorage from "./TokenStorage.js";

export default class ThreadStorage {

    constructor() {
        this._elThreadBasketTemplate = document.querySelector('[data-js-thread-basket-template]');
        this._elThreadBoxTemplate = document.querySelector('[data-js-thread-box-template]');
        this._elThreadProjectTemplate = document.querySelector('[data-js-thread-project-template]');
        this._elBasketContainer = document.querySelector('[data-js-threads-wrapper="basket"]');
        this._elBoxContainer = document.querySelector('[data-js-threads-wrapper="box"]');
        this._elProjectContainer = document.querySelector('[data-js-threads-wrapper="project"]');

        this.url = '/api/v1/storedThreads';
        this.tokenStorage = new TokenStorage();
        this.token = this.tokenStorage.getLocalStorage()[0];
    }

    async displayStorage(storage, projectId) {
        // get the threads stored
        let data = await this.getThreadsStored(storage, projectId);
        // get the infos about the threads stored
        let storedThreads = [];
        const dataThreads = data.data.threads;
        for (let thread in dataThreads) {
            let infos = {
                id: dataThreads[thread]._id,
                code: dataThreads[thread].threadCode,
                quantity: dataThreads[thread].quantity
            };
            infos['basketQuantity'] = await this.getThreadQuantity(dataThreads[thread].threadCode, 'basket');
            infos['boxQuantity'] = await this.getThreadQuantity(dataThreads[thread].threadCode, 'box');
            infos['order'] = await this.getThreadOrder(dataThreads[thread].threadCode);
            storedThreads[thread] = infos;
        }
        // sort by chromatic order
        storedThreads.sort((a,b) => a.order - b.order);
        // display in the DOM
        for (let thread in storedThreads) {
            this.displayThread(storedThreads[thread], storage);
        }
    }

    async getThreadsStored(storage, projectId) {
        let data;
        if (projectId) {
            data = await axios.get(`${this.url}?category=${storage}&projectId=${projectId}`,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        } else {
            data = await axios.get(`${this.url}?category=${storage}`,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        }
        return data;
    }

    async getThreadQuantity(code, category) {
        let quantity;
        let {data:{threads}} = await axios.get(`${this.url}?threadCode=${code}&category=${category}`, {
                                headers: {'Authorization': `Bearer ${this.token}`}
                            });
        if (threads.length === 0) quantity =  0;
        else quantity = threads[0].quantity;
        return quantity;
    }

    async getThreadOrder(code) {
        const {data} = await axios.get(`/api/v1/threads?code=${code}`);
        return data[0].order;
    }

    async storeThread(e, quantity, containerFrom, projectId) {
        const storage = e.target.dataset.jsSubmitBtn;
        const threadTitle = e.target.previousElementSibling.previousElementSibling;
        const code = threadTitle.dataset.jsCode;
        const id = threadTitle.dataset.jsId;
        let params = {
            category: storage,
            threadCode: code,
            quantity
        }
        // if thread added to a project, add the project's id to params
        if (projectId) params['projectId'] = projectId;
        // store the thread in the DB of the user
        const {data} = await axios.post(`${this.url}`, 
                        params,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        let infos = {
                id: data.storedThread._id,
                code,
                quantity
        };
        infos['basketQuantity'] = await this.getThreadQuantity(code, 'basket');
        infos['boxQuantity'] = await this.getThreadQuantity(code, 'box');
        // display the stored thread in the DOM of the right container
        this.displayThread(infos, storage);
        // remove thread if it comes from shopping container et go to thread box
        if (containerFrom == 'basket') {
            const elThread = document.getElementById(`${id}`);
            this.deleteThread(elThread.id);
            this.removeThreadFromDOM(elThread, this._elBasketContainer)
        }
    }

    displayThread(infos, storage) {
        let storageContainer;   
            let threadTemplate;
            if (storage == 'basket') {
                storageContainer = this._elBasketContainer;
                threadTemplate = this._elThreadBasketTemplate;
            }
            else if (storage == 'box'){
                storageContainer = this._elBoxContainer;
                threadTemplate = this._elThreadBoxTemplate;
            }
            else {
                storageContainer = this._elProjectContainer;
                threadTemplate = this._elThreadProjectTemplate;
            }
            new CloneItem(infos, threadTemplate, storageContainer);
    }

    async deleteThread(threadId) {
        await axios.delete(`${this.url}/${threadId}`, 
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
    }

    removeThreadFromDOM(thread, container) {
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

