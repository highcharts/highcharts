import { visit } from 'unist-util-visit';

const DEFAULT_WIDTH = '320';
const DEFAULT_HEIGHT = '550';
const DEFAULT_RATIO = 1.75;

function ensureAttributes(node) {
    if (!Array.isArray(node.attributes)) {
        // eslint-disable-next-line no-param-reassign
        node.attributes = [];
    }
}

function findAttribute(node, name) {
    if (!Array.isArray(node.attributes)) {
        return void 0;
    }

    return node.attributes.find(
        attribute =>
            attribute?.type === 'mdxJsxAttribute' &&
            attribute.name === name
    );
}

function getStringValue(attribute) {
    if (!attribute || attribute.type !== 'mdxJsxAttribute') {
        return null;
    }

    if (typeof attribute.value === 'string') {
        return attribute.value;
    }

    if (attribute.value === null || attribute.value === void 0) {
        return '';
    }

    return null;
}

function upsertAttribute(node, name, value) {
    ensureAttributes(node);

    const existing = findAttribute(node, name);

    if (existing) {
        existing.value = value;
    } else {
        node.attributes.push({
            type: 'mdxJsxAttribute',
            name,
            value
        });
    }
}

function removeAttribute(node, name) {
    if (!Array.isArray(node.attributes)) {
        return;
    }

    node.attributes = node.attributes.filter(
        attribute =>
            !(attribute?.type === 'mdxJsxAttribute' && attribute.name === name)
    );
}

function parseStyleAttribute(styleValue) {
    if (!styleValue || typeof styleValue !== 'string') {
        return {};
    }

    return styleValue
        .split(';')
        .map(entry => entry.trim())
        .filter(Boolean)
        .reduce((accumulator, entry) => {
            const [rawKey, rawValue] = entry.split(':');

            if (!rawKey || !rawValue) {
                return accumulator;
            }

            const key = rawKey.trim().toLowerCase();
            const value = rawValue.trim();

            // eslint-disable-next-line no-param-reassign
            accumulator[key] = value;
            return accumulator;
        }, {});
}

function stripPx(value) {
    if (!value) {
        return null;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    if (trimmed.endsWith('px')) {
        return trimmed.slice(0, -2) || null;
    }

    return trimmed;
}

function toNumeric(value) {
    if (!value) {
        return Number.NaN;
    }

    const match = String(value).match(/([0-9]*\.?[0-9]+)/u);

    if (!match) {
        return Number.NaN;
    }

    return parseFloat(match[1]);
}

function hasIframeContainer(parent) {
    if (!parent || parent.type !== 'mdxJsxFlowElement') {
        return false;
    }

    const classAttribute = findAttribute(parent, 'className');
    const className = getStringValue(classAttribute);

    if (!className) {
        return false;
    }

    return className.split(/\s+/u).includes('iframe-container');
}

function adjustIframeAttributes(node) {
    ensureAttributes(node);

    const styleAttribute = findAttribute(node, 'style');
    const styleMap = parseStyleAttribute(getStringValue(styleAttribute));

    const styleWidth = styleMap.width;
    const styleHeight = styleMap.height;

    const widthAttribute = findAttribute(node, 'width');
    let widthValue = getStringValue(widthAttribute);

    if (!widthValue || widthValue === '100%') {
        widthValue = DEFAULT_WIDTH;
    }

    if (styleWidth && styleWidth !== '100%') {
        const stripped = stripPx(styleWidth);
        if (stripped) {
            widthValue = stripped;
        }
    }

    upsertAttribute(node, 'width', widthValue);

    const heightAttribute = findAttribute(node, 'height');
    let heightValue = getStringValue(heightAttribute);

    if (styleHeight && styleHeight !== '100%') {
        const stripped = stripPx(styleHeight);
        if (stripped) {
            heightValue = stripped;
        }
    }

    if (!heightValue) {
        heightValue = DEFAULT_HEIGHT;
    }

    upsertAttribute(node, 'height', heightValue);

    const titleAttribute = findAttribute(node, 'title');
    const srcAttribute = findAttribute(node, 'src');
    const srcValue = getStringValue(srcAttribute);

    if (!getStringValue(titleAttribute) && srcValue && srcValue.includes('highcharts')) {
        upsertAttribute(node, 'title', 'Highcharts example');
    }

    if (srcValue && srcValue.startsWith('https://highcharts')) {
        upsertAttribute(
            node,
            'src',
            srcValue.replace('https://highcharts', 'https://www.highcharts')
        );
    }

    upsertAttribute(node, 'scrolling', 'no');
    removeAttribute(node, 'style');

    return {
        widthValue,
        heightValue
    };
}

function createContainerNode(iframeNode, ratio) {
    const ratioLiteral = {
        type: 'Literal',
        value: ratio,
        raw: `${ratio}`
    };

    return {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [
            {
                type: 'mdxJsxAttribute',
                name: 'className',
                value: 'iframe-container'
            },
            {
                type: 'mdxJsxAttribute',
                name: 'style',
                value: {
                    type: 'mdxJsxAttributeValueExpression',
                    value: null,
                    data: {
                        estree: {
                            type: 'Program',
                            sourceType: 'module',
                            body: [
                                {
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'ObjectExpression',
                                        properties: [
                                            {
                                                type: 'Property',
                                                key: {
                                                    type: 'Literal',
                                                    value: '--aspect-ratio',
                                                    raw: '\'--aspect-ratio\''
                                                },
                                                computed: false,
                                                kind: 'init',
                                                method: false,
                                                shorthand: false,
                                                value: ratioLiteral
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        ],
        children: [iframeNode]
    };
}

function iframePlugin() {
    return function transformer(tree) {
        visit(tree, 'mdxJsxFlowElement', (node, index, parent) => {
            if (!parent || typeof index !== 'number') {
                return;
            }

            if (node.name !== 'iframe') {
                return;
            }

            if (hasIframeContainer(parent)) {
                return;
            }

            const { widthValue, heightValue } = adjustIframeAttributes(node);

            const widthNumber = toNumeric(widthValue);
            const heightNumber = toNumeric(heightValue);

            let ratio = DEFAULT_RATIO;

            if (Number.isFinite(widthNumber) && Number.isFinite(heightNumber) && heightNumber !== 0) {
                ratio = Number((1 + widthNumber / heightNumber).toFixed(6));
            }

            const containerNode = createContainerNode(node, ratio);

            parent.children.splice(index, 1, containerNode);
        });
    };
}

export default iframePlugin;
