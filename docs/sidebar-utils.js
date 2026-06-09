const fs = require('fs');
const path = require('path');
function getDocSource(id) {
    const filePath = path.join(__dirname, `${id}.md`);
    return fs.readFileSync(filePath, 'utf8');
}

function hasGridProTag(source) {
    const frontMatter = source.match(/^---\n([\s\S]*?)\n---/);

    if (!frontMatter) {
        return false;
    }

    return /^tags:\s*\[[^\]]*['"]?grid-pro['"]?[^\]]*\]/m.test(
        frontMatter[1]
    );
}

function doc(id) {
    const source = getDocSource(id);

    if (!hasGridProTag(source)) {
        return id;
    }

    return {
        type: 'doc',
        id,
        customProps: {
            gridPro: true
        }
    };
}

module.exports = {
    doc
};
