import { visit } from 'unist-util-visit';
import sidebars from '../../../../docs/sidebars.mjs';

const GRID_PRO_TOKEN = '__grid_pro__';

function isObject(value) {
    return typeof value === 'object' && value !== null;
}

function collectGridProDocIds() {
    const ids = new Set();

    function traverse(node) {
        if (!node) {
            return;
        }

        if (Array.isArray(node)) {
            node.forEach(traverse);
            return;
        }

        if (!isObject(node)) {
            return;
        }

        if (node.type === 'doc') {
            if (node.customProps?.gridPro && typeof node.id === 'string') {
                ids.add(node.id);
            }
            return;
        }

        if (Array.isArray(node.items)) {
            traverse(node.items);
        }

        for (const [key, value] of Object.entries(node)) {
            if (key === 'customProps' || key === 'items') {
                continue;
            }

            if (Array.isArray(value) || isObject(value)) {
                traverse(value);
            }
        }
    }

    for (const sidebar of Object.values(sidebars)) {
        traverse(sidebar);
    }

    return ids;
}

const GRID_PRO_DOC_IDS = collectGridProDocIds();

function normalizeDocId(value) {
    if (typeof value !== 'string') {
        return null;
    }

    let normalized = value.replace(/\\/gu, '/').replace(/^\/+/u, '');

    const docsSegmentIndex = normalized.indexOf('/docs/');

    if (docsSegmentIndex !== -1) {
        normalized = normalized.slice(docsSegmentIndex + '/docs/'.length);
    }

    normalized = normalized.replace(/^docs\//u, '');
    normalized = normalized.replace(/\.mdx?$/u, '');
    normalized = normalized.replace(/\/$/u, '');

    return normalized || null;
}

function getDocIdFromFile(file) {
    const candidates = [
        file?.data?.id,
        file?.data?.docId,
        file?.data?.source,
        file?.data?.slug
    ];

    for (const candidate of candidates) {
        const normalized = normalizeDocId(candidate);
        if (normalized) {
            return normalized;
        }
    }

    const history = Array.isArray(file?.history) ? [...file.history].reverse() : [];

    for (const entry of history) {
        const normalized = normalizeDocId(entry);
        if (normalized) {
            return normalized;
        }
    }

    return null;
}

function createBadgeNode() {
    return {
        type: 'mdxJsxTextElement',
        name: 'grid-pro-badge',
        attributes: [],
        children: []
    };
}

function createBannerNode() {
    return {
        type: 'mdxJsxFlowElement',
        name: 'grid-pro-banner',
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
        const docId = getDocIdFromFile(file);
        const hasGridProFlag = docId ? GRID_PRO_DOC_IDS.has(docId) : false;

        if (hasGridProFlag) {
            const firstChild = tree.children[0];

            const alreadyBanner =
                firstChild &&
                firstChild.type === 'mdxJsxFlowElement' &&
                firstChild.name === 'grid-pro-banner';

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
