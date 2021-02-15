import GUI from './GUI';
import Row from './Row';

class Layout {
	/* *
    *
    *  Constructors
    *
    * */
	public constructor(
		guiEnabled: boolean,
		options: Layout.Options
	) {
		this.options = options;

		if (guiEnabled) {
			new GUI(options);
		}

		this.setLayout();
	}

	/* *
	*
	*  Properties
	*
	* */
	public options: Layout.Options;
	/* *
	*
	*  Functions
	*
	* */
	public setLayout (): void {
		/*
		* TODO
		*
		* 1. Set reference to container
		* 2. Create layout structure
		* 3. Init cols
		* 4. Init rows
		*
		*/
	}
}

interface Layout {
	options: Layout.Options;
}
namespace Layout {
    export interface Options {
		rowClassName: string;
		colClassName: string;
        rows: Array<Row.Options>;
    }
}

export default Layout;
