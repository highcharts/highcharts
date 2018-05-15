/**
 @module plugins/chart-private-tag
 @author e-cloud
 */
'use strict';

exports.defineTags = function (dictionary) {
    dictionary.defineTag('chart-private', {
        onTagged: function (doclet) {
            doclet.access = 'private';
            doclet.chartPrivate = true;
        }
    });
};
