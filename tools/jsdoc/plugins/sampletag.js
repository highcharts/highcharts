/**
    @module plugins/sampletag
    @author Torstein Honsi
 */
'use strict';

exports.handlers = {
    /**
        Support @sample tag.
     */
    newDoclet: function (e) {
        var tags = e.doclet.tags;

        // any user-defined tags in this doclet?
        if (typeof tags !== 'undefined') {
            // only interested in the @sample tags
            tags = tags.filter(function ($) {
                return $.title === 'sample';
            });

            tags.forEach(function (tag) {

                var tagArr = tag.value.split(' '),
                    desc = tagArr.slice(1).join(' ')
                        // Trim whitespace, dashes and period
                        .replace(/^[\s-]+|[\.\s]+$/gm, '');

                e.doclet.samples = e.doclet.samples || [];
                e.doclet.samples.push({
                    path: tagArr[0],
                    desc: (desc || 'View live demo') + '.'
                });
            });
        }
    }
};
