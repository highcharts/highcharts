/*
 * @fileoverview A doclet is not parsable when added to the end of an object.
 * @author Torstein Honsi
 */
'use strict';

const message = 'Doclet at the end of an object literal is not parsable';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: message,
            category: 'Docs',
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {

        // variables should be defined here
        const code = context.getSourceCode()
            .lines

            .map(line => {
                // Handle doclets followed by a comment line
                line = line.split('//')[0];

                // Handle doclets followed by supercode
                line = line.replace('/*= } =*/', '');

                return line;

            })
            .join('\n');

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------
        const program = (node) => {
            const regex = /\s[\*]{1,2}\/[\s]+\}/;
            if (regex.test(code)) {

                let codeBefore = code.split(regex)[0];
                let linesBefore = codeBefore.split('\n');
                let loc = {
                    line: linesBefore.length,
                    column: linesBefore[linesBefore.length - 1].length + 2
                };

                context.report({
                    node: node,
                    loc: loc,
                    message: message
                });
            }
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------
        return {

            Program: program

        };
    }
};
