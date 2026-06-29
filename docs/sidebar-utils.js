const fs = require('node:fs');
const path = require('node:path');
const YAML = require('js-yaml');
function getDocSource(id) {
    const filePath = path.join(__dirname, `${id}.md`);
    return fs.readFileSync(filePath, 'utf8');
}

function hasGridProTag(source) {
    const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/u);

    if (!frontMatter) {
        return false;
    }

    let frontMatterConfig;
    try {
        frontMatterConfig = YAML.safeLoad(frontMatter[1]) || {};
    } catch {
        return false;
    }
    const { tags } = frontMatterConfig;

    if (Array.isArray(tags)) {
        return tags.some(
            tag => typeof tag === 'string' && tag.toLowerCase() === 'grid-pro'
        );
    }

    return typeof tags === 'string' && tags.toLowerCase() === 'grid-pro';
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
