/**
 * @license Highcharts JS v2.3.3 (2012-11-02)
 *
 * (c) 20012-2014
 *
 * Author: Gert Vaartjes
 *
 * License: www.highcharts.com/license
 */
package com.highcharts.export.controller;

public class ZeroRequestParameterException extends Exception {

	private static final long serialVersionUID = -5110552374074051446L;
	private String mistake;

	public ZeroRequestParameterException() {
		super();
		mistake = "unknown to men";
	}

	public ZeroRequestParameterException(String err) {
		super(err);
		mistake = err;
	}

	public String getError() {
		return mistake;
	}

}
