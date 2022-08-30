//***CAROUSSEL***//

let counter = 0;
const carouselWidth = searchContainer.offsetWidth;
prevBtn.style.display = 'none';

nextBtn.addEventListener('click', ()=>{
    counter++;
    carousel();
});
prevBtn.addEventListener('click', ()=>{
    counter--;
    carousel();
});

function carousel(){
    if(carouselWidth === 900 && counter < 1){
        nextBtn.style.display = 'block';
    }else if(carouselWidth === 520 && counter < 2){
        nextBtn.style.display = 'block';
    }else{
        nextBtn.style.display = 'none';
    }
    if(counter > 0){
        prevBtn.style.display = 'block';
    }else{
        prevBtn.style.display = 'none';
    }
    if(carouselWidth === 900){
        colorsBtn.forEach(color =>{
            color.style.transform = `translateX(-${counter * 270}%)`;
        })
    }else if(carouselWidth === 520){
        colorsBtn.forEach(color =>{
            color.style.transform = `translateX(-${counter * 385}%)`;
        })
    }
}


//***TO DO ***/
//CSS ajout effet hover icones
//refactoriser add shop item add box item
//bug muted green
//generer les couleurs du nuancier automatiquement
