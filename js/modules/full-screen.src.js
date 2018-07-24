/**
 * (c) 2009-2018 Sebastian Bochann
 *
 * Full screen for Highcharts
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';

H.FullScreen = function (container) {
    this.init(container);
};

H.FullScreen.prototype = {
    init: function (container) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    }
};



