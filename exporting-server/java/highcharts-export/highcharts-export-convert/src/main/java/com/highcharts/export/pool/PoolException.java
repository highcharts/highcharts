/**
 * @license Highcharts JS v2.3.3 (2012-11-02)
 *
 * (c) 20012-2014
 *
 * Author: Gert Vaartjes
 *
 * License: www.highcharts.com/license
 */
package com.highcharts.export.pool;

public class PoolException extends Exception {

	private static final long serialVersionUID = 3925816328286206059L;
	private final String mistake;

	public PoolException() {
		super();
		mistake = "unknown to men";
	}

	public PoolException(String err) {
		super(err); // call super class constructor
		mistake = err; // save message
	}

	public String getError() {
		return mistake;
	}

}
