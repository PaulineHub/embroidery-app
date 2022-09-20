//***SELECT ITEMS***//

const shoppingContainer = document.querySelector('.shopping-items-wrapper');
const boxContainer = document.querySelector('.box-items-wrapper');

//add item
function addItem(arr, container,destination){
    for(let i = 0; i < arr.length; i++){
        const threadItem = document.createElement("div");
        threadItem.classList.add("thread-item");
        threadItem.dataset.colorOrder = `${arr[i].order}`;
        threadItem.innerHTML = `<div class="item-background">
                                    <img class="img-color-thread" src="https://static1.dmc.com/cache/1/1/117mc_e_${arr[i].code}_swatch_150x150.jpg" alt="">
                                    <button class="clear"><i class="fas fa-times"></i></button>
                                    <div class="action-box">
                                        <i class="fas fa-shopping-basket"></i>
                                        <i class="fas fa-archive"></i>
                                        <span class="line"></span>
                                    </div>
                                </div>
                                <span class="item-code">${arr[i].code}</span>`;
        container.appendChild(threadItem);
    } 
    
    const btnsClear = document.querySelectorAll('.fa-times');
    btnsClear.forEach(btnClear => {
        if(destination === 'cart'){
            const clearShopItem = e => clearItem(e, 'cart')
            btnClear.addEventListener('click', clearShopItem);
        }
        if(destination === 'box'){
            const clearBoxItem = e => clearItem(e, 'box')
            btnClear.addEventListener('click', clearBoxItem);
        }
        else {
        btnClear.addEventListener('click', clearItem);
    }
    })

    const btnsShop = document.querySelectorAll('.fa-shopping-basket');
    const addToCart = e => addItemShopOrBox(e, 'cart');
    btnsShop.forEach(btnShop => {
        btnShop.addEventListener('click', addToCart);
    })

    const btnsBox = document.querySelectorAll('.fa-archive');
    const addToBox = e => addItemShopOrBox(e, 'box');
    btnsBox.forEach(btnBox => {
        btnBox.addEventListener('click', addToBox);
    })
}

//remove an item
function clearItem(e,destination){
    const item = e.currentTarget.parentElement.parentElement.parentElement;
    const parentItem = item.parentElement;
    parentItem.removeChild(item);
    //remove from LS
    const itemSelected = e.currentTarget.parentElement.parentElement;
    const code = itemSelected.querySelector(".item-code").innerHTML;
    if(destination === 'cart'){
        removeFromLS(code,'shoppingList');
    }
    if(destination === 'box'){
        removeFromLS(code,'boxList');
    }
};

//ADD ITEM TO SHOP LIST OR BOX LIST

function addItemShopOrBox(e, destination = 'cart'){
    //ajout item au shopping ou box-container
    const itemToAdd = e.currentTarget.parentElement.parentElement.parentElement;
    const cloneItem = itemToAdd.cloneNode(true);
    const btnClearLS = cloneItem.querySelector(".fa-times");
    btnClearLS.classList.add('clearLS');
    if (destination === 'cart') {
        shoppingContainer.appendChild(cloneItem);
    }
    if(destination === 'box'){
        boxContainer.appendChild(cloneItem);
    }
    //ajout item au LS
    const code = cloneItem.querySelector(".item-code").innerHTML;
    const order = cloneItem.dataset.colorOrder;
    if (destination === 'cart') {
        addToLS({code, order},'shoppingList');
    }
    if(destination === 'box'){
        addToLS({code, order},'boxList');
    }  
    //ajout btn supp item 
    if(destination === 'cart'){
        const clearShopItem = e => clearItem(e, 'cart')
        btnClearLS.addEventListener('click', clearShopItem);
    }  
    if(destination === 'box'){
        const clearBoxItem = e => clearItem(e, 'box')
        btnClearLS.addEventListener('click', clearBoxItem);
    }  
}

//SEARCH BY CODE



//***LOCAL STORAGE***//

function getLocalStorage(LSname){
    const dataLS = localStorage.getItem(LSname);
    if (dataLS === null){
        return [];
    } else {
        return JSON.parse(dataLS);
    }
}

function addToLS(item, listName){
    const arrayLS = getLocalStorage(listName);
    arrayLS.push(item);
    //tri par ordre de couleurs
    const sortedArray = arrayLS.sort((a, b)=> {
        return a.order - b.order
    })
    localStorage.setItem(listName, JSON.stringify(sortedArray))
}

function removeFromLS(itemCode, listName){
    const arrayLS = getLocalStorage(listName);
    const newArray = arrayLS.filter(value => {
        return value.code !== itemCode
    });
    localStorage.setItem(listName, JSON.stringify(newArray))
}

//***SET ITEMS STORED***//

const setupShopItems = setupItems('shoppingList');
const setupBoxItems = setupItems('boxList');
window.addEventListener("DOMContentLoaded", setupShopItems);
window.addEventListener("DOMContentLoaded", setupBoxItems);

function setupItems(LSName){
    let items = getLocalStorage(LSName);
    if(LSName === 'shoppingList' && items.length > 0){
        addItem(items, shoppingContainer, 'cart');
    }
    if(LSName === 'boxList' && items.length > 0){
        addItem(items, boxContainer, 'box');
    }
}
