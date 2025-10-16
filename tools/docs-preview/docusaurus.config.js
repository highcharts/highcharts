// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

import { visit } from 'unist-util-visit';

// Plugin to remove iframe styles that can not be parsed as JSX
const removeIframeStyle = () => {
    const transformer = async (ast) => {
        visit(ast, 'mdxJsxFlowElement', (node) => {
            if (node.name === 'iframe') {
                if(Array.isArray(node.attributes)) {
                    const styleAttr = node.attributes.find(el => el.name === 'style');

                    if(styleAttr && typeof styleAttr.value === 'string') {
                        // Remove from node.attributes
                        node.attributes = node.attributes.filter(el => el.name !== 'style');
                    }
                }
            }

        });
    };
    return transformer;
};

/** @type {import('@docusaurus/types').Config} */
    const config = {
        title: 'Highcharts Documentation (preview)',
        favicon: 'img/favicon.ico',

        // Set the production url of your site here
        url: 'https://www.highcharts.com',
        baseUrl: '/docs',

        onBrokenLinks: 'throw',
        onBrokenMarkdownLinks: 'warn',

        i18n: {
            defaultLocale: 'en',
            locales: ['en'],
        },

        presets: [
            [
                'classic',
                /** @type {import('@docusaurus/preset-classic').Options} */
                ({
                    docs: {
                        path: '../../docs',
                        sidebarPath: '../../docs/sidebars.js',
                        routeBasePath: '/',
                        remarkPlugins:[
                            removeIframeStyle
                        ]
                    },
                    blog: false,
                    theme: {
                        customCss: './src/css/custom.css',
                    },
                }),
            ],
        ],

        themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            colorMode: {
                defaultMode: 'light',
                disableSwitch: true,
                respectPrefersColorScheme: true,
            },
            navbar: {
                title: 'Highcharts Documentation',
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'docs',
                        position: 'left',
                        label: 'Docs',
                    }
                ],
            },
            footer: {
                style: 'dark',
                links: [],
                copyright: 'Highsoft for all eternity',
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
            },
        }),
    };

export default config;
