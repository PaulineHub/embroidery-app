import CloneItem from './CloneItem.js';
import ColorCarousel from './ColorCarousel.js';
import ThreadStorage from './ThreadStorage.js';

export default class ColorBrowser {

    constructor(token) {
        this._elSearchContainer = document.querySelector('.search-container');
        this._elResultsContainer = document.querySelector(".thread-items-wrapper");
        this._elThreadTemplate = document.querySelector('[data-js-thread-template]');
        this._elNoFound = document.querySelector('.no-found');
        this._elSearchInput = document.querySelector(".search-term");
        this._elBtnSearch = document.getElementById("search");

        this.token = token;

        this.init();
    }
    
    /***
     * Initiate behaviors by default 
     */
    init() {
        new ColorCarousel();

        const elcolorBtns = this._elSearchContainer.querySelectorAll(".color-circle-wrapper");
        elcolorBtns.forEach(colorBtn => {
            colorBtn.addEventListener('click', this.displayThreadsByColor.bind(this))
        })

        this._elBtnSearch.addEventListener('click', this.displayThreadByCode.bind(this));

    }

    async displayThreadByCode() {
        this._elResultsContainer.innerHTML = '';
        this._elNoFound.classList.remove('active');
        const codeValue = this._elSearchInput.value;
        const threadByCode = await this.getThreadByCode(codeValue);
        let infos = {
                code:threadByCode[0].code,
                order:threadByCode[0].order
            }
        new CloneItem(infos, this._elThreadTemplate, this._elResultsContainer);
    }

    async displayThreadsByColor(e) {
        this._elResultsContainer.innerHTML = '';
        this._elNoFound.classList.remove('active');
        this._elSearchInput.value = '';
        const colorCategory = e.currentTarget.dataset.id;
        const threadsArray = await this.getThreadsByCategory(colorCategory);
        for (let thread in threadsArray) {
            let infos = {
                code:threadsArray[thread].code,
                order:threadsArray[thread].order
            }
            new CloneItem(infos, this._elThreadTemplate, this._elResultsContainer)
        }
        const elThreadItems = this._elResultsContainer.querySelectorAll('.thread-item');
        elThreadItems.forEach(elThreadItem => {
            const elShopBtn = elThreadItem.querySelector('[data-js-storage="basket"]');
            //const elStoreBtn = elThreadItem.querySelector('[data-js-store]');
            elShopBtn.addEventListener('click', (e) => {
                const storage = new ThreadStorage(this.token);
                storage.storeThread(e);
            });
        })
        
    }

    async getThreadByCode(codeSearched){
        const {data : threadArray} = await axios.get(`/api/v1/threads?code=${codeSearched}`);
        if(threadArray.length === 0) this._elNoFound.classList.add('active');
        else return threadArray;
    }

    async getThreadsByCategory(color) {
        const { data : threadArray } = await axios.get(`/api/v1/threads?category=${color}`);
        return threadArray;
    }

}

