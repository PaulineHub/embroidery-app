import CloneItem from './CloneItem.js';
import TokenStorage from "./TokenStorage.js";

export default class ProjectImages {

    constructor() {
        this.url = '/api/v1/projectImages';
        this.tokenStorage = new TokenStorage();
        this.token = this.tokenStorage.getLocalStorage()[0];
    }

    async uploadImage(imageFile) {
        let imageSrc;
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
           imageSrc = src;
        } catch (error) {
           imageValue = null
            console.log(error);
        }
        return imageSrc;
    }

    async createProjectImage(projectId, imageSrc) {
        const params = {
            src: imageSrc,
            projectId
        }
        const {data:{image}} = await axios.post(`${this.url}`,
                                        params, {
                                            headers:{'Authorization': `Bearer ${this.token}`}
                                        })
        return image;
    }

    async getAllProjectImages(projectId) {
        const {data:{images}} = await axios.get(`${this.url}?projectId=${projectId}`,
                    {
                        headers: {'Authorization': `Bearer ${this.token}`}
                    });
        return images;
    }

    getFirstProjectImage(images) {
        return images[0];
    }

    async displayAllProjectImages(projectId, elImageTemplate, elImagesContainer) {
        const images = await this.getAllProjectImages(projectId);
        for (let image in images) {
            this.displayProjectImage(images[image], elImageTemplate, elImagesContainer)
        }
    }

    displayProjectImage(image, elImageTemplate, elImagesContainer) {
        let infos = {
            id: image._id,
            src: image.src
        }
        new CloneItem(infos, elImageTemplate, elImagesContainer);
    }

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

    async deleteAllProjectImages(projectId) {
        const images = await this.getAllProjectImages(projectId);
        for (let image in images) {
            this.deleteProjectImage(images[image]._id);
        }
    }

    async deleteProjectImage(imageId) {
        await axios.delete(`${this.url}/${imageId}`, 
                        {
                            headers: {'Authorization': `Bearer ${this.token}`}
                        });
    }

    removeProjectImage(image, container) {
        container.removeChild(image);
    }
   

    
}

