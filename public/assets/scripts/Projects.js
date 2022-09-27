import CloneItem from './CloneItem.js';
import TokenStorage from "./TokenStorage.js";

export default class Projects {

    constructor() {
        this._elCreateProjectBtn = document.querySelector('[data-js-add-btn]');
        this._elWindowTemplate = document.querySelector('[data-js-window-template]');
        this._elMainBlock = document.querySelector('main');
        this._elProjectTemplate = document.querySelector('[data-js-thread-basket-template]');
        this._elProjectsContainer = document.querySelector('[data-js-threads-wrapper="basket"]');

        //this.storage = new ThreadStorage(this.token);
        this.tokenStorage = new TokenStorage();
        this.token = this.tokenStorage.getLocalStorage()[0];
        this.imageValue;

        this.init();
    }
    
    /***
     * Initiate behaviors by default 
     */
    init() {  

        this._elCreateProjectBtn.addEventListener('click', () => {
            this.displayWindow('create a project');
        });
        
    }

    displayWindow(action) {
        let infos = { action };
        new CloneItem(infos, this._elWindowTemplate, this._elMainBlock, this.token);
        this.listenWindowBtns();
    }

    listenWindowBtns() {
        // listen close btn
        const elCloseWindowBtn = document.querySelector('[data-js-close-window]');
        elCloseWindowBtn.addEventListener('click', this.closeWindow.bind(this));
        // listen image input
        const imageInput = document.getElementById('image');
        imageInput.addEventListener('change', this.uploadImage.bind(this));
        // listen submit form
        const elForm = document.querySelector('[data-js-window-form]');
        elForm.addEventListener('submit', (e) => { 
            e.preventDefault();    
            this.createProject();
            this.closeWindow();
        });
    }

    closeWindow() {
        const elWindow = document.querySelector('[data-js-window]');
        this._elMainBlock.removeChild(elWindow);
    }

    async uploadImage(e) {
        const imageFile = e.target.files[0];
        const formData = new FormData();
        formData.append('image',imageFile);
        console.log(formData);
        try {
            const {data:{image:{src}}} = await axios.post(`api/v1/projects/uploads`,
                                        formData, {
                                            headers:{
                                                'Content-Type':'multipart/form-data',
                                                'Authorization': `Bearer ${this.token}`
                                            }
                                        })
            this.imageValue = src
        } catch (error) {
            this.imageValue = null
            console.log(error);
        }
    }

    createProject(){
        const name = document.getElementById('name');
        const status = document.getElementById('status');
        const params = {
            name: name.value,
            status: status.value,
            images: [this.imageValue] // array
        }
        console.log(params);
        // create the project in the DB of the user
        // const {data} = await axios.post(`/api/v1/projects`, 
        //                 params,
        //                 {
        //                     headers: {
        //                         'Content-Type':'multipart/form-data',
        //                         'Authorization': `Bearer ${this.token}`
        //                     }
        //                 });
        // let infos = {
        //         id: data.storedThread._id,
        //         code: code,
        //         quantity:quantity
        // };
        // // display the project created in the DOM 
        // this.displayProject(infos);
    }

    displayProject(infos) {

    }

}

