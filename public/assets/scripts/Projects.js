import CloneItem from './CloneItem.js';
import TokenStorage from "./TokenStorage.js";

export default class Projects {

    constructor() {
        this._elCreateProjectBtn = document.querySelector('[data-js-add-btn]');
        this._elWindowTemplate = document.querySelector('[data-js-window-template]');
        this._elMainBlock = document.querySelector('main');
        this._elProjectTemplate = document.querySelector('[data-js-project-template]');
        this._elProjectsContainer = document.querySelector('[data-js-projects-wrapper]');

        this.url = '/api/v1/projects';
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

        this.displayAllProjects();
        
    }

    async displayAllProjects() {
        // get the infos about the threads stored
        const {data:{projects}} = await axios.get(`${this.url}`,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
        for (let project in projects){
            this.displayProject(projects[project]);
        }
    }

    displayWindow(action) {
        let infos = { action };
        new CloneItem(infos, this._elWindowTemplate, this._elMainBlock);
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
        try {
            const {data:{image:{src}}} = await axios.post(`${this.url}/uploads`,
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

    async createProject(){
        const name = document.getElementById('name');
        const status = document.getElementById('status');
        const params = {
            name: name.value,
            status: status.value,
            images: [this.imageValue],
            description: '',
            threads: [] 
        }
        const {data:{project}} = await axios.post(`${this.url}`, 
                        params,
                        {
                            headers: {
                                'Authorization': `Bearer ${this.token}`
                            }
                        });
        this.displayProject(project);
    }

    displayProject(data) {
        let infos = {
                id: data._id,
                name: data.name,
                status: data.status,
                image: data.images[0]
        };
        new CloneItem(infos, this._elProjectTemplate, this._elProjectsContainer);
    }

}

