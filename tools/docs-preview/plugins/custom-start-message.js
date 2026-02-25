/**
 * Custom plugin to display the correct docs URL on startup
 *
 * @return {object} Plugin object
 */
export default function customStartMessagePlugin() {
    return {
        name: 'custom-start-message',

        configureWebpack(_config, isServer) {
            if (isServer || process.env.NODE_ENV !== 'development') {
                return {};
            }

            return {
                plugins: [
                    {
                        apply: compiler => {
                            let hasShownMessage = false;

                            compiler.hooks.done.tap('CustomStartMessage', () => {
                                if (!compiler.watchMode || hasShownMessage) {
                                    return;
                                }
                                hasShownMessage = true;

                                // Get port from context or default
                                const port = process.env.PORT || 3000;
                                const host = process.env.HOST || 'localhost';
                                const protocol = process.env.HTTPS ? 'https' : 'http';
                                const docsUrl = `${protocol}://${host}:${port}/docs/`;

                                // eslint-disable-next-line no-console
                                console.log(
                                    `\n✨ Docs are available at: \x1b[36m${docsUrl}\x1b[0m\n`
                                );
                            });
                        }
                    }
                ]
            };
        }
    };
}
