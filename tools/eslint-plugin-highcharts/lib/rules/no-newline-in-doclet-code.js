/**
 * @fileoverview No newlines are allowed inside backticks in doclets.
 * @author Torstein Honsi
 */
'use strict';

const description = 'No newlines are allowed inside backticks in doclets.';

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
                    line.indexOf('```') === -1 &&
                    line.split(/`/g).length % 2 === 0
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
