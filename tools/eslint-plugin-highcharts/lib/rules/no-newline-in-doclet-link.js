/**
 * @fileoverview No newlines are allowed inside links in doclets.
 * @author Torstein Honsi
 */
/* eslint-disable */
'use strict';

const description = 'No newlines are allowed inside links in doclets.';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: description,
            category: 'Docs',
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {

        const lines = context.getSourceCode().lines;


        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const Program = (node) => {

            lines.forEach((line, lineNo) => {
                if (
                    line.match(/\[[a-zA-z0-9\.\# ]+\]\([\#a-zA-Z0-9\.\-\:\/]+$/)
                ) {
                    context.report({
                        node: node,
                        loc: {
                            line: lineNo + 1,
                            column: lines[lineNo].length - 1
                        },
                        message: description
                    });
                }
            });
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            Program

        };
    }
};
