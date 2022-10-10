import Authentification from "./Authentification.js";
import ColorBrowser from "./ColorBrowser.js";
import TokenStorage from "./TokenStorage.js";
import Navigation from "./Navigation.js";
import ThreadStorage from "./ThreadStorage.js";
import Projects from "./Projects.js";
import Project from "./Project.js";

(function() {

    let pathname = window.location.pathname;
    const isHome = pathname === '/index.html' || pathname === "/";
    const tokenStorage = new TokenStorage();
    const token = tokenStorage.getLocalStorage();
    console.log(token);
    if (isHome) {
        new Authentification();
        return;
    }
    else if (!token) {
        window.location.pathname = "/index.html";
        return;
    } else {
        new Navigation();
        if (pathname == "/inventory.html") {
            new ColorBrowser();
            const threadStorage = new ThreadStorage();
            threadStorage.displayStorage('basket');
            threadStorage.displayStorage('box');
        } else if (pathname == "/projects.html") {
            new Projects();
        } else if (pathname == "/project.html") {
            new Project();
        }
    }
    
    
})();

