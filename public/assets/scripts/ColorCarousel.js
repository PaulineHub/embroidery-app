import CloneItem from './CloneItem.js';

export default class ColorCarousel {

    constructor(widthFirstPart=780, widthSecondPart=520, percentage1=615, percentage2=670) {
        this._elSearchContainer = document.querySelector('.search-container');
        this._elColorsContainer = this._elSearchContainer.querySelector('[data-js-colors-container]');
        this._elColorCircleTemplate = this._elSearchContainer.querySelector('[data-js-color-circle-template]');
        this._elPrevBtn = this._elSearchContainer.querySelector('.fa-chevron-left');
        this._elNextBtn = this._elSearchContainer.querySelector('.fa-chevron-right');

        this.colorsName = ['red', 'orange', 'yellow', 'khaki', 'green', 'teal', 'blue', 'purple', 'pink', 'brown', 'light', 'dark'];
        this.counter = 0;
        this.carouselWidth = this._elSearchContainer.offsetWidth;
        this._elPrevBtn.style.display = 'none';

        this.widthFirstPart = widthFirstPart;
        this.widthSecondPart = widthSecondPart;
        this.percentage1 = percentage1;
        this.percentage2 = percentage2;

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
        if (this.carouselWidth === this.widthFirstPart && this.counter < 1) {
            this._elNextBtn.style.display = 'block';
        } else if (this.carouselWidth === this.widthSecondPart && this.counter < 2) {
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
        if (this.carouselWidth === this.widthFirstPart) {
            elcolorBtns.forEach(color => {
                color.style.transform = `translateX(-${this.counter * this.percentage1}%)`;
            })
        } else if (this.carouselWidth === this.widthSecondPart) {
            elcolorBtns.forEach(color => {
                color.style.transform = `translateX(-${this.counter * this.percentage2}%)`;
            })
        }
    }
}

