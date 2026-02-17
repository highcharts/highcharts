/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const OPTIONS_TREE = 'tree-grid.json';

const TARGET_DIRECTORY = 'build/api/';

/* *
 *
 *  Functions
 *
 * */

/**
 * Map of Grid class names to their TypeDoc class reference page paths.
 * Built dynamically from the TypeDoc output directory.
 *
 * @param {string} typedocDir
 * Path to the TypeDoc output directory.
 *
 * @return {Object}
 * Map of class names to their page paths.
 */
function buildClassReferenceMap(typedocDir) {
    const fs = require('fs');
    const path = require('path');

    const map = {};
    const classesDir = path.join(typedocDir, 'classes');

    if (!fs.existsSync(classesDir)) {
        return map;
    }

    for (const file of fs.readdirSync(classesDir)) {
        if (!file.endsWith('.html')) {
            continue;
        }
        // Extract class name from filename like
        // "Grid_Core_Table_Column.Column.html" → "Column"
        const match = file.match(/\.([A-Z]\w+)\.html$/u);
        if (match && !file.includes('-1')) {
            map[match[1]] = 'typedoc/classes/' + file;
        }
    }

    return map;
}


/**
 * Post-process the generated api.js to extend getClassReferenceUrl
 * so it also resolves Grid class types to their TypeDoc pages.
 *
 * @param {string} gridDir
 * Path to the Grid API docs output directory.
 *
 * @param {Object} classMap
 * Map of class names to their TypeDoc page paths.
 */
function postProcessApiJS(gridDir, classMap) {
    const fs = require('fs');
    const path = require('path');

    const apiJsPath = path.join(gridDir, 'api.js');
    if (!fs.existsSync(apiJsPath)) {
        return;
    }

    let content = fs.readFileSync(apiJsPath, 'utf8');

    // Inject Grid class reference map and an extended URL resolver
    const gridClassMap = JSON.stringify(classMap);
    const injection = `
  var gridClassMap = ${gridClassMap};

  function getGridClassReferenceUrl(type) {
    // Extract class names from callback signatures like
    // "(this: Column) => void" or "(this: Grid, e: AnyRecord) => void"
    var match = type.match(/^[A-Z]\\w+$/);
    if (match && gridClassMap[type]) {
      return '/grid/' + gridClassMap[type];
    }
    return null;
  }
`;

    // Replace getClassReferenceUrl to also check Grid classes
    content = content.replace(
        /function getClassReferenceUrl\(type\) \{/u,
        injection + '\n  function getClassReferenceUrl(type) {\n' +
        '    var gridUrl = getGridClassReferenceUrl(type);\n' +
        '    if (gridUrl) return gridUrl;\n'
    );

    fs.writeFileSync(apiJsPath, content, 'utf8');
}


/**
 * Scope content-panel selectors to avoid collisions with sidebar tree nodes.
 *
 * @param {string} gridDir
 * Path to the Grid API docs output directory.
 */
function postProcessCSS(gridDir) {
    const fs = require('fs');
    const path = require('path');
    const stylePath = path.join(gridDir, 'style.css');

    if (!fs.existsSync(stylePath)) {
        return;
    }

    let content = fs.readFileSync(stylePath, 'utf8');

    content = content.replace(
        /^\.option-header h1 \{/gmu,
        '#option-list .option-header h1 {'
    );
    content = content.replace(
        /^\.option-header h1 span \{/gmu,
        '#option-list .option-header h1 span {'
    );
    content = content.replace(
        /^\.option-header, \.option \{/gmu,
        '#option-list .option-header, #option-list .option {'
    );

    fs.writeFileSync(stylePath, content, 'utf8');
}

/**
 * Remove Core-only stubs and URL residues from generated JSON artifacts.
 *
 * @param {string} gridDir
 * Path to the Grid API docs output directory.
 */
function postProcessJSONArtifacts(gridDir) {
    const fs = require('fs');
    const path = require('path');

    const treePath = path.join(gridDir, 'tree.json');
    if (fs.existsSync(treePath)) {
        const treeData = JSON.parse(fs.readFileSync(treePath, 'utf8'));
        delete treeData.plotOptions;
        delete treeData.series;
        fs.writeFileSync(treePath, JSON.stringify(treeData), 'utf8');
    }

    const searchPath = path.join(gridDir, 'search.json');
    if (fs.existsSync(searchPath)) {
        const searchData = JSON.parse(fs.readFileSync(searchPath, 'utf8'));
        const filtered = searchData.filter(
            entry => !entry.startsWith('plotOptions') && !entry.startsWith('series')
        );
        fs.writeFileSync(searchPath, JSON.stringify(filtered), 'utf8');
    }

    const navPath = path.join(gridDir, 'nav/index.json');
    if (fs.existsSync(navPath)) {
        const navData = JSON.parse(fs.readFileSync(navPath, 'utf8'));
        if (Array.isArray(navData.children)) {
            navData.children = navData.children.filter(
                entry => (
                    entry &&
                    entry.fullname !== 'plotOptions' &&
                    entry.fullname !== 'series'
                )
            );
        }
        fs.writeFileSync(navPath, JSON.stringify(navData), 'utf8');
    }

    const dumpPath = path.join(gridDir, 'dump.json');
    if (fs.existsSync(dumpPath)) {
        const dumpData = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
        const filtered = dumpData.filter(
            entry => (
                entry &&
                entry.fullname !== 'plotOptions' &&
                entry.fullname !== 'series'
            )
        );
        fs.writeFileSync(dumpPath, JSON.stringify(filtered), 'utf8');
    }
}

/**
 * Rewrite sitemap URLs from /highcharts/ to /grid/ and remove stubs.
 *
 * @param {string} gridDir
 * Path to the Grid API docs output directory.
 */
function postProcessSitemap(gridDir) {
    const fs = require('fs');
    const path = require('path');
    const sitemapPath = path.join(gridDir, 'sitemap.xml');

    if (!fs.existsSync(sitemapPath)) {
        return;
    }

    let content = fs.readFileSync(sitemapPath, 'utf8');

    content = content.replace(
        /https:\/\/api\.highcharts\.com\/highcharts\//gu,
        'https://api.highcharts.com/grid/'
    );
    content = content.replace(
        /<url><loc>[^<]*\/(?:plotOptions|series)(?:\.[^<]*)?<\/loc><priority>[^<]*<\/priority><\/url>/gu,
        ''
    );

    fs.writeFileSync(sitemapPath, content, 'utf8');
}

/**
 * Post-process generated HTML files to replace Highcharts Core branding
 * with Grid branding. The documentation generator only knows about
 * Highcharts product names, so we fix up the output afterwards.
 *
 * @param {string} gridDir
 * Path to the Grid API docs output directory.
 */
function postProcessHTML(gridDir) {
    const fs = require('fs');
    const path = require('path');

    const htmlFiles = fs.readdirSync(gridDir)
        .filter(f => f.endsWith('.html'));

    const replacements = [
        // Titles
        [/Highcharts Core JS API Reference/gu, 'Highcharts Grid API Reference'],
        [/Highcharts Core API Options/gu, 'Highcharts Grid API Options'],
        [/Highcharts Core API Option:/gu, 'Highcharts Grid API Option:'],

        // Product selector: highlight Grid instead of Highcharts Core
        [
            /<li class="product highlighted">\s*<a id="highcharts-link" href="#">Highcharts Core<\/a>/gu,
            '<li class="product">\n' +
            '                                    <a id="highcharts-link" href="../highcharts/">Highcharts Core</a>'
        ],
        [
            /<a id="grid-link" href="\.\.\/grid">Highcharts Grid<\/a>/gu,
            '<a id="grid-link" href="#">Highcharts Grid</a>'
        ],
        [
            /(<li class="product">\s*<a id="grid-link")/gu,
            '<li class="product highlighted">\n' +
            '                                    <a id="grid-link"'
        ],
        // Product selector dropdown label
        [
            /(<a href="#" class="dropdown-link">)Highcharts Core/gu,
            '$1Highcharts Grid'
        ],

        // Sidebar code snippets
        [/Highcharts\.setOptions\(\{/gu, '// Global options'],
        [/Highcharts\.chart\(\{/gu, 'Grid.grid(\'container\', {'],
        [/<h3 id="options-header">Configuration options<\/h3>/gu,
            '<h3 id="options-header">Configuration options</h3>'],
        [
            /For initial declarative chart setup\./gu,
            'For initial declarative grid setup.'
        ],

        // Remove platform selector (JS/iOS/Android) - not relevant for Grid
        [
            /<div id="platform-selector" class="menu" expanded="false">[\s\S]*?<\/div>\s*/gu,
            ''
        ],

        // Remove unrelated header links
        [/<div id="namespaces"[\s\S]*?<\/div>/gu, ''],
        [/<div id="interfaces"[\s\S]*?<\/div>/gu, ''],
        // Replace "Classes" header item with "Code docs" for Grid
        [
            /<div id="classes" class="menu">[\s\S]*?<\/div>/gu,
            '<div id="classes" class="menu">\n' +
            '                            <a href="/grid/typedoc/index.html">Code docs</a>\n' +
            '                        </div>'
        ],

        // Fix "JS API Reference" title link
        [
            /<a href="\/highcharts\/">\s*JS API Reference\s*<\/a>/gu,
            '<a href="/grid/">\n' +
            '                            Grid API Reference\n' +
            '                        </a>'
        ],

        // Fix ZIP download link text
        [
            /Highcharts-Core-[\d.]+-API\.zip/gu,
            'Highcharts-Grid-API.zip'
        ],

        // Fix welcome heading and footer
        [
            /Welcome to the <strong>Highcharts Core JS<\/strong> \(highcharts\) Options Reference/gu,
            'Welcome to the <strong>Highcharts Grid</strong> Options Reference'
        ],
        [
            /Highcharts Core (v[\d.]+)/gu,
            'Highcharts Grid $1'
        ],

        // Fix og:url to use /grid/ instead of /highcharts/
        [
            /content="https:\/\/api\.highcharts\.com\/highcharts\//gu,
            'content="https://api.highcharts.com/grid/'
        ],

        // Remove ZIP download link (ZIP is not generated for Grid)
        [
            / Download as <a href="[^"]*">ZIP<\/a> or/gu,
            ' Download as'
        ],

        // Fix class-reference link to point to Grid TypeDoc
        [
            /<a href="\/class-reference\/classes\.list">class reference<\/a>/gu,
            '<a href="/grid/typedoc/index.html">class reference</a>'
        ],

        // Fix "modifying the chart" text
        [
            /For modifying the chart at runtime\./gu,
            'For modifying the grid at runtime.'
        ],

        // Fix product JS variable
        [
            /product = 'highcharts'/gu,
            'product = \'grid\''
        ],

        // Remove plotOptions stub from sidebar navigation
        [
            /<div class="node collapsed option-plotOptions leaf">[\s\S]*?<\/div>/gu,
            ''
        ],

        // Remove series stub from sidebar navigation
        [
            /<div class="node collapsed option-series leaf">[\s\S]*?<\/div>/gu,
            ''
        ]
    ];

    for (const file of htmlFiles) {
        const filePath = path.join(gridDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        for (const [pattern, replacement] of replacements) {
            content = content.replace(pattern, replacement);
        }

        fs.writeFileSync(filePath, content, 'utf8');
    }

    // Delete stub HTML pages that shouldn't exist for Grid
    for (const stub of ['plotOptions.html', 'series.html']) {
        const stubPath = path.join(gridDir, stub);
        if (fs.existsSync(stubPath)) {
            fs.unlinkSync(stubPath);
        }
    }

    postProcessJSONArtifacts(gridDir);
    postProcessSitemap(gridDir);
    postProcessCSS(gridDir);
}

/**
 * Generator requires `series`/`plotOptions` roots for product=highcharts.
 * Inject in-memory only, keep source tree-grid.json clean.
 *
 * @param {Object} sourceJSON
 * Source Grid options tree.
 *
 * @return {Object}
 * JSON with temporary generator stubs.
 */
function withGeneratorStubs(sourceJSON) {
    const clone = JSON.parse(JSON.stringify(sourceJSON));
    const emptyNode = {
        doclet: {},
        meta: {
            fullname: '',
            name: ''
        },
        children: {}
    };

    if (!clone.plotOptions) {
        clone.plotOptions = {
            ...emptyNode,
            meta: { fullname: 'plotOptions', name: 'plotOptions' }
        };
    }
    if (!clone.series) {
        clone.series = {
            ...emptyNode,
            meta: { fullname: 'series', name: 'series' }
        };
    }

    return clone;
}

/* *
 *
 *  Task
 *
 * */

async function apiDocs() {
    const fsLib = require('../../libs/fs');
    const processLib = require('../../libs/process');
    const fs = require('fs');
    const log = require('../../libs/log');

    // 1. Generate tree-grid.json from Grid TypeScript interfaces
    await processLib.exec(
        'npx ts-node tools/api-docs/grid-options.ts --source "ts/Grid"'
    );

    // 2. Generate HTML from the tree.
    //
    // The generator only recognises Highcharts product names, so we tell
    // it to write into a temporary subfolder and rename afterwards.
    // IMPORTANT: We must NOT delete build/api/highcharts/ — that would
    // destroy the Core API docs if they have already been built.
    const TEMP_DIR = TARGET_DIRECTORY + '_grid_tmp';

    await fsLib.deleteDirectory(TARGET_DIRECTORY + 'grid');
    await fsLib.deleteDirectory(TEMP_DIR);

    log.message('Generating', TARGET_DIRECTORY + 'grid ...');

    const apidocs =
        require('@highcharts/highcharts-documentation-generators').ApiDocs;
    const sourceJSON = JSON.parse(fs.readFileSync(OPTIONS_TREE, 'utf8'));
    const generatorJSON = withGeneratorStubs(sourceJSON);

    await new Promise((resolve, reject) => {
        apidocs(generatorJSON, TEMP_DIR + '/', ['highcharts'], error => {
            if (error) {
                log.failure(error);
                reject(error);
            } else {
                log.success('Created', TARGET_DIRECTORY + 'grid');
                resolve();
            }
        });
    });

    // 3. Rename the temporary output to grid/
    if (fs.existsSync(TEMP_DIR + '/highcharts')) {
        fs.renameSync(
            TEMP_DIR + '/highcharts',
            TARGET_DIRECTORY + 'grid'
        );
    }
    await fsLib.deleteDirectory(TEMP_DIR);

    // 4. Generate TypeDoc class reference
    log.message('Generating TypeDoc class reference...');
    await processLib.exec(
        'npx typedoc' +
        ' --options tools/gulptasks/grid/api-docs.json' +
        ' --tsconfig ts/Grid/tsconfig.json'
    );
    log.success('TypeDoc class reference generated');

    // 5. Post-process HTML to apply Grid branding
    log.message('Post-processing HTML for Grid branding...');
    postProcessHTML(TARGET_DIRECTORY + 'grid');

    // 6. Post-process api.js to support Grid class type linking
    const classMap = buildClassReferenceMap(
        TARGET_DIRECTORY + 'grid/typedoc'
    );
    log.message(
        'Grid class reference map:',
        Object.keys(classMap).length, 'classes'
    );
    postProcessApiJS(TARGET_DIRECTORY + 'grid', classMap);
    log.success('Post-processing complete');

    // 7. Copy static assets (if any exist)
    const staticDir = 'tools/gulptasks/grid/api-docs/';
    if (fs.existsSync(staticDir) && fs.readdirSync(staticDir).length > 0) {
        fsLib.copyAllFiles(staticDir, 'build/api/grid/', true);
    }
}

gulp.task('grid/api-docs', gulp.series('scripts', apiDocs));
