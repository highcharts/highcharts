package com.highcharts.export.util;

import java.io.ByteArrayOutputStream;
import java.io.StringReader;

import org.apache.batik.transcoder.SVGAbstractTranscoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.JPEGTranscoder;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.fop.svg.PDFTranscoder;

public class SVGRasterizer {

	private static final SVGRasterizer INSTANCE = new SVGRasterizer();

	public static final SVGRasterizer getInstance() {
		return INSTANCE;
	}

	private SVGRasterizer() {
	}

	public synchronized ByteArrayOutputStream transcode(
			ByteArrayOutputStream stream, String svg, MimeType mime, Float width)
			throws SVGRasterizerException, TranscoderException {

		TranscoderInput input = new TranscoderInput(new StringReader(svg));
		// Create the transcoder output
		TranscoderOutput transOutput = new TranscoderOutput(stream);
		// get right Transcoder, depends on mime
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
		
		if(transcoder == null){
			throw new SVGRasterizerException("MimeType not supported");
		}
		
		return transcoder;
	}
}
