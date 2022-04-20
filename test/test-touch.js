window.addEventListener('HighchartsModuleLoaded', function (e) {
    var module = e.detail.module;
    var path = e.detail.path;
    switch (path) {
        case 'Core/Globals.js':
            module.hasTouch = true; // needs to be faked with TestController
    }
});
