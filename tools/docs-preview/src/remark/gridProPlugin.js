import { visit } from 'unist-util-visit';

const GRID_PRO_TOKEN = '__grid_pro__';

function hasGridProTag(frontmatter) {
    if (!frontmatter || !frontmatter.tags) {
        return false;
    }

    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    return tags.includes('grid-pro');
}

function createBadgeNode() {
    return {
        type: 'mdxJsxTextElement',
        name: 'GridProBadge',
        attributes: [],
        children: []
    };
}

function createBannerNode() {
    return {
        type: 'mdxJsxFlowElement',
        name: 'GridProBanner',
        attributes: [],
        children: []
    };
}

function splitTextNode(value) {
    const parts = value.split(GRID_PRO_TOKEN);
    const nodes = [];

    parts.forEach((part, index) => {
        if (part) {
            nodes.push({
                type: 'text',
                value: part
            });
        }

        if (index < parts.length - 1) {
            nodes.push(createBadgeNode());
        }
    });

    return nodes;
}

function gridProPlugin() {
    return function transformer(tree, file) {
        const frontmatter = file.data?.frontMatter || file.data?.matter || {};
        const hasGridProFlag = hasGridProTag(frontmatter);

        if (hasGridProFlag) {
            const firstChild = tree.children[0];

            const alreadyBanner =
                firstChild &&
                firstChild.type === 'mdxJsxFlowElement' &&
                firstChild.name === 'GridProBanner';

            if (!alreadyBanner) {
                tree.children.unshift(createBannerNode());
            }
        }

        visit(tree, 'text', (node, index, parent) => {
            if (!node.value || !node.value.includes(GRID_PRO_TOKEN)) {
                return;
            }

            if (!parent || !Array.isArray(parent.children)) {
                return;
            }

            const replacementNodes = splitTextNode(node.value);

            parent.children.splice(index, 1, ...replacementNodes);
        });

        visit(tree, 'strong', (node, index, parent) => {
            if (
                !parent ||
                !Array.isArray(parent.children) ||
                !Array.isArray(node.children) ||
                node.children.length !== 1
            ) {
                return;
            }

            const [child] = node.children;

            if (child?.type !== 'text') {
                return;
            }

            const normalized = child.value.trim().toLowerCase();

            if (normalized === 'grid_pro' || normalized === 'grid-pro') {
                parent.children.splice(index, 1, createBadgeNode());
            }
        });
    };
}

export default gridProPlugin;
