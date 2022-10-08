import CloneItem from './CloneItem.js';
import reqInstanceAuth from "./InstanceAxios.js";

export default class ProjectImages {

    constructor() {
        this.url = '/api/v1/projectImages';
        this.axiosInstanceAuth = reqInstanceAuth;
    }

    /**
     * Upload an image to the repository 'uploads'.
     * @param {string} imageFile - The file of the image.
     * @return {string} - The path of the image's file.
     */
    async uploadImage(imageFile) {
        let imageSrc;
        const formData = new FormData();
        formData.append('image',imageFile);
        try {
            const {data:{image:{src}}} = await this.axiosInstanceAuth.post(`${this.url}/uploads`,
                                        formData, {
                                            headers:{ 'Content-Type':'multipart/form-data' }
                                        })
            imageSrc = src;
        } catch (error) {
            imageValue = null;
            console.log(error);
        }
        return imageSrc;
    }

    /**
     * Create an image in the DB.
     * @param {string} projectId - The id of the project.
     * @param {string} imageSrc - The path of the image's file.
     * @return {object} - The infos about the image created.
     */
    async createProjectImage(projectId, imageSrc) {
        const params = {
            src: imageSrc,
            projectId
        }
        const {data:{image}} = await this.axiosInstanceAuth.post(`${this.url}`, params)
        return image;
    }

    /**
     * Get all the images of the project in the DB.
     * @param {string} projectId - The id of the project.
     * @return {object[]} - An array of the images of the project.
     */
    async getAllProjectImages(projectId) {
        //const params = {projectId};
        //console.log({params})
        const {data:{images}} = await this.axiosInstanceAuth.get(`${this.url}?projectId=${projectId}`); // pk params ne marche pas ???????
        return images;
    }

    /**
     * Get the first image of the project.
     * @param {object[]} images - An array of the images of the project.
     * @return {object} -The first image of the project.
     */
    getFirstProjectImage(images) {
        return images[0];
    }

    /**
     * Display the images of the project.
     * @param {string} projectId - Id of the project.
     * @param {string} elImageTemplate - Template of the image to display.
     * @param {string} elImagesContainer - Container where to display the images.
     */
    async displayAllProjectImages(projectId, elImageTemplate, elImagesContainer) {
        const images = await this.getAllProjectImages(projectId);
        for (let image in images) {
            this.displayProjectImage(images[image], elImageTemplate, elImagesContainer)
        }
    }

    /**
     * Display the image of the project.
     * @param {object} image - Infos about the image.
     * @param {string} elImageTemplate - Template of the image to display.
     * @param {string} elImagesContainer - Container where to display the images.
     */
    displayProjectImage(image, elImageTemplate, elImagesContainer) {
        let infos = {
            id: image._id,
            src: image.src
        }
        new CloneItem(infos, elImageTemplate, elImagesContainer);
    }

    /**
     * Display a small version of the image with a delete button.
     * @param {object} image - Infos about the image.
     * @param {string} elImageTemplate - Template of the image to display.
     * @param {string} elImagesContainer - Container where to display the images.
     */
    displaySmallProjectImage(image, elImageTemplate, elImagesContainer) {
        this.displayProjectImage(image, elImageTemplate, elImagesContainer);
        const elSmallImage = document.querySelector(`[data-js-id="${image._id}"]`);
        const elDeleteImageBtn = elSmallImage.querySelector('[data-js-delete-image]');
        // listen delete btn
        elDeleteImageBtn.addEventListener('click', () => {
            this.deleteProjectImage(image._id);
            //remove from window
            this.removeProjectImage(elSmallImage, elImagesContainer);
            // remove from project's page
            const elBigImage = document.getElementById(image._id);
            const elBigImagesWrapper = document.querySelector('[data-js-project-images-ctn]');
            this.removeProjectImage(elBigImage, elBigImagesWrapper);
        })
    }

    /**
     * Delete the images of the project.
     * @param {string} projectId - Id of the project.
     */
    async deleteAllProjectImages(projectId) {
        const images = await this.getAllProjectImages(projectId);
        for (let image in images) {
            this.deleteProjectImage(images[image]._id);
        }
    }

    /**
     * Delete the image of the project in the DB.
     * @param {string} imageId - Id of the image.
     */
    async deleteProjectImage(imageId) {
        await this.axiosInstanceAuth.delete(`${this.url}/${imageId}`);
    }

    /**
     * Remove the image from the DOM.
     * @param {string} image - Image to remove.
     * @param {string} container - Container of the image.
     */
    removeProjectImage(image, container) {
        container.removeChild(image);
    }
    
}

