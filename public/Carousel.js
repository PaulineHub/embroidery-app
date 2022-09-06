export default class Carousel {

    constructor(el) {
        this._el = el;
        this._elPrevBtn = el.querySelector('.fa-chevron-left');
        this._elNextBtn = el.querySelector('.fa-chevron-right');
        this._elcolorBtns = el.querySelectorAll(".color-circle");

        this.counter = 0;
        this.carouselWidth = el.offsetWidth;
        this._elPrevBtn.style.display = 'none';

        this.init();
    }
    
    /***
     * Initiate behaviors by default (event listeners when click on buttons next and previous)
     */
    init() {
        this._elNextBtn.addEventListener('click', () => {
            this.counter++;
            this.moveCarousel();
        });
        this._elPrevBtn.addEventListener('click', () => {
            this.counter--;
            this.moveCarousel();
        });
    }
    
    /**
     * Move the colors in the carousel horizontaly and display buttons next and previous if needed
     */
    moveCarousel() {
        // Display buttons
        if (this.carouselWidth === 900 && this.counter < 1) {
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
        if (this.carouselWidth === 900) {
            this._elcolorBtns.forEach(color =>{
                color.style.transform = `translateX(-${this.counter * 270}%)`;
            })
        } else if (this.carouselWidth === 520) {
            this._elcolorBtns.forEach(color =>{
                color.style.transform = `translateX(-${this.counter * 385}%)`;
            })
        }
    }
}

