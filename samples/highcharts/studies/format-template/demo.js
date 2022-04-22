// Todo:
// - {else} tag for if and foreach
// - Error handling (missing helpers, missing config etc. Silent errors?)
// - Conflicts with the a11y module? How to handle #each?
// - Sub-expressions?
// - Non-block helpers


const pick = Highcharts.pick;

const input = document.getElementById('input').textContent;
const output = document.getElementById('output');

const helpers = {};

function format(str, ctx) {
    const regex = /\{([a-zA-Z0-9\.\/# ]+)\}/g;
    const matches = [];
    let match;
    let currentMatch;
    let depth = 0;

    // Parse and create tree
    while ((match = regex.exec(str)) !== null) {
        if (!currentMatch || !currentMatch.fn) {
            currentMatch = {
                expression: match[1],
                find: match[0],
                start: match.index,
                startInner: match.index + match[0].length,
                length: match[0].length
            };
        }

        // Block helper, only one level at the time
        if (match[1].charAt(0) === '#') {
            const fn = match[1].split(' ')[0].replace('#', '');
            if (fn === currentMatch.fn) {
                depth++;
            }
            if (!currentMatch.fn) {
                currentMatch.fn = fn;
            }
        }

        // Closing a block helper
        if (currentMatch.fn && match[1] === `/${currentMatch.fn}`) {
            if (!depth) { // === 0
                const start = currentMatch.startInner;
                currentMatch.body = str.substr(
                    start,
                    match.index - start
                );
                currentMatch.find += currentMatch.body + match[0];
                matches.push(currentMatch);
                currentMatch = void 0;
            } else {
                depth--;
            }

        // Common expression
        } else if (!currentMatch.fn) {
            matches.push(currentMatch);
        }
    }

    // Execute
    matches.forEach(match => {
        let replacement;
        if (match.fn) {
            replacement = helpers[match.fn].call(
                ctx,
                ctx[match.expression.split(' ')[1]],
                match
            );
        } else {
            replacement = match.expression === 'this' ? ctx : ctx[match.expression];
        }
        str = str.replace(match.find, pick(replacement, ''));
    });
    return str;
}

helpers.foreach = function (arg, match) {
    return arg.map(item => format(match.body, item)).join('');
};
helpers.if = function (arg, match) {
    if (arg) {
        return format(match.body, this);
    }
};


output.innerHTML = format(input, {
    header: 'Hello header',
    items: ['Ein', 'To', 'Tre'],
    persons: [{
        firstName: 'Mick',
        lastName: 'Jagger'
    }, {
        firstName: 'Keith',
        lastName: 'Richards'
    }],
    condition: true,
    innerCondition: true,
    footer: 'Hello footer'
});