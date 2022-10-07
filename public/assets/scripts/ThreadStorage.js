import CloneItem from './CloneItem.js';
import reqInstanceAuth from "./InstanceAxios.js";

export default class ThreadStorage {

    constructor() {
        this._elThreadBasketTemplate = document.querySelector('[data-js-thread-basket-template]');
        this._elThreadBoxTemplate = document.querySelector('[data-js-thread-box-template]');
        this._elThreadProjectTemplate = document.querySelector('[data-js-thread-project-template]');
        this._elBasketContainer = document.querySelector('[data-js-threads-wrapper="basket"]');
        this._elBoxContainer = document.querySelector('[data-js-threads-wrapper="box"]');
        this._elProjectContainer = document.querySelector('[data-js-threads-wrapper="project"]');

        this.url = '/api/v1/storedThreads';
        this.axiosInstanceAuth = reqInstanceAuth;

    }

    async displayStorage(storage, projectId) {
        // get all the threads stored by the user
        const threads = await this.getAllThreadsStored();
        let threadsInStorage = threads.filter(thread => thread.category === storage);
        if (projectId) {
            threadsInStorage = threadsInStorage.filter(thread => thread.projectId === projectId);
        }
        // get the infos about the threads stored
        let storedThreads = [];
        for (let thread in threadsInStorage) {
            let infos = {
                id: threadsInStorage[thread]._id,
                code: threadsInStorage[thread].threadCode,
                quantity: threadsInStorage[thread].quantity
            };
            infos['basketQuantity'] = this.getThreadQuantityByStorage(threadsInStorage[thread].threadCode, 'basket', threads).quantity;
            infos['boxQuantity'] = this.getThreadQuantityByStorage(threadsInStorage[thread].threadCode, 'box', threads).quantity;
            infos['order'] = await this.getThreadOrder(threadsInStorage[thread].threadCode);
            storedThreads[thread] = infos;
        }
        // sort by chromatic order
        storedThreads.sort((a,b) => a.order - b.order);
        // display in the DOM
        for (let thread in storedThreads) {
            this.displayThread(storedThreads[thread], storage);
        }
    }

    async getAllThreadsStored() {
        let {data:{threads}} = await this.axiosInstanceAuth.get(`${this.url}`);
        return threads;
    }

    async getAllThreadsStoredByCode(threadCode) {
        //const params = {threadCode}
        let {data:{threads}} = await this.axiosInstanceAuth.get(`${this.url}?threadCode=${threadCode}`, // pk ne marche pas avec params ???????????
                       // params,
                        );
        return threads;
    }

    getThreadQuantityByStorage(code, category, threadsArray) {
        let infos = {
            id: '',
            quantity: 0
        };
        let threadsByCodeAndStorage = threadsArray.filter(thread => thread.category === category && thread.threadCode === code);
        if (threadsByCodeAndStorage.length > 0) {
            infos = {
                id: threadsByCodeAndStorage[0]._id,
                quantity: threadsByCodeAndStorage[0].quantity
            };
        }
        return infos; 
    }

    async getThreadOrder(code) {
        const params = {code};
        const {data} = await axios.get(`/api/v1/threads`, {params});
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
        // check if thread already stored
        const threads = await this.getAllThreadsStored();
        const threadInfos = this.getThreadQuantityByStorage(code, `${storage}`, threads);
        if (threadInfos.quantity > 0) {
            let newQuantity = threadInfos.quantity + quantity;
            this.updateStoredThread(threadInfos.id, newQuantity);
        } else {
            // if thread added to a project, add the project's id to params
            if (projectId) params['projectId'] = projectId;
            // store the thread in the DB of the user
            const storedThread = await this.createStoredThread(params);
            // display the stored thread in the DOM of the right container
            let infos = {
                    id: storedThread._id,
                    code,
                    quantity
            };
            infos['basketQuantity'] = this.getThreadQuantityByStorage(code, 'basket', threads).quantity;
            infos['boxQuantity'] = this.getThreadQuantityByStorage(code, 'box', threads).quantity;
            this.displayThread(infos, storage);
        }
        // remove thread if it comes from shopping container et put it in thread box
        if (containerFrom == 'basket') {
            const elThread = document.getElementById(`${id}`);
            this.deleteStoredThread(elThread.id);
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

    async createStoredThread(params) {
        const {data:{storedThread}} = await this.axiosInstanceAuth.post(`${this.url}`, params);
        return storedThread;
    }

    async deleteStoredThread(threadId) {
        await this.axiosInstanceAuth.delete(`${this.url}/${threadId}`);
    }

    removeThreadFromDOM(thread, container) {
        container.removeChild(thread);
    }

    async updateStoredThread(id, quantity) {
        const params = {quantity};
        await this.axiosInstanceAuth.patch(`${this.url}/${id}`, params);
        this.updateQuantityIndicators(id, quantity);
    }

    async updateQuantityIndicators(threadId, quantity) {
        //update thread main quantity indicator
        const elThread = document.getElementById(`${threadId}`);
        elThread.dataset.jsThreadQuantity = quantity;
        const threadSpanQuantity = elThread.querySelector('.quantity');
        threadSpanQuantity.innerHTML = quantity;
        // update box and basket tiny quantity indicators (hovered) for each thread with that code on the page
        const code = elThread.querySelector('.item-code').innerHTML;
        const dataThreads = await this.getAllThreadsStoredByCode(code);
        const basketQuantity = this.getThreadQuantityByStorage(code, 'basket', dataThreads).quantity;
        const boxQuantity = this.getThreadQuantityByStorage(code, 'box', dataThreads).quantity;
        const elThreadsInfo = document.querySelectorAll(`[data-js-code="${code}"]`);
        elThreadsInfo.forEach(elThreadInfo => {
            const elBoxQuantIndicator = elThreadInfo.querySelector('[data-js-quantity-indicator="box"]');
            const elBasketQuantIndicator = elThreadInfo.querySelector('[data-js-quantity-indicator="basket"]');
            elBoxQuantIndicator.innerHTML = boxQuantity;
            elBasketQuantIndicator.innerHTML = basketQuantity;
        })
        
    }

    
}

