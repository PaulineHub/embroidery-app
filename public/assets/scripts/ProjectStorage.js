import CloneItem from './CloneItem.js';
import reqInstanceAuth from "./InstanceAxios.js";

export default class ProjectStorage {

    constructor() {
        this._elProjectTemplate = document.querySelector('[data-js-thread-basket-template]');
        this._elProjectsContainer = document.querySelector('[data-js-threads-wrapper="basket"]');

        this.axiosInstanceAuth = reqInstanceAuth;

    }

    /**
     * Display the storage in the DOM.
     * @param {string} storage - The name of the storage (box of threads or shopping basket).
     */
    async displayStorage(storage) {
        // get the infos about the threads stored
        const {data} = await this.axiosInstanceAuth.get(`/api/v1/storedThreads?category=${storage}`);
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

    /**
     * Display the storage in the DOM.
     * @param {string} e - Event.
     * @param {number} quantity - Quantity of threads.
     * @param {string} containerFrom - The name of the storage (box of threads or shopping basket) the thread comes from.
     */
    async storeThread(e, quantity, containerFrom) {
        const storage = e.target.dataset.jsSubmitQuantity;
        const threadTitle = e.target.previousElementSibling.previousElementSibling;
        const code = threadTitle.dataset.jsCode;
        const id = threadTitle.dataset.jsId;
        const params = {
            category: storage,
            threadCode: code,
            quantity: quantity
        };
        // store the thread in the DB of the user
        const {data} = await this.axiosInstanceAuth.post(`/api/v1/storedThreads`, params);
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

    /**
     * Display the thread in the DOM.
     * @param {object} infos - Infos of the thread.
     * @param {string} storage - The name of the storage (box of threads or shopping basket) where to put the thread.
     */
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

    /**
     * Delete the thread.
     * @param {string} container - The name of the storage (box of threads or shopping basket) the thread comes from.
     * @param {string} thread - The thread.
     */
    async deleteThread(container, thread) {
        //delete from DB
        await this.axiosInstanceAuth.delete(`/api/v1/storedThreads/${thread.id}`);
        //remove from DOM
        container.removeChild(thread);
    }

    /**
     * Update the thread.
     * @param {string} e - Event.
     * @param {number} quantity - The quantity of threads.
     */
    async updateThread(e, quantity) {
        const threadTitle = e.target.previousElementSibling.previousElementSibling;
        const id = threadTitle.dataset.jsId;
        const params = {quantity};
        // update quantity of the thread in the DB
        await this.axiosInstanceAuth.patch(`/api/v1/storedThreads/${id}`, params);
        // update quantity of the thread in the DOM
        const thread = document.getElementById(`${id}`);
        thread.dataset.jsThreadQuantity = quantity;
        const threadSpanQuantity = thread.querySelector('.quantity');
        threadSpanQuantity.innerHTML = quantity;
    }

    
}

