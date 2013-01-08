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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.concurrent.TimeoutException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.batik.transcoder.TranscoderException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.highcharts.export.util.MimeType;
import com.highcharts.export.util.SVGCreator;
import com.highcharts.export.util.SVGRasterizer;
import com.highcharts.export.util.SVGRasterizerException;

@Controller
@RequestMapping("/")
public class ExportController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String FORBIDDEN_WORD = "<!ENTITY";
	private static final Float MAX_WIDTH = 2000.0F;
	private static final Float MAX_SCALE = 4.0F;
	protected static Logger logger = Logger.getLogger("exporter");

	@Autowired
	ServletContext servletContext;

	/* Catch All */
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<byte[]> exporter(
			@RequestParam(value = "svg", required = false) String svg,
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "filename", required = false) String filename,
			@RequestParam(value = "width", required = false) String width,
			@RequestParam(value = "scale", required = false) String scale,
			@RequestParam(value = "options", required = false) String options,
			@RequestParam(value = "constr", required = false) String constructor,
			@RequestParam(value = "callback", required = false) String callback)
			throws ServletException, IOException, InterruptedException,
			TimeoutException {

		MimeType mime = getMime(type);
		filename = getFilename(filename);
		Float parsedWidth = widthToFloat(width);
		Float parsedScale = scaleToFloat(scale);

		ByteArrayOutputStream stream = new ByteArrayOutputStream();

		// check if the svg contains a svg-batik exploit.
		if (svg != null
				&& (svg.indexOf(FORBIDDEN_WORD) > -1 || svg
						.indexOf(FORBIDDEN_WORD.toLowerCase()) > -1)) {
			throw new ServletException(
					"The - svg - post parameter could contain a malicious attack");
		}

		if (options != null && !options.isEmpty()) {
			// create a svg file out of the options
			String location = servletContext.getRealPath("/") + "/WEB-INF";

			svg = SVGCreator.getInstance().createSVG(location, options,
					constructor, callback);
			if (svg.equals("no-svg")) {
				throw new ServletException(
						"Could not create an SVG out of the options");
			}
		}

		if (svg == null || svg.isEmpty() || svg.equalsIgnoreCase("undefined")) {
			throw new ServletException(
					"The manadatory svg POST parameter is undefined.");
		}

		try {
			ExportController.convert(stream, svg, filename, mime, parsedWidth,
					parsedScale);
		} catch (IOException e) {
			e.printStackTrace();
		}

		HttpHeaders responseHeaders = httpHeaderAttachment(filename, mime,
				stream.size());
		return new ResponseEntity<byte[]>(stream.toByteArray(),
				responseHeaders, HttpStatus.OK);
	}

	@RequestMapping(value = "/demo", method = RequestMethod.GET)
	public String demo() {
		return "demo";
	}

	/* catch all GET requests and redirect those */
	@RequestMapping(method = RequestMethod.GET)
	public String getAll() {
		return "redirect:demo";
	}

	@ExceptionHandler(IOException.class)
	public ModelAndView handleIOException(Exception ex) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView.addObject("message", ex.getMessage());
		return modelAndView;
	}

	@ExceptionHandler(TimeoutException.class)
	public ModelAndView handleTimeoutException(Exception ex) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView
				.addObject(
						"message",
						"It took too long time to process the options, no SVG is created. Make sure your javascript is correct");
		return modelAndView;
	}

	@ExceptionHandler(InterruptedException.class)
	public ModelAndView handleInterruptedException(Exception ex) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView
				.addObject(
						"message",
						"It took too long time to process the options, no SVG is created. Make sure your javascript is correct");
		return modelAndView;
	}

	@ExceptionHandler(ServletException.class)
	public ModelAndView handleServletException(Exception ex) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView.addObject("message", ex.getMessage());
		return modelAndView;
	}

	/*
	 * Util methods
	 */

	public static void convert(ByteArrayOutputStream stream, String svg,
			String filename, MimeType mime, Float width, Float scale)
			throws IOException, ServletException {

		if (!MimeType.SVG.equals(mime)) {
			try {
				stream = SVGRasterizer.getInstance().transcode(stream, svg,
						mime, width, scale);
			} catch (SVGRasterizerException sre) {
				logger.error("Error while transcoding svg file to an image",
						sre);
				stream.close();
				throw new ServletException(
						"Error while transcoding svg file to an image");
			} catch (TranscoderException te) {
				logger.error("Error while transcoding svg file to an image", te);
				stream.close();
				throw new ServletException(
						"Error while transcoding svg file to an image");
			}
		} else {
			stream.write(svg.getBytes());
		}
	}

	public static HttpHeaders httpHeaderAttachment(final String filename,
			final MimeType mime, final int fileSize) {
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("charset", "utf-8");
		responseHeaders
				.setContentType(MediaType.parseMediaType(mime.getType()));
		responseHeaders.setContentLength(fileSize);
		responseHeaders.set("Content-disposition", "attachment; filename=\""
				+ filename + "." + mime.name().toLowerCase() + "\"");
		return responseHeaders;

	}

	private String getFilename(String name) {
		return (name != null) ? name : "chart";
	}

	private static MimeType getMime(String mime) {
		MimeType type = MimeType.get(mime);
		if (type != null) {
			return type;
		}
		return MimeType.PNG;
	}

	private static Float widthToFloat(String width) {
		if (width != null && !width.isEmpty()
				&& !(width.compareToIgnoreCase("undefined") == 0)) {
			Float parsedWidth = Float.valueOf(width);
			if (parsedWidth.compareTo(MAX_WIDTH) > 0) {
				return MAX_WIDTH;
			}
			if (parsedWidth.compareTo(0.0F) > 0) {
				return parsedWidth;
			}
		}
		return null;
	}

	private static Float scaleToFloat(String scale) {
		if (scale != null && !scale.isEmpty()
				&& !(scale.compareToIgnoreCase("undefined") == 0)) {
			Float parsedScale = Float.valueOf(scale);
			if (parsedScale.compareTo(MAX_SCALE) > 0) {
				return MAX_SCALE;
			} else if (parsedScale.compareTo(0.0F) > 0) {
				return parsedScale;
			}
		}
		return null;
	}
}