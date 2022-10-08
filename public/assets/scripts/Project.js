import CloneItem from './CloneItem.js';
import Router from './Router.js';
import reqInstanceAuth from "./InstanceAxios.js";
import ColorBrowser from "./ColorBrowser.js";
import ThreadStorage from './ThreadStorage.js';
import ProjectImages from "./ProjectImages.js";

export default class Project {

    constructor() {
        this._elProjectContainer = document.querySelector('[data-js-project-container]');
        this._elNameInput = document.getElementById('name');
        this._elStatusSelect = document.getElementById('status');
        this._elDescriptionInput = document.getElementById('description');
        this._elImagesContainer = document.querySelector('[data-js-project-images-ctn]');
        this._elImageTemplate = document.querySelector('[data-js-project-image-template]');
        this._elSaveButton = document.querySelector('[data-js-save-button]');
        this._elMessageSpan = document.querySelector('[data-js-save-message]');
        this._elProjectParamsButton = document.querySelector('[data-js-project-params-btn]');
        this._elAddThreadButton = document.querySelector('[data-js-add-project-thread]');
        this._elMainBlock = document.querySelector('main');
        this._elOptionsWindowTemplate = document.querySelector('[data-js-options-window-template]');
        this._elDeleteProjectWindowTemplate = document.querySelector('[data-js-delete-project-window-template]');
        this._elModifyProjectImagesWindowTemplate = document.querySelector('[data-js-modify-project-images-window-template]');
        this._elSmallImageProjectTemplate = document.querySelector('[data-js-small-image-template]');
        this._elColorBrowserWindowTemplate = document.querySelector('[data-js-color-browser-window-template]');
        this._elThreadBoxWindowTemplate = document.querySelector('[data-js-thread-box-window-template]');
        this._elThreadsContainer = document.querySelector('[data-js-threads-wrapper="project"]');

        this.router = new Router();
        this.projectId = this.router.getSearchParamsFromUrl().id;
        this.url = '/api/v1/projects';
        this.axiosInstanceAuth = reqInstanceAuth;
        this.storage = new ThreadStorage();
        this.projectImages = new ProjectImages();

        this.init();
    }

    /**
     * Set the initial behaviors (display project content, listen events on inputs and buttons).
     */
   init() {
        
        this.displayProjectContent(this.projectId);

        this._elNameInput.addEventListener('change', this.displaySaveButton.bind(this));
        this._elStatusSelect.addEventListener('change', this.displaySaveButton.bind(this));
        this._elDescriptionInput.addEventListener('change', this.displaySaveButton.bind(this));
        this._elSaveButton.addEventListener('click', this.updateProjectInfos.bind(this));
        this._elAddThreadButton.addEventListener('click', this.displayBrowserOptionsWindow.bind(this));
        this._elProjectParamsButton.addEventListener('click', this.displayProjectOptionsWindow.bind(this));
   }


   /**
     * Display the content of the project (images, description and threads).
     * @param {object} idProject - Id of the project.
     */
    displayProjectContent(idProject) {
        this.getProjectInfos(idProject)
        .then(infosProject => {
            this.displayProjectDescription(infosProject)
            this.projectImages.displayAllProjectImages(infosProject._id, this._elImageTemplate, this._elImagesContainer);
        });
        this.displayProjectThreads(idProject);
    }

