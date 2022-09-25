import ThreadStorage from './ThreadStorage.js';
import CloneItem from './CloneItem.js';

export default class ThreadButtons {

    constructor(el, token) {
        this._el = el;
        this._elShopBtn = this._el.querySelector('[data-js-basket-btn]');
        this._elStoreBtn = this._el.querySelector('[data-js-box-btn]');
        this._elDeleteBtn = this._el.querySelector('[data-js-delete]');
        this._elQuantityBtn = this._el.querySelector('[data-js-quantity]');
        this._elQuantityWindowTemplate = document.querySelector('[data-js-quantity-window-template]');
        this._elMainBlock = document.querySelector('main');

        this.storage = new ThreadStorage(this.token);
        this.token = token;

        this.init();
    }
    
    /***
     * Initiate behaviors by default 
     */
    init() {  

        if (this._elShopBtn) {
            this._elShopBtn.addEventListener('click', (e) => {
                this.displayQuantityWindow(e, 'Add to my shopping basket');
            });
        }

        if (this._elStoreBtn) {
            this._elStoreBtn.addEventListener('click', (e) => {
                this.displayQuantityWindow(e, 'Add to my thread box');
            });
        }

        if (this._elDeleteBtn) {
            this._elDeleteBtn.addEventListener('click', (e) => {
                const thread = e.target.parentElement.parentElement.parentElement.parentElement;
                const container = thread.parentElement;
                this.storage.deleteThread(container, thread);
            });
        }

        if (this._elQuantityBtn) { 
            this._elQuantityBtn.addEventListener('click', (e) => {
                this.displayQuantityWindow(e, 'Update quantity');
            });
        }
    }

    displayQuantityWindow(e, actionString) {
        const storage = e.target.dataset.jsStorage;
        const thread = e.target.parentElement.parentElement.parentElement.parentElement;
        const threadQuantity = parseInt(thread.dataset.jsThreadQuantity);
        const threadWrapper = thread.parentElement;
        const threadWrapperValue = threadWrapper.dataset.jsThreadsWrapper;
        let storageName;
        if ( threadWrapperValue == 'basket') storageName = 'Shopping Basket';
        else if (threadWrapperValue == 'box') storageName = 'Thread Box';
        else storageName = 'Color Browser';
        let infos = {
                id: thread.id,
                code:  this._el.querySelector(".item-code").innerHTML,
                storageFromString: storageName,
                quantity: threadQuantity,
                storageTo: storage,
                action: actionString
        };
        new CloneItem(infos, this._elQuantityWindowTemplate, this._elMainBlock, this.token);
        this.listenQuantityWindowBtns(threadWrapperValue);
    }

    listenQuantityWindowBtns(containerFrom) {
        // listen close btn
        const elCloseWindowBtn = document.querySelector('[data-js-close-window]');
        elCloseWindowBtn.addEventListener('click', this.closeQuantityWindow.bind(this));
        // listen submit btn
        const elSubmitQuantityBtn = document.querySelector('[data-js-submit-quantity]');
        elSubmitQuantityBtn.addEventListener('click', (e) => {     
            let quantity = parseInt(document.querySelector('[data-js-quantity-input]').value);
            this.storage.storeThread(e, quantity, containerFrom);
            this.closeQuantityWindow();
        });
    }

    closeQuantityWindow() {
        const elQuantityWindow = document.querySelector('[data-js-quantity-window]');
        this._elMainBlock.removeChild(elQuantityWindow);
    }

}

