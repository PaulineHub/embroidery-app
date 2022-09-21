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
            colorBtn.addEventListener('click', this.displayTreadsByColor.bind(this))
        })

        this._elBtnSearch.addEventListener('click', this.searchThreadByCode.bind(this));

    }

    async searchThreadByCode() {
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

    async getThreadByCode(codeSearched){
        const {data : DMCArray} = await axios.get(`/api/v1/threads?code=${codeSearched}`,{
                                                    headers: {
                                                        'Authorization': `Bearer ${this.token}`
                                                    }
                                                });
        const codeItem = DMCArray.filter(item => {
            return item.code === codeSearched;
        })
        if(codeItem.length === 0){
            this._elNoFound.classList.add('active');
        } else {
            return codeItem;
        }
    }

    async displayTreadsByColor(e) {
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
            const elShopBtn = elThreadItem.querySelector('[data-js-shop]');
            //const elStoreBtn = elThreadItem.querySelector('[data-js-store]');
            elShopBtn.addEventListener('click', this.addShopList.bind(this));
        })
        
    }

    addShopList() {
        console.log('click')
    }

    async getThreadsByCategory(id) {
        const { data : dmcArray } = await axios.get(`/api/v1/threads?category=${id}`,{
                                                    headers: {
                                                        'Authorization': `Bearer ${this.token}`
                                                    }
                                                });
        const categoryArray = dmcArray.filter(element => {
            return element.category === id;
        })
        return categoryArray;
    }

}

