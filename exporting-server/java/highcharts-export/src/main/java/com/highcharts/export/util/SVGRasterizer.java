/**
 * @license Highcharts JS v2.3.3 (2012-11-02)
 *
 * (c) 20012-2014
 * 
 * Author: Gert Vaartjes
 *
 * License: www.highcharts.com/license
 */
package com.highcharts.export.util;

import java.io.ByteArrayOutputStream;
import java.io.StringReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.batik.transcoder.SVGAbstractTranscoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.JPEGTranscoder;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.fop.svg.PDFTranscoder;
import org.apache.log4j.Logger;

public class SVGRasterizer {

	protected static Logger logger = Logger.getLogger("rasterizer");
	private static final SVGRasterizer INSTANCE = new SVGRasterizer();

	public static final SVGRasterizer getInstance() {
		return INSTANCE;
	}

	private SVGRasterizer() {
	}

	public synchronized ByteArrayOutputStream transcode(
			ByteArrayOutputStream stream, String svg, MimeType mime,
			Float width, Float scale) throws SVGRasterizerException,
			TranscoderException {

		TranscoderInput input = new TranscoderInput(new StringReader(svg));
		TranscoderOutput transOutput = new TranscoderOutput(stream);
		// get right Transcoder, this depends on the mime
		SVGAbstractTranscoder transcoder = SVGRasterizer.getTranscoder(mime);

		if (width != null) {
			/*
			 * If the raster image height is not provided (using the
			 * KEY_HEIGHT), the transcoder will compute the raster image height
			 * by keeping the aspect ratio of the SVG document.
			 */
			transcoder.addTranscodingHint(SVGAbstractTranscoder.KEY_WIDTH,
					width);
		}

		if (width == null && scale != null && scale != 0.00) {
			Float svgWidth = getWidthFromSvg(svg);
			// calculate width from svg
			if (svgWidth != null) {
				transcoder.addTranscodingHint(SVGAbstractTranscoder.KEY_WIDTH,
						svgWidth * scale);
			}
		}

		transcoder.transcode(input, transOutput);

		return stream;
	}

	public static SVGAbstractTranscoder getTranscoder(MimeType mime)
			throws SVGRasterizerException {

		SVGAbstractTranscoder transcoder = null;

		switch (mime) {
		case PNG:
			transcoder = new PNGTranscoder();
			break;
		case JPEG:
			transcoder = new JPEGTranscoder();
			transcoder.addTranscodingHint(JPEGTranscoder.KEY_QUALITY,
					new Float(0.9));
			break;
		case PDF:
			transcoder = new PDFTranscoder();
			break;
		default:
			// do nothing
			break;
		}

		if (transcoder == null) {
			throw new SVGRasterizerException("MimeType not supported");
		}

		return transcoder;
	}

	public Float getWidthFromSvg(String svg) {
		Pattern pattern = Pattern.compile("^<svg[^>]*width=\\\"([0-9]+)",
				Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(svg);
		if (matcher.lookingAt()) {
			return Float.valueOf(matcher.group(1));
		}
		return null;
	}
}
