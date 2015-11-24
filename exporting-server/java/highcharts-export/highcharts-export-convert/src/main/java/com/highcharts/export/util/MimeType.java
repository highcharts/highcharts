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
import java.util.Iterator;
import java.util.Map;

public enum MimeType {
	PNG("image/png", "png"),
	JPEG("image/jpeg", "jpeg"),
	PDF("application/pdf", "pdf"),
	SVG("image/svg+xml", "svg");
	
	private String type;
	private String extension;

	MimeType(String type, String extension) {
		this.type = type;
		this.extension = extension;
	}

	public String getType() {
		return type;
	}

	public String getExtension() {
		return extension;
	}

	public static MimeType get(String typeOrExtension) {
		for (MimeType m : EnumSet.allOf(MimeType.class)) {
			if (m.getType().equalsIgnoreCase(typeOrExtension) || m.getExtension().equalsIgnoreCase(typeOrExtension)) {
				return m;
			}
		}
		
		return MimeType.PNG;
		
		/*Iterator it = lookup.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pair = (Map.Entry)it.next();
			if 
		}
		
		// Check first if we give in the name of the mime, like svg, png, pfd
		MimeType mime = MimeType.valueOf(type.toUpperCase());
		if (mime != null) {
			return mime;
		}

		// if not matched above, check if we can lookup the mime based on the content-type
		mime = lookup.get(type);
		if (mime != null) {
			return mime;
		}
		// else return default
		return MimeType.PNG;*/
	}
}