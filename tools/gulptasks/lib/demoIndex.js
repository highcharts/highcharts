/*
 * Copyright (C) Highsoft AS
 */

const FS = require('node:fs');
const Path = require('node:path');
const YAML = require('js-yaml');

const PRODUCT_CONFIG = {
    highcharts: {
        demoConfigKey: 'Highcharts'
    },
    stock: {
        demoConfigKey: 'Highcharts Stock'
    },
    maps: {
        demoConfigKey: 'Highcharts Maps'
    },
    gantt: {
        demoConfigKey: 'Highcharts Gantt'
    },
    dashboards: {
        demoConfigKey: 'Highcharts Dashboards'
    },
    'grid-lite': {
        demoConfigKey: 'Highcharts Grid'
    },
    'grid-pro': {
        demoConfigKey: 'Highcharts Grid'
    }
};

function stripYamlMarkers(content) {
    return String(content)
        .replace(/^\uFEFF?---\s*\n/u, '')
        .replace(/\n?\.\.\.\s*$/u, '');
}

function parseDemoDetails(content) {
    const details = YAML.safeLoad(stripYamlMarkers(content));

    if (!details || typeof details !== 'object' || Array.isArray(details)) {
        throw new Error('Malformed demo.details metadata');
    }

    return details;
}

function normalizeCategory(category) {
    if (typeof category === 'string') {
        return {
            name: category,
            priority: 99
        };
    }

    if (!category || typeof category !== 'object' || Array.isArray(category)) {
        throw new Error('Malformed category metadata');
    }

    const categoryNames = Object.keys(category);

    if (categoryNames.length !== 1) {
        throw new Error('Malformed category metadata');
    }

    const name = categoryNames[0];
    const definition = category[name];
    let priority = 99;

    if (definition && typeof definition === 'object' && !Array.isArray(definition) &&
        Object.prototype.hasOwnProperty.call(definition, 'priority')) {
        const parsedPriority = Number(definition.priority);

        if (Number.isFinite(parsedPriority)) {
            priority = parsedPriority;
        }
    }

    return {
        name,
        priority
    };
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/gu, '&amp;')
        .replace(/</gu, '&lt;')
        .replace(/>/gu, '&gt;')
        .replace(/"/gu, '&quot;')
        .replace(/'/gu, '&#39;');
}

function hasAnyTag(demoTags, requiredTags) {
    if (!requiredTags.length) {
        return true;
    }

    return requiredTags.some(tag => demoTags.includes(tag));
}

function sortDemos(a, b) {
    if (a.priority !== b.priority) {
        return a.priority - b.priority;
    }

    return a.name.localeCompare(b.name);
}

function loadDemoConfig(demoConfigPath) {
    const resolvedPath = Path.resolve(demoConfigPath);

    delete require.cache[resolvedPath];

    return require(resolvedPath);
}

function collectDemosForConfig(sourcePath, config) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
        throw new Error('Malformed demo-config metadata');
    }

    if (!Array.isArray(config.categories)) {
        throw new Error('Malformed demo-config metadata');
    }

    const requiredTags = config.filter && config.filter.tags;

    if (config.filter && !Array.isArray(requiredTags)) {
        throw new Error('Malformed demo-config metadata');
    }

    const categoryDefinitions = config.categories.map(normalizeCategory);
    const groups = new Map(categoryDefinitions.map(category => [category.name, []]));

    if (!FS.existsSync(sourcePath)) {
        throw new Error(`Could not find sample source path ${sourcePath}`);
    }

    FS.readdirSync(sourcePath, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .forEach(entry => {
            const demoPath = Path.join(sourcePath, entry.name);
            const detailsPath = Path.join(demoPath, 'demo.details');

            if (!FS.existsSync(detailsPath)) {
                return;
            }

            let details;

            try {
                details = parseDemoDetails(FS.readFileSync(detailsPath, 'utf8'));
            } catch (error) {
                throw new Error(
                    `Failed to parse demo details ${detailsPath}: ${error.message}`
                );
            }

            const demoName = typeof details.name === 'string' ? details.name.trim() : '';
            const demoTags = Array.isArray(details.tags) ? details.tags : [];
            const demoCategories = Array.isArray(details.categories) ? details.categories : [];

            if (!demoName || !demoTags.length || !demoCategories.length) {
                return;
            }

            if (!hasAnyTag(demoTags, requiredTags || [])) {
                return;
            }

            const normalizedCategories = demoCategories.map(normalizeCategory);

            normalizedCategories.forEach(category => {
                const group = groups.get(category.name);

                if (!group) {
                    return;
                }

                if (!group.some(demo => demo.slug === entry.name)) {
                    group.push({
                        name: demoName,
                        slug: entry.name,
                        priority: category.priority
                    });
                }
            });
        });

    return categoryDefinitions
        .map(category => ({
            category: category.name,
            demos: (groups.get(category.name) || []).sort(sortDemos)
        }))
        .filter(group => group.demos.length > 0);
}

function renderDemoIndexContent(groups) {
    return `
<ul class="sidebar-category-list">
${groups.map(group => `
    <li class="sidebar-category-group">
        <h2 class="sidebar-category">${escapeHTML(group.category)}</h2>
        <ul class="sidebar-demo-list">
${group.demos.map(demo => `
            <li><a href="examples/${encodeURIComponent(demo.slug)}/index.html">${escapeHTML(demo.name)}</a></li>`).join('')}
        </ul>
    </li>`).join('')}
</ul>`;
}

function createDemoIndexContent({
    productPath,
    sourcePath,
    demoConfigPath = Path.join('samples', 'demo-config.js')
}) {
    const productConfig = PRODUCT_CONFIG[productPath];

    if (!productConfig) {
        throw new Error(`Unknown demo index product path: ${productPath}`);
    }

    const demoConfig = loadDemoConfig(demoConfigPath);
    const config = demoConfig[productConfig.demoConfigKey];

    if (!config) {
        throw new Error(`Missing demo config for ${productConfig.demoConfigKey}`);
    }

    return renderDemoIndexContent(collectDemosForConfig(sourcePath, config));
}

module.exports = {
    PRODUCT_CONFIG,
    collectDemosForConfig,
    createDemoIndexContent,
    escapeHTML,
    normalizeCategory,
    parseDemoDetails,
    renderDemoIndexContent
};
