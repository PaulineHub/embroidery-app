import CloneItem from './CloneItem.js';
import Router from './Router.js';
import TokenStorage from "./TokenStorage.js";
import ColorCarousel from "./ColorCarousel.js";


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
        this._elColorBrowserWindow = document.getElementById('window-color-browser-container');

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
        this.displayProjectContent(projectId);

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
       this.getProjectDescription(idProject)
       .then(infosProject => {
            this.displayProjectDescription(infosProject)
            this.displayProjectImages(infosProject);
            this.displayProjectThreads(infosProject);
       });
   }

   /**
     * Get the project description and insert it into the DOM.
     * @param {object} params - The id of the project.
     * @return {object} - The infos about the project.
     */
   async getProjectDescription(params) {
        try {
            const {data:{project}} = await axios.get(`${this.url}/${params.id}?id=${params.id}`,
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
            new CloneItem(infos, this._elImageTemplate, this._elImagesContainer, this.token);
        }
    }

    displayProjectThreads(project) {
        const threads = project.threads;
        if (threads.length > 0) {
            // appel a db pour recuperer fils stockes sous categorie 'projet'
            //display
        }
    }

    displaySaveButton() {
        this._elSaveButton.classList.toggle('show-button');
    }

    async updateProjectInfos(e) {
        e.preventDefault();
        let params = {
            id:  this._elProjectContainer.id,
            name: this._elNameInput.value,
            status: this._elStatusSelect.value,
            description: this._elDescriptionInput.value
        }
        try {
            await axios.patch(`${this.url}/${params.id}`, 
                            params,
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });

        } catch (error) {
            console.log(error);
        }
        this.displaySaveButton();
    }

    displayBrowserOptionsWindow() {
        let infos = {
            classes1: 'fas fa-palette',
            classes2: 'fas fa-archive',
            option1: 'Browse new colors',
            option2: 'Add from Thread Box'
        };
        new CloneItem(infos, this._elOptionsWindowTemplate, this._elMainBlock, this.token);

        const elOptionsWindow = document.querySelector('[data-js-options-window]');
        const elNewColorsBtn = document.querySelector('[data-js-option="Browse new colors"]');
        const elBoxBtn = document.querySelector('[data-js-option="Browse new colors"]');

        elNewColorsBtn.addEventListener('click', () => {
            this.displayThreadBrowserWindow();
            this.closeWindow(elOptionsWindow);
        });

        // elBoxBtn.addEventListener('click', () => {
        //     this.displayThreadBrowserWindow();
        //     this.closeWindow(elOptionsWindow);
        // });
    }

    displayThreadBrowserWindow() {
        this._elColorBrowserWindow.classList.add('show-window');
        new ColorCarousel(710, 600, 700, 670);

    }

     displayProjectOptionsWindow() {
        let infos = {
            classes1: 'fa-regular fa-image',
            classes2: 'fa-regular fa-trash-can',
            option1: 'Modify images',
            option2: 'Delete project'
        };
        new CloneItem(infos, this._elOptionsWindowTemplate, this._elMainBlock, this.token);

    }

    closeWindow(elWindow) {
        this._elMainBlock.removeChild(elWindow);
    }



}