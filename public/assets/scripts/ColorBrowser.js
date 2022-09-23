import CloneItem from './CloneItem.js';
import ColorCarousel from './ColorCarousel.js';

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
            colorBtn.addEventListener('click', this.searchThreads.bind(this))
        })

        this._elBtnSearch.addEventListener('click', this.searchThreads.bind(this));

    }

    searchThreads(e) {
        const searchType = e.target.dataset.jsSearch;
        let queryValue;
        if (searchType == 'category') queryValue = e.target.dataset.jsCategory;
        else queryValue = this._elSearchInput.value;
        this.displaySearchedThreads(searchType, queryValue);
    }

    async displaySearchedThreads(searchType, queryValue) {
        this._elResultsContainer.innerHTML = '';
        this._elNoFound.classList.remove('active');
        if (searchType == 'category') this._elSearchInput.value = '';
        const threadsArray = await this.getSearchedThreads(searchType, queryValue);
        for (let thread in threadsArray) {
            let infos = {
                id:threadsArray[thread]._id,
                code:threadsArray[thread].code,
                order:threadsArray[thread].order
            }
            new CloneItem(infos, this._elThreadTemplate, this._elResultsContainer, this.token)
        }
        
    }

    async getSearchedThreads(queryKey, queryValue){
        const {data : threadArray} = await axios.get(`/api/v1/threads?${queryKey}=${queryValue}`);
        if(threadArray.length === 0) this._elNoFound.classList.add('active');
        else return threadArray;
    }



}

