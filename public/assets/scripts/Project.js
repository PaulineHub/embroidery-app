import CloneItem from './CloneItem.js';
import Router from './Router.js';
import TokenStorage from "./TokenStorage.js";
import ColorBrowser from "./ColorBrowser.js";
import ThreadStorage from './ThreadStorage.js';


export default class Project {

    constructor() {
        this._elProjectContainer = document.querySelector('[data-js-project-container]');
        this._elNameInput = document.getElementById('name');
        this._elStatusSelect = document.getElementById('status');
        this._elDescriptionInput = document.getElementById('description');
        this._elImagesContainer = document.querySelector('[data-js-project-images-ctn]');
        this._elImageTemplate = document.querySelector('[data-js-project-image-template]');
        this._elSaveButton = document.querySelector('[data-js-save-button]');

        this._elAddThreadButton = document.querySelector('[data-js-add-project-thread]');
        this._elMainBlock = document.querySelector('main');
        this._elOptionsWindowTemplate = document.querySelector('[data-js-options-window-template]');
        this._elColorBrowserWindowTemplate = document.querySelector('[data-js-color-browser-window-template]');
        this._elThreadBoxWindowTemplate = document.querySelector('[data-js-thread-box-window-template]');

        this.router = new Router();
        this.url = '/api/v1/projects';
        this.tokenStorage = new TokenStorage();
        this.token = this.tokenStorage.getLocalStorage()[0];

        this.init();
    }

    /**
     * Set the initial behaviors.
     */
   init() {
        const projectId = this.router.getSearchParamsFromUrl();
        this.displayProjectContent(projectId.id);

        this._elNameInput.addEventListener('change', this.displaySaveButton.bind(this));
        this._elStatusSelect.addEventListener('change', this.displaySaveButton.bind(this));
        this._elDescriptionInput.addEventListener('change', this.displaySaveButton.bind(this));
        this._elSaveButton.addEventListener('click', this.updateProjectInfos.bind(this));
        this._elAddThreadButton.addEventListener('click', this.displayBrowserOptionsWindow.bind(this));
   }


   /**
     * Display the content of the project (images and description).
     * @param {object} idProject - The id of the project.
     */
   displayProjectContent(idProject) {
       this.getProjectInfos(idProject)
       .then(infosProject => {
            this.displayProjectDescription(infosProject)
            this.displayProjectImages(infosProject);
       });
       this.displayProjectThreads(idProject);
   }

   /**
     * Get the project description and insert it into the DOM.
     * @param {object} params - The id of the project.
     * @return {object} - The infos about the project.
     */
   async getProjectInfos(id) {
        try {
            const {data:{project}} = await axios.get(`${this.url}/${id}?id=${id}`,
                                    {
                                        headers: {'Authorization': `Bearer ${this.token}`}
                                    });
            return project;

        } catch (error) {
            console.log(error);
        }
    }

    displayProjectDescription(project) {
        this._elProjectContainer.id = project._id;
        this._elNameInput.value = project.name;
        this._elStatusSelect.value = project.status;
        this._elDescriptionInput.value = project.description;
    }

    displayProjectImages(project) {
        const images = project.images;
        for (let image in images) {
            let infos = {image: images[image]};
            new CloneItem(infos, this._elImageTemplate, this._elImagesContainer);
        }
    }

    displayProjectThreads(projectId) {
        const storage = new ThreadStorage();
        storage.displayStorage('project', projectId);
    }

    displaySaveButton() {
        this._elSaveButton.classList.toggle('show-button');
    }

    updateProjectInfos(e) {
        e.preventDefault();
        let params = {
            id:  this._elProjectContainer.id,
            name: this._elNameInput.value,
            status: this._elStatusSelect.value,
            description: this._elDescriptionInput.value
        }
        this.updateProjectStorage(params.id, params);
        this.displaySaveButton();
    }

    async updateProjectStorage(id, params) {
        try {
            await axios.patch(`${this.url}/${id}`, 
                            params,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });

        } catch (error) {
            console.log(error);
        }
    }

    displayBrowserOptionsWindow() {
        let infos = {
            classes1: 'fas fa-palette',
            classes2: 'fas fa-archive',
            option1: 'Browse new colors',
            option2: 'Add from Thread Box'
        };
        new CloneItem(infos, this._elOptionsWindowTemplate, this._elMainBlock);
        
        const elOptionsWindow = document.querySelector('[data-js-option-window]');
        const elNewColorsBtn = document.querySelector('[data-js-option="Browse new colors"]');
        const elBoxBtn = document.querySelector('[data-js-option="Add from Thread Box"]');
        const elCloseWindowBtn = document.querySelector('[data-js-close-option-window]');
        
        elCloseWindowBtn.addEventListener('click', () => {
            this.closeWindow(elOptionsWindow);
        });

        elNewColorsBtn.addEventListener('click', () => {
            this.closeWindow(elOptionsWindow);
            this.displaySearchThreadWindow(this._elColorBrowserWindowTemplate, 'browser', 'color-browser')
        });

        elBoxBtn.addEventListener('click', () => {
            this.closeWindow(elOptionsWindow);
            this.displaySearchThreadWindow(this._elThreadBoxWindowTemplate, 'box', 'thread-box')
        });
    }

    displaySearchThreadWindow(template, storage, window) {
        new CloneItem('', template, this._elMainBlock);
        if (storage == 'browser') {
            new ColorBrowser(); 
        } else {
            const storage = new ThreadStorage();
            storage.displayStorage('box');
        }
        // listen close btn
        const elCloseWindowBtn = document.querySelector(`[data-js-close-${storage}-window]`);
        const elWindow = document.getElementById(`window-${window}-container`);
        elCloseWindowBtn.addEventListener('click', () => {
            this.closeWindow(elWindow);
        });
    }

    displayProjectOptionsWindow() {
        let infos = {
            classes1: 'fa-regular fa-image',
            classes2: 'fa-regular fa-trash-can',
            option1: 'Modify images',
            option2: 'Delete project'
        };
        new CloneItem(infos, this._elOptionsWindowTemplate, this._elMainBlock);

    }

    closeWindow(elWindow) {
        this._elMainBlock.removeChild(elWindow);
    }



}