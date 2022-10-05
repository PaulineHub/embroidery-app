import CloneItem from './CloneItem.js';
import TokenStorage from "./TokenStorage.js";
import ProjectImages from "./ProjectImages.js";

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

        this.projectImages = new ProjectImages();

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
        let imageSrc;
        // listen close btn
        const elCloseWindowBtn = document.querySelector('[data-js-close-window]');
        elCloseWindowBtn.addEventListener('click', this.closeWindow.bind(this));
        // listen image input
        const imageInput = document.getElementById('image');
        imageInput.addEventListener('change', async (e) => {
            const imageFile = e.target.files[0];
            imageSrc = await this.projectImages.uploadImage(imageFile);
        });
        // listen submit form
        const elForm = document.querySelector('[data-js-window-form]');
        elForm.addEventListener('submit', (e) => { 
            e.preventDefault();   
            this.createProject(imageSrc);
            this.closeWindow();
        });
    }

    closeWindow() {
        const elWindow = document.querySelector('[data-js-window]');
        this._elMainBlock.removeChild(elWindow);
    }

    async createProject(imageSrc){
        const name = document.getElementById('name');
        const status = document.getElementById('status');
        const params = {
            name: name.value,
            status: status.value,
            description: ''
        }
        const {data:{project}} = await axios.post(`${this.url}`, 
                        params,
                        {
                            headers: {
                                'Authorization': `Bearer ${this.token}`
                            }
                        });
        await this.projectImages.createProjectImage(project._id, imageSrc);
        this.displayProject(project);
    }

    async displayProject(project) {
        const images = await this.projectImages.getAllProjectImages(project._id);
        const image = this.projectImages.getFirstProjectImage(images);
        let infos = {
                id: project._id,
                name: project.name,
                status: project.status,
                image: image.src
        };
        new CloneItem(infos, this._elProjectTemplate, this._elProjectsContainer);
    }

}

