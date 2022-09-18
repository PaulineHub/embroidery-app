export default class CloneItem {

    constructor(infos, templateItem, parentContainer) {
        this.infos = infos;
        this.templateItem = templateItem;
        this.parentContainer = parentContainer;

        this.createHtmlItem(this.infos, this.templateItem, this.parentContainer);
    }

    /**
     * Clone and insert a html item into the DOM.
     * @param {object} infos - The infos to replace with in the template.
     * @param {string} elTemplate - The template to clone.
     * @param {string} elContainer - The parent container where to insert the clone.
     */
    createHtmlItem(infos, elTemplate, elContainer) {
        let elItemTemplateClone = elTemplate.cloneNode(true);
        for (const cle in infos) {
            let regExp = new RegExp(`{{${cle}}}`, 'g');
            elItemTemplateClone.innerHTML = elItemTemplateClone.innerHTML.replace(regExp, infos[cle])
        }

        let newElItem = document.importNode(elItemTemplateClone.content, true);
        elContainer.append(newElItem);
    }



}