import CloneItem from './CloneItem.js';

export default class ColorBrowser {

    constructor() {
        this._elSearchContainer = document.querySelector('.search-container');
        this._elColorsContainer = this._elSearchContainer.querySelector('[data-js-colors-container]');
        this._elColorCircleTemplate = this._elSearchContainer.querySelector('[data-js-color-circle-template]');
        this._elPrevBtn = this._elSearchContainer.querySelector('.fa-chevron-left');
        this._elNextBtn = this._elSearchContainer.querySelector('.fa-chevron-right');
        this._elResultsContainer = document.querySelector(".thread-items-wrapper");
        this._elThreadTemplate = document.querySelector('[data-js-thread-template]');
        this._elNoFound = document.querySelector('.no-found');
        this._elSearchInput = document.querySelector(".search-term");
        this._elBtnSearch = document.getElementById("search");

        this.colorsName = ['red', 'orange', 'yellow', 'khaki', 'green', 'teal', 'blue', 'purple', 'pink', 'brown', 'light', 'dark'];
        this.counter = 0;
        this.carouselWidth = this._elSearchContainer.offsetWidth;
        this._elPrevBtn.style.display = 'none';

        this.init();
    }
    
    /***
     * Initiate behaviors by default (create colors options, 
     * event listeners when click on buttons next and previous)
     */
    init() {
        this.createColorCircles();

        this._elNextBtn.addEventListener('click', () => {
            this.counter++;
            this.moveCarousel();
        });
        this._elPrevBtn.addEventListener('click', () => {
            this.counter--;
            this.moveCarousel();
        });

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
        console.log(threadByCode)
        let infos = {
                code:threadByCode[0].code,
                order:threadByCode[0].order
            }
        new CloneItem(infos, this._elThreadTemplate, this._elResultsContainer);
    }

    async getThreadByCode(codeSearched){
        const {data : DMCArray} = await axios.get(`/api/v1/threads?code=${codeSearched}`);
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
        
    }

    async getThreadsByCategory(id) {
        const { data : dmcArray } = await axios.get(`/api/v1/threads?category=${id}`);
        const categoryArray = dmcArray.filter(element => {
            return element.category === id;
        })
        return categoryArray;
    }

    /***
     * Create colors options.
     */
    createColorCircles() {
        for (let name in this.colorsName) {
            let infos = {color:this.colorsName[name]};
            new CloneItem(infos, this._elColorCircleTemplate, this._elColorsContainer);
        }
    }
    
    /**
     * Move the colors in the carousel horizontaly and display buttons next and previous if needed
     */
    moveCarousel() {
        // Display buttons
        if (this.carouselWidth === 780 && this.counter < 1) {
            this._elNextBtn.style.display = 'block';
        } else if (this.carouselWidth === 520 && this.counter < 2) {
            this._elNextBtn.style.display = 'block';
        } else {
            this._elNextBtn.style.display = 'none';
        }
        if (this.counter > 0){
            this._elPrevBtn.style.display = 'block';
        } else {
            this._elPrevBtn.style.display = 'none';
        }
        // Move colors of the carousel
        const elcolorBtns = this._elSearchContainer.querySelectorAll(".color-circle-wrapper");
        if (this.carouselWidth === 780) {
            elcolorBtns.forEach(color => {
                color.style.transform = `translateX(-${this.counter * 615}%)`;
            })
        } else if (this.carouselWidth === 520) {
            elcolorBtns.forEach(color => {
                color.style.transform = `translateX(-${this.counter * 670}%)`;
            })
        }
    }
}

