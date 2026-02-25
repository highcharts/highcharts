// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

import { visit } from 'unist-util-visit';
import gridProPlugin from './src/remark/gridProPlugin.js';
import iframePlugin from './src/remark/iframePlugin.js';
import customStartMessagePlugin from './plugins/custom-start-message.js';

// Plugin to remove iframe styles that can not be parsed as JSX
function removeIframeStyle() {
    return async function (ast) {
        visit(ast, 'mdxJsxFlowElement', node => {
            if (node.name === 'iframe') {
                if (Array.isArray(node.attributes)) {
                    const styleAttr = node.attributes.find(el => el.name === 'style');

                    if (styleAttr && typeof styleAttr.value === 'string') {
                        // Remove from node.attributes
                        node.attributes = node.attributes.filter(el => el.name !== 'style');
                    }
                }
            }

        });
    };
}

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Highcharts Documentation (preview)',
    favicon: 'img/highcharts-logo.svg',

    // Set the production url of your site here
    url: 'https://www.highcharts.com',
    baseUrl: '/',

    onBrokenLinks: 'throw',
    onDuplicateRoutes: 'warn',

    // Markdown configuration
    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'warn'
        }
    },

    i18n: {
        defaultLocale: 'en',
        locales: ['en']
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    path: '../../docs',
                    sidebarPath: '../../docs/sidebars.js',
                    routeBasePath: '/docs/',
                    exclude: ['**/Readme.md'],
                    remarkPlugins: [
                        removeIframeStyle,
                        iframePlugin,
                        gridProPlugin
                    ]
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css'
                }
            })
        ]
    ],
    plugins: [
        customStartMessagePlugin,
        [
            'docusaurus-plugin-llms',
            {
                generateLLMsTxt: true,
                generateLLMsFullTxt: true,
                docsDir: '../../docs',
                pathTransformation: {
                    ignorePaths: ['../../docs']
                }
            }
        ]
    ],
    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            colorMode: {
                defaultMode: 'light',
                disableSwitch: true,
                respectPrefersColorScheme: true
            },
            navbar: {
                // hideOnScroll: true
            },
            footer: {
                style: 'dark',
                links: [],
                copyright: 'Highsoft for all eternity'
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula
            }
        })
};

export default config;
