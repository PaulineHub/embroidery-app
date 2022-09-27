import Authentification from "./Authentification.js";
import ColorBrowser from "./ColorBrowser.js";
import TokenStorage from "./TokenStorage.js";
import Navigation from "./Navigation.js";
import ThreadStorage from "./ThreadStorage.js";
import Projects from "./Projects.js";

(function() {

    let pathname = window.location.pathname;
    if (pathname == "/index.html" || pathname == "/") new Authentification();
    const tokenStorage = new TokenStorage();
    const token = tokenStorage.getLocalStorage()[0];
    if (token) {
        new Navigation();
        if (pathname == "/inventory.html") {
            new ColorBrowser(token);
            const threadStorage = new ThreadStorage();
            threadStorage.displayStorage('basket');
            threadStorage.displayStorage('box');
        } else if (pathname == "/projects.html") {
            new Projects();
        }
    }
    
    
})();

