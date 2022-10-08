import CloneItem from './CloneItem.js';
import ColorCarousel from './ColorCarousel.js';
import ThreadStorage from './ThreadStorage.js';

export default class ColorBrowser {

    constructor() {
        this._elSearchContainer = document.querySelector('.search-container');
        this._elResultsContainer = document.querySelector(".thread-items-wrapper");
        this._elThreadTemplate = document.querySelector('[data-js-thread-template]');
        this._elNoFound = document.querySelector('.no-found');
        this._elSearchInput = document.querySelector(".search-term");
        this._elBtnSearch = document.getElementById("search");

        this.url = '/api/v1/threads';
        this.init();
    }
    
    /***
     * Initiate behaviors by default (create a color carousel, 
     * listen event on color button and search button).
     */
    init() {
        new ColorCarousel();

        const elcolorBtns = this._elSearchContainer.querySelectorAll(".color-circle-wrapper");
        elcolorBtns.forEach(colorBtn => {
            colorBtn.addEventListener('click', this.searchThreads.bind(this))
        })

        this._elBtnSearch.addEventListener('click', this.searchThreads.bind(this));
    }

    /**
     * Search threads by color (category) or code.
     * @param {string} e - The event.
     */
    searchThreads(e) {
        const searchType = e.target.dataset.jsSearch;
        let queryValue;
        if (searchType == 'category') queryValue = e.target.dataset.jsCategory;
        else queryValue = this._elSearchInput.value;
        this.displaySearchedThreads(searchType, queryValue);
    }

    /**
     * Display threads found in the DOM or a 'not found' message.
     * @param {string} searchType - The type of research (by category or code).
     * @param {string} queryValue - The color or code searched.
     */
    async displaySearchedThreads(searchType, queryValue) {
        this._elResultsContainer.innerHTML = '';
        this._elNoFound.classList.remove('active');
        if (searchType == 'category') this._elSearchInput.value = '';
        const threadsArray = await this.getSearchedThreads(searchType, queryValue);
        if(threadsArray.length === 0) {
            this._elNoFound.classList.add('active');
        } else {
            const storage = new ThreadStorage();
            const threads = await storage.getAllThreadsStored();
            for (let thread in threadsArray) {
                let infos = {
                    id:threadsArray[thread]._id,
                    code:threadsArray[thread].code,
                    order:threadsArray[thread].order
                }
                infos['basketQuantity'] = storage.getThreadQuantityByStorage(threadsArray[thread].code, 'basket', threads).quantity;
                infos['boxQuantity'] = storage.getThreadQuantityByStorage(threadsArray[thread].code, 'box', threads).quantity;
                new CloneItem(infos, this._elThreadTemplate, this._elResultsContainer);
            }
        }
    }

    /**
     * Get the searched threads.
     * @param {string} queryKey - The type of research (by category or code).
     * @param {string} queryValue - The color or code searched.
     */
    async getSearchedThreads(queryKey, queryValue){
        let params = {};
        params[queryKey] = queryValue;
        const {data : threadsArray} = await axios.get(`${this.url}`, {params});
        return threadsArray;
    }



}

