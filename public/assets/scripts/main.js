import Form from "./Form.js";
import ColorBrowser from "./ColorBrowser.js";
import TokenStorage from "./TokenStorage.js";
import Navigation from "./Navigation.js";

(function() {

    let pathname = window.location.pathname;
    if (pathname == "/index.html" || pathname == "/") new Form();
    const storage = new TokenStorage();
    const token = storage.getLocalStorage()[0];
    if (token) {
        new Navigation();
        if (pathname == "/inventory.html") new ColorBrowser(token);
    }
    
    
})();

