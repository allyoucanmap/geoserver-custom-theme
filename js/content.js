/* copyright 2020, stefano bovio @allyoucanmap. */

var _browser = chrome || browser;

var ROOT_ID = 'gct-root-style';
var BASE_ID = 'gct-base-style';
var FONT_ID = 'gct-fonts';
var FONTAWESOME_ID = 'gct-fontawesome';

var IDS = [ROOT_ID, BASE_ID, FONT_ID, FONTAWESOME_ID];

// remove all default style and stylesheet
function clearHead() {
    var links = document.querySelectorAll('link');

    for (var i = 0; i < links.length; i++) {
        var id = links[i].getAttribute('id');
        if (IDS.indexOf(id) === -1) {
            links[i].parentNode.removeChild(links[i]);
        }
    }

    var styles = document.querySelectorAll('style');

    for (var i = 0; i < styles.length; i++) {
        var id = styles[i].getAttribute('id');
        if (IDS.indexOf(id) === -1) {
            styles[i].parentNode.removeChild(styles[i]);
        }
    }
}

// handle resize event to update position of some components
function resize() {
    var header = document.getElementById('header');
    var sidebar = document.getElementById('sidebar');

    var loader = document.getElementById('ajaxFeedback');
    var tabRow = document.querySelectorAll('.tab-row') || [];
    if (header && sidebar) {
        var height = window.innerHeight;
        var headerBoundingClientRect = header.getBoundingClientRect();
        sidebar.style.position = 'sticky';
        sidebar.style.top = headerBoundingClientRect.height + 'px';
        sidebar.style.height = (height - headerBoundingClientRect.height) + 'px';
        sidebar.style.overflow = 'auto';

        if (loader) {
            loader.style.top = headerBoundingClientRect.height + 'px';
        }

        var rows = [...tabRow];
        for (var i = 0; i < rows.length; i++) {
            rows[i].style.position = 'sticky';
            rows[i].style.top = headerBoundingClientRect.height + 'px';
            rows[i].style.zIndex = 10;
        }
    }
}

// add fonts
var fonts = document.createElement('link');
fonts.setAttribute('id', FONT_ID);
fonts.setAttribute('rel', 'stylesheet');
fonts.setAttribute('type', 'text/css');
fonts.setAttribute(
    'href',
    'https://fonts.googleapis.com/css2?family=EB+Garamond&family=Inconsolata&family=Open+Sans&display=swap'
);
document.head.appendChild(fonts);

var fontawesome = document.createElement('style');
fontawesome.setAttribute('id', FONTAWESOME_ID);
fontawesome.innerHTML = `
/*!
 * Font Awesome Free 5.13.0 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
@font-face {
    font-family: 'Font Awesome 5 Free';
    font-style: normal;
    font-weight: 900;
    font-display: block;
    src: url("${_browser.extension.getURL('css/fontawesome-free/webfonts/fa-solid-900.eot')}");
    src: url("${_browser.extension.getURL('css/fontawesome-free/webfonts/fa-solid-900.eot')}?#iefix") format("embedded-opentype"),
    url("${_browser.extension.getURL('css/fontawesome-free/webfonts/fa-solid-900.woff2')}") format("woff2"),
    url("${_browser.extension.getURL('css/fontawesome-free/webfonts/fa-solid-900.woff')}") format("woff"),
    url("${_browser.extension.getURL('css/fontawesome-free/webfonts/fa-solid-900.ttf')}") format("truetype"),
    url("${_browser.extension.getURL('css/fontawesome-free/webfonts/fa-solid-900.svg')}#fontawesome") format("svg");
}

.far {
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
}`;

document.head.appendChild(fontawesome);

// get selected style and resources
var STORAGE_THEME_KEY = 'gct-selected-theme';
var selected = localStorage.getItem(STORAGE_THEME_KEY) || 'light';
document.body.setAttribute('class', selected);

var styles = {
    light: _browser.extension.getURL('css/light.css'),
    dark: _browser.extension.getURL('css/dark.css')
};

var icons = {
    light: _browser.extension.getURL('icon/dark.svg'),
    dark: _browser.extension.getURL('icon/light.svg')
};

// append root with all the css variables related to selected style
var root = document.createElement('link');
root.setAttribute('id', ROOT_ID);
root.setAttribute('rel', 'stylesheet');
root.setAttribute('type', 'text/css');
root.setAttribute('href', styles[selected]);

document.head.appendChild(root);

// create a toggle button to change style inside the page
var toggle = document.createElement('button');
toggle.style.position = 'fixed';
toggle.style.right = 0;
toggle.style.bottom = 0;
toggle.style.zIndex = 9999;
toggle.style.width = '2rem';
toggle.style.height = '2rem';
toggle.style.margin = '0.5rem';
toggle.style.border = 'none';
toggle.style.backgroundColor = 'transparent';
toggle.style.backgroundImage = 'url(' + icons[selected] +')';
toggle.style.backgroundSize = 'contain';
toggle.style.backgroundPosition = 'center';
toggle.style.backgroundRepeat = 'no-repeat';
toggle.onclick = function() {
    // switch between the light and dark styles after click event
    selected = selected === 'light' ? 'dark' : 'light';
    toggle.style.backgroundImage = 'url(' + icons[selected] +')';
    root.setAttribute('href', styles[selected]);
    localStorage.setItem(STORAGE_THEME_KEY, selected);
    document.body.setAttribute('class', selected);
};
document.body.appendChild(toggle);


// init
resize();
clearHead();
window.addEventListener('resize', resize);

document.addEventListener('readystatechange', function() {
    resize();
    clearHead();
});

document.body.style.opacity = 1;
// look for changes in the page and update the document by:
// - clear styles and links from head
// - update all resize events
var config = { attributes: true, childList: true, subtree: true };

var observer = new MutationObserver(function() {
    clearHead();
    resize();
});

observer.observe(document, config);
