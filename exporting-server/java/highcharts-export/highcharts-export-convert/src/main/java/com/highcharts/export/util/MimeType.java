/**
 * @license Highcharts JS v2.3.3 (2012-11-02)
 *
 * (c) 2012-2014
 *
 * Author: Gert Vaartjes
 *
 * License: www.highcharts.com/license
 */
package com.highcharts.export.util;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum MimeType {
	PNG("image/png", "png"),
	JPEG("image/jpeg", "jpeg"),
	PDF("application/pdf", "pdf"),
	SVG("image/svg+xml", "svg");

	private static final Map<String, MimeType> lookup = new HashMap<>();

	static {
		for (MimeType m : EnumSet.allOf(MimeType.class)) {
			lookup.put(m.getType(), m);
		}
	}

	private String type;
	private String extension;

	private MimeType(String type, String extension) {
		this.type = type;
		this.extension = extension;
	}

	public String getType() {
		return type;
	}

	public String getExtension() {
		return extension;
	}

	public static MimeType get(String type) {
		MimeType mime = lookup.get(type);
		if (mime != null) {
			return mime;
		}
		return MimeType.PNG;
	}
}