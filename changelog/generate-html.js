/* eslint-env node, es6 */
/* eslint valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

/**
 * Usage: node changelog/generate-html
 *
 * This node script is used to assemble the content for all markdown files
 * in each sub-directory of this directory into a new html output file.
 */
var path = require('path');

function generateHTML() {
    return new Promise(function (resolve, reject) {
        var marked = require('marked'),
            fs = require('fs'),
            pretty = require('pretty'),
            semver = require('semver');

        var products = [{
            header: 'Highcharts',
            name: 'highcharts',
            changelogId: 'hc-changelog',
            offset: ''
        }, {
            header: 'Highcharts Stock',
            name: 'highcharts-stock',
            changelogId: 'hs-changelog',
            offset: 'hs-'
        }, {
            header: 'Highcharts Maps',
            name: 'highcharts-maps',
            changelogId: 'hm-changelog',
            offset: 'hm-'
        }, {
            header: 'Highcharts Gantt',
            name: 'highcharts-gantt',
            changelogId: 'hg-changelog',
            offset: 'hg-'
        }, {
            header: 'Highcharts Dashboards',
            name: 'highcharts-dashboards',
            cangelogId: 'hd-changelog',
            offset: 'hd-'
        }];

        var changelog = {
            header: {
                productName: '',
                version: '',
                date: '',
                offset: ''
            },
            features: [],
            upgradeNotes: [],
            bugFixes: []
        };

        var htmlContent = '';


        function sortMarkdownFileContent(mdContent) {
            let write = 'New features';
            let changelogTitle;

            changelog.features = marked.lexer('');
            changelog.upgradeNotes = marked.lexer('');
            changelog.bugFixes = marked.lexer('');

            marked.lexer(mdContent).forEach((token, index) => {
                if (index === 0) {
                    changelogTitle = token.text.split(' ');

                    const date = changelogTitle[changelogTitle.length - 1];
                    if (date !== '()') {
                        changelog.header.date = date;
                    }
                    return;
                }
                if (
                    token.type === 'heading' &&
                    (
                        token.text === 'Upgrade notes' ||
                        token.text === 'Bug fixes'
                    )
                ) {
                    write = token.text;
                    return;
                }
                switch (write) {
                    case 'New features':
                        changelog.features.push(token);
                        break;
                    case 'Upgrade notes':
                        changelog.upgradeNotes.push(token);
                        break;
                    case 'Bug fixes':
                        changelog.bugFixes.push(token);
                        break;
                    default:
                        break;
                }
            });
        }

        function topHTMLContent() {
            return (
                `<div id="changelog">
                <div class="content-container container">
                <div class="row">
                <div class="col-md-12">
                <p style="text-align: center;">View changelog for
                <a href="#highcharts">Highcharts</a>,
                <a href="#highcharts-stock">Highcharts Stock</a>,
                <a href="#highcharts-maps">Highcharts Maps</a>,
                <a href="#highcharts-gantt">Highcharts Gantt</a>. Go to the
                <a href="download">Download</a> page to get the latest version.</p>`
            );
        }
        function productHeaderHTMLStructure(product) {
            return (
                `<div id="${product.changelogId}">
                <div class="changelog-header">
                <h2 id="${product.name}">${product.header}</h2>
                </div>
                <div class="changelog-container">`);
        }
        function makeDownloadLinks(version, name) {
            var filePrefixMap = {
                'highcharts-stock': 'Highstock',
                'highcharts-maps': 'Highmaps'
            };
            if (semver.satisfies(version, '>=8.1.0') || (name === 'highcharts' || name === 'highcharts-gantt')) {
                return name
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('-');
            }
            return filePrefixMap[name];
        }
        function featureHTMLStructure() {
            if (changelog.features) {
                const version = changelog.header.version.split('-').join('.');
                const id = changelog.header.name + '-v' + version;
                const name = changelog.header.name;
                const downloadLink = 'https://code.highcharts.com/zips/' + makeDownloadLinks(version, name) + '-' + version + '.zip';

                return (
                    `<h3 class="release-header">
                        <a id="${id}"></a>
                        <span>${changelog.header.productName} v${version} ${changelog.header.date}</span>
                        <a class="release-header-hashtag" href="#${id}">#</a>
                        <span class="download-link" ><a href="${downloadLink}" title="Download the zip archive for ${changelog.header.productName} v${version}"><i class="fas fa-download"></i></a></span>
                    </h3>
                    ${marked.parser(changelog.features)}`
                );
            }
            return '';
        }
        function upgradeNotesHTMLStructure() {
            const productName = changelog.header.name;
            const id = productName.charAt(0).toUpperCase() + productName.slice(1);
            const version = changelog.header.version.split('-').join('.');
            if (changelog.upgradeNotes.length > 0) {
                return (
                    `<div id="${changelog.header.offset}heading-${changelog.header.version}-upgrade-notes" class="card-header">
                    <h4 class="card-title">
                    <button aria-label="Upgrade Notes ${id} v${version}" aria-expanded="false" class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#upgrade-notes-${changelog.header.offset}${changelog.header.version}"><span> Upgrade notes </span></button>
                    </h4>
                    </div>
                    <div id="upgrade-notes-${changelog.header.offset}${changelog.header.version}" class="collapse" aria-labelledby="${changelog.header.offset}heading-${changelog.header.version}-bug-fixes" data-parent=".accordion">
                    <div class="card-body">
                    ${marked.parser(changelog.upgradeNotes)}
                    </div>
                    </div>`);
            }
            return '';
        }
        function bugFixesHTMLStructure() {
            const productName = changelog.header.name;
            const id = productName.charAt(0).toUpperCase() + productName.slice(1);
            const version = changelog.header.version.split('-').join('.');
            if (changelog.bugFixes.length > 0) {
                return (
                    `<div id="${changelog.header.offset}heading-${changelog.header.version}-bug-fixes"class="card-header">
                    <h4 class="card-title" aria-label="Bug Fixes ${id} v${version}">
                    <button aria-label="Bug Fixes ${id} v${version}"aria-expanded="false" class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#bug-fixes-${changelog.header.offset}${changelog.header.version}"><span> Bug fixes </span></button>
                    </h4>
                    </div>
                    <div id="bug-fixes-${changelog.header.offset}${changelog.header.version}" class="collapse" aria-labelledby="${changelog.header.offset}heading-${changelog.header.version}-bug-fixes" data-parent=".accordion">
                    <div class="card-body">
                    ${marked.parser(changelog.bugFixes)}
                    </div>
                    </div>`);
            }
            return '';
        }
        function upgradeAndBugContainer() {
            if (changelog.upgradeNotes.length > 0 ||
                changelog.bugFixes.length > 0) {
                return (
                    `<div class="accordion card-group">
                    <div class="card">
                    ${upgradeNotesHTMLStructure()}
                    ${bugFixesHTMLStructure()}
                    </div>
                    </div>`);
            }
            return '';
        }
        function bottomHTMLContent() {
            return (`</div>
                    </div>
                    </div>
                    </div>`);
        }
        function endProductHTMLStructure() {
            return ('</div> </div>');
        }

        function formatVersionNumber(versionNumber) {
            return versionNumber.split('.').join('-').slice(0, -3);
        }

        function writeContentToNewHTMLFile() {
            var outputFile = path.join(__dirname, (process.argv[2] || 'changelog') + '.html');
            fs.writeFile(outputFile, pretty(htmlContent), function (err) {
                if (err) {
                    reject(err);
                }
                resolve({ outputFile });
            });
        }

        function getSortedDirFiles(files) {
            const versionFiles = files.map(file => file.replace('.md', ''));
            const sortedVersions = versionFiles
                .filter(v => semver.valid(v.replace('-modified', '')))
                .sort((v1, v2) => {
                    if (v1.includes(v2) && v1.includes('-modified')) {
                        return -1;
                    }
                    if (v2.includes(v1) && v2.includes('-modified')) {
                        return 1;
                    }
                    return semver.rcompare(v1, v2);
                });
            return sortedVersions.map(file => file + '.md');
        }

        htmlContent += topHTMLContent();
        /**
         * Goes synchronous through each markdown file in each directory and captures it's content
         */
        products.forEach(product => {
            changelog.header.productName = product.header;
            changelog.header.name = product.name;
            changelog.header.offset = product.offset;
            htmlContent += productHeaderHTMLStructure(product);
            var sortedDir = getSortedDirFiles(fs.readdirSync(
                path.join(__dirname, product.name)
            ));
            sortedDir.forEach(file => {
                var content = fs.readFileSync(
                    path.join(__dirname, product.name, file), 'utf8'
                );

                if (content.indexOf('[Edit]') !== -1) {
                    throw new Error(
                        'Review links found inside the markdown. Generate again without --review.\n' +
                        path.join(__dirname, product.name, file)
                    );
                }

                sortMarkdownFileContent(content);
                changelog.header.version = formatVersionNumber(file);
                htmlContent += featureHTMLStructure();
                htmlContent += upgradeAndBugContainer();
            });
            htmlContent += endProductHTMLStructure();
        });
        htmlContent += bottomHTMLContent();
        writeContentToNewHTMLFile();
    });
}

// If called directly, run generateHTML now. Otherwise, it's called from
// upload.js
if (require.main === module) {
    generateHTML()
        .then(params => {
            console.log(params.outputFile + ' was successfully created!');
        })
        .catch(e => console.error(e));
}

module.exports = { generateHTML };