   /**
     * Get the project's description.
     * @param {string} id - The id of the project.
     * @return {object} - The infos about the project.
     */
   async getProjectInfos(id) {
        try {
            const {data:{project}} = await this.axiosInstanceAuth.get(`${this.url}/${id}?id=${id}`);
            return project;

        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Display the project's description in the DOM.
     * @param {object} project - The infos about the project.
     */
    displayProjectDescription(project) {
        this._elProjectContainer.id = project._id;
        this._elNameInput.value = project.name;
        this._elStatusSelect.value = project.status;
        this._elDescriptionInput.value = project.description;
    }

    /**
     * Display the project's threads in the DOM.
     * @param {string} projectId - The id of the project.
     */
    displayProjectThreads(projectId) {
        this.storage.displayStorage('project', projectId);
    }

    /**
     * Display the button to save updates in the project's description.
     */
    displaySaveButton() {
        if (!this._elSaveButton.classList.contains('show-button')) {
            this._elSaveButton.classList.add('show-button');
        }
    }

    /**
     * Update the infos of the project and remove the 'save' button.
     * @param {string} e - The event.
     */
    updateProjectInfos(e) {
        e.preventDefault();
        let params = {
            id:  this._elProjectContainer.id,
            name: this._elNameInput.value,
            status: this._elStatusSelect.value,
            description: this._elDescriptionInput.value
        }
        this.updateProjectStorage(params.id, params);
        this.removeSaveButton();
    }

    /**
     * Remove the 'save' button and display a confirmation message.
     */
    removeSaveButton() {
        this._elSaveButton.classList.remove('show-button');
        this._elMessageSpan.innerHTML = 'Modifications saved!';
    }

    /**
     * Update the infos of the project in the DB.
     * @param {string} id - The id of the project.
     * @param {object} params - The infos of the project.
     */
    async updateProjectStorage(id, params) {
        try {
            await this.axiosInstanceAuth.patch(`${this.url}/${id}`, params);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Display a window of options to search threads.
     */
    displayBrowserOptionsWindow() {
        let infos = {
            classes1: 'fas fa-palette',
            classes2: 'fas fa-archive',
            option1: 'Browse new colors',
            option2: 'Add from Thread Box'
        };
        new CloneItem(infos, this._elOptionsWindowTemplate, this._elMainBlock);
        
        const elOptionsWindow = document.querySelector('[data-js-window]');
        const elNewColorsBtn = document.querySelector('[data-js-option="Browse new colors"]');
        const elBoxBtn = document.querySelector('[data-js-option="Add from Thread Box"]');

        this.listenCloseWindowBtn();

        elNewColorsBtn.addEventListener('click', () => {
            this.closeWindow(elOptionsWindow);
            this.displaySearchThreadWindow(this._elColorBrowserWindowTemplate, 'browser');
        });

        elBoxBtn.addEventListener('click', () => {
            this.closeWindow(elOptionsWindow);
            this.displaySearchThreadWindow(this._elThreadBoxWindowTemplate, 'box');
        });
    }

    /**
     * Display a window to search threads (in the color browser or in your box storage).
     */
    displaySearchThreadWindow(template, storage) {
        new CloneItem('', template, this._elMainBlock);
        if (storage == 'browser') {
            new ColorBrowser(); 
        } else {
            const storage = new ThreadStorage();
            storage.displayStorage('box');
        }
        this.listenCloseWindowBtn();
    }

    /**
     * Display a window of options to modify your project.
     */
    displayProjectOptionsWindow() {
        let infos = {
            classes1: 'fa-regular fa-image',
            classes2: 'fa-regular fa-trash-can',
            option1: 'Modify images',
            option2: 'Delete project'
        };
        new CloneItem(infos, this._elOptionsWindowTemplate, this._elMainBlock);
        
        //listen options btn
        const elOptionsWindow = document.querySelector('[data-js-window]');
        const modifyImagesBtn = document.querySelector('[data-js-option="Modify images"]');
        const deleteProjectBtn = document.querySelector('[data-js-option="Delete project"]');

        this.listenCloseWindowBtn();

        modifyImagesBtn.addEventListener('click', () => {
            this.closeWindow(elOptionsWindow);
            this.displayModifyImagesProjectWindow();
        })

        deleteProjectBtn.addEventListener('click', () => {
            this.closeWindow(elOptionsWindow);
            this.displayDeleteProjectWindow();
        })
    }

    /**
     * Display a window to modify the images of your project.
     */
    async displayModifyImagesProjectWindow() {
        //display window
        new CloneItem('', this._elModifyProjectImagesWindowTemplate, this._elMainBlock);
        // display images
        const images = await this.projectImages.getAllProjectImages(this.projectId);
        const elImagesWrapper = document.querySelector('[data-js-small-images-wrapper]');
        for (let image in images) {
            this.projectImages.displaySmallProjectImage(images[image], this._elSmallImageProjectTemplate, elImagesWrapper);
        }
        const elAddImageButton = document.querySelector('[data-js-add-image-btn]');
        elAddImageButton.addEventListener('click', this.addImageToProject.bind(this));
        //listen close btn
        this.listenCloseWindowBtn();
    }

    /**
     * Add an image to the project.
     * @param {string} e - Event.
     */
    async addImageToProject(e) {
        e.preventDefault();
        const elImageInput = document.getElementById('image');
        const imageFile = elImageInput.files[0];
        const imageSrc = await this.projectImages.uploadImage(imageFile);
        const imageInfos = await this.projectImages.createProjectImage(this.projectId, imageSrc);
        const elImagesWrapper = document.querySelector('[data-js-small-images-wrapper]');
        // display image added in the window
        this.projectImages.displaySmallProjectImage(imageInfos, this._elSmallImageProjectTemplate, elImagesWrapper);
        // display image added in the project's page
        this.projectImages.displayProjectImage(imageInfos, this._elImageTemplate, this._elImagesContainer)
    }

    /**
     * Display a window to delete the project.
     */
    displayDeleteProjectWindow() {
        // add window to the DOM
        let projectImages = document.querySelectorAll('.product-image-description');
        let firstImageSrc = new URL(projectImages[0].src);
        let firstImagePath = firstImageSrc.pathname;
        let infos = {
            id: this.projectId,
            name: this._elNameInput.value,
            image: firstImagePath
        };
        new CloneItem(infos, this._elDeleteProjectWindowTemplate, this._elMainBlock);
       
        // listen btns
        const elDeleteProjectBtn = document.querySelector('[data-js-submit-btn="delete project"]');

        this.listenCloseWindowBtn();

        elDeleteProjectBtn.addEventListener('click', () => {
            this.deteleProjectThreads();
            this.projectImages.deleteAllProjectImages();
            this.deleteProject();
            // redirect towards all projects page
            window.location.href = '/projects.html';
        });
    } 
    
    /**
     * Delete the threads stored for the project.
     */
    async deteleProjectThreads() {
        let {data:{threads}} = await this.storage.getThreadsStored('project', this.projectId);
        for (let thread in threads) {
            this.storage.deleteStoredThread(threads[thread]._id);
        }
    }

    /**
     * Delete the project from the DB.
     */
    async deleteProject() {
        await this.axiosInstanceAuth.delete(`${this.url}/${this.projectId}`);
    }

    /**
     * Listen event on the button to close a window.
     */
    listenCloseWindowBtn() {
        const elWindow = document.querySelector('[data-js-window]');
        const elCloseWindowBtn = document.querySelector('[data-js-close-window]');
        elCloseWindowBtn.addEventListener('click', () => {
            this.closeWindow(elWindow);
        });
    }

    /**
     * Remove the window from the DOM.
     */
    closeWindow(elWindow) {
        this._elMainBlock.removeChild(elWindow);
    }

}