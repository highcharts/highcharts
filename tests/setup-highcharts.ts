import { run } from '../tools/gulptasks/lib/gulp.js';
import '../tools/gulptasks/scripts.js';
import '../tools/gulptasks/scripts-css.js';
import '../tools/gulptasks/scripts-messages.js';
import '../tools/gulptasks/scripts-webpack.js';
import '../tools/gulptasks/scripts-code.js';
import '../tools/gulptasks/scripts-ts.js';

run('scripts');
