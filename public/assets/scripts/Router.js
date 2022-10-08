
export default class Router {

    /**
     * Get the search params from the url.
     * @param {string} hashWord - The hash word to search
     * @return {object} or {boolean} - The params for the request or false.
     */
    getSearchParamsFromUrl(hashWord='') {
        const url = new URL(`${window.location.href}`);
        let params = {};
        let urlSearch;
        if (url.hash || url.search) {
            
            if (url.hash) urlSearch = url.hash.split(`#!/${hashWord}?`)[1];
            else if (url.search) urlSearch = url.search;

            let searchParams = new URLSearchParams(urlSearch);
            for (let key of searchParams.keys()) {
                params[key] = searchParams.get(key);
            }
            return params;
        }
        else return false;
    }

    /**
     * Insert search params in the url.
     * @param {string} hashTerm - The hash term in the url.
     * @param {object} paramsObject - The params to update in the url.
     */
    updateSearchParamsInUrl(hashTerm, paramsObject) {
        const url = new URL(`${window.location.href}`);
        url.hash = `#!/${hashTerm}?`;
        let params = new URLSearchParams(url.search);
        for (let paramName in paramsObject) {
            params.append(paramName, paramsObject[paramName]);
        }
         window.location = `${url}${params}`;
    }
    

    
}