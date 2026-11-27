import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, sep } from 'node:path';
import { defineConfig } from 'vite';
import { browserCases } from './browser-cases.mjs';

const { dependencies } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const products = {
    '@highcharts/grid-lite': 'Grid Lite',
    '@highcharts/grid-pro': 'Grid Pro',
    highcharts: 'Highcharts'
};
const packageName = Object.keys(products).find(name => Object.hasOwn(dependencies, name));
const packageDirectory = join('node_modules', packageName);
const product = products[packageName];
const inventory = `bundled-${packageName.replace(/^@highcharts\//u, '')}.json`;
const reactPlugin = '@vitejs/plugin-react';
const frameworkPlugins = packageName === 'highcharts' ? [(await import(reactPlugin)).default()] : [];

export default defineConfig({
    plugins: [
        ...frameworkPlugins,
        {
            name: 'check-consumer-package',
            generateBundle(_options, bundle) {
                const root = realpathSync(packageDirectory);
                const files = new Set();
                for (const chunk of Object.values(bundle)) {
                    if (chunk.type !== 'chunk') {
                        continue;
                    }
                    for (const id of Object.keys(chunk.modules)) {
                        const file = id.split('?')[0];
                        if (!isAbsolute(file) || !file.includes(`${sep}${packageDirectory}${sep}`)) {
                            continue;
                        }
                        const resolved = realpathSync(file);
                        if (!resolved.startsWith(root + sep)) {
                            this.error(`Unexpected ${product} module: ${resolved}`);
                        }
                        files.add(relative(root, resolved).split(sep).join('/'));
                    }
                }
                for (const required of browserCases.flatMap(({ modules }) => modules)) {
                    if (!files.has(required)) {
                        this.error(`Missing ${product} module in production bundle: ${packageName}/${required}`);
                    }
                }
                writeFileSync(inventory, JSON.stringify([...files].sort(), null, 2));
            }
        }
    ],
    build: {
        rolldownOptions: {
            input: browserCases.map(({ page }) => page)
        }
    }
});
