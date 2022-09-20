import Form from "./Form.js";
import ColorBrowser from "./ColorBrowser.js";




(function() {

    let pathname = window.location.pathname;
    if (pathname == "/index.html" || pathname == "/") new Form();
    else if (pathname == "/inventory.html") new ColorBrowser();

    
})();




