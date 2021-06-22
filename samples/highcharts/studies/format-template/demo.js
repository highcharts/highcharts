const input = document.getElementById('input').textContent;
const output = document.getElementById('output');

const helpers = {};

function format(str, ctx) {
    const regex = /\{([a-zA-Z0-9\.\/# ]+)\}/g;
    const matches = [];
    let match;
    let currentMatch;

    // Parse and create tree
    while ((match = regex.exec(str)) !== null) {
        if (!currentMatch || !currentMatch.fn) {
            currentMatch = {
                content: match[1],
                find: match[0],
                start: match.index,
                startInner: match.index + match[0].length,
                length: match[0].length
            };
        }
        if (match[1].charAt(0) === '#') {
            currentMatch.fn = match[1].split(' ')[0].replace('#', '');
        }

        // Closing a function
        if (currentMatch.fn && match[1] === `/${currentMatch.fn}`) {
            const start = currentMatch.startInner;
            currentMatch.body = str.substr(
                start,
                match.index - start
            );
            currentMatch.find += currentMatch.body + match[0];
            matches.push(currentMatch);
            currentMatch = void 0;
        } else if (!currentMatch.fn) {
            matches.push(currentMatch);
        }
    }

    // Execute
    matches.forEach(match => {
        let replacement;
        if (match.fn) {
            replacement = helpers[match.fn](
                ctx[match.content.split(' ')[1]],
                match
            );
        } else {
            replacement = match.content === 'this' ? ctx : ctx[match.content];
        }
        str = str.replace(match.find, replacement);
    });
    return str;
}

helpers.foreach = function (items, match) {
    return items.map(item => format(match.body, item)).join('');
};


output.innerHTML = format(input, {
    header: 'Hello header',
    items: ['Ein', 'To', 'Tre'],
    footer: 'Hello footer'
});