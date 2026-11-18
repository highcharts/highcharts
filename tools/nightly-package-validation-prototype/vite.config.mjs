import react from '@vitejs/plugin-react';
import { realpathSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, sep } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'check-highcharts-package',
            generateBundle(_options, bundle) {
                const root = realpathSync('node_modules/highcharts');
                const files = new Set();
                for (const chunk of Object.values(bundle)) {
                    if (chunk.type !== 'chunk') {
                        continue;
                    }
                    for (const id of Object.keys(chunk.modules)) {
                        const file = id.split('?')[0];
                        if (!isAbsolute(file) || !file.includes(`${sep}node_modules${sep}highcharts${sep}`)) {
                            continue;
                        }
                        const resolved = realpathSync(file);
                        if (!resolved.startsWith(root + sep)) {
                            this.error(`Unexpected Highcharts module: ${resolved}`);
                        }
                        files.add(relative(root, resolved));
                    }
                }
                for (const required of [
                    'highcharts.js',
                    'modules/annotations.js',
                    'es-modules/masters/highcharts.src.js'
                ]) {
                    if (!files.has(required)) {
                        this.error(`Missing Highcharts module in production bundle: ${required}`);
                    }
                }
                writeFileSync('bundled-highcharts.json', JSON.stringify([...files].sort(), null, 2));
            }
        }
    ],
    build: {
        rolldownOptions: {
            input: { core: 'app/core.html', react: 'app/react.html' }
        }
    }
});
