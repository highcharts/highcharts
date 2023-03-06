if (typeof CustomEvent === 'function') {
    window.addEventListener('HighchartsModuleLoaded', function (e) {
        var module = e.detail.module;
        var path = e.detail.path;
        if (path === 'Core/Globals.js') {
            module.hasTouch = true; // needs to be faked with TestController
        }
    });
}
