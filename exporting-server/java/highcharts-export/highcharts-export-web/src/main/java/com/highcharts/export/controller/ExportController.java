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
import java.util.NoSuchElementException;
import java.util.concurrent.TimeoutException;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.highcharts.export.converter.SVGConverter;
import com.highcharts.export.converter.SVGConverterException;
import com.highcharts.export.pool.PoolException;
import com.highcharts.export.util.MimeType;
import com.highcharts.export.util.TempDir;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import javax.servlet.http.HttpSession;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

@Controller
@RequestMapping("/")
public class ExportController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Float MAX_WIDTH = 2000.0F;
	private static final Float MAX_SCALE = 4.0F;
	protected static Logger logger = Logger.getLogger("exporter");

	@Resource(name = "svgConverter")
	private SVGConverter converter;

	/* catch all GET requests and redirect those */
	@RequestMapping(method = RequestMethod.GET)
	public String getAll(HttpSession session) {

		String tempFile = (String) session.getAttribute("tempFile");
		session.removeAttribute("tempFile");

		if (tempFile != null && !tempFile.isEmpty()) {
			// redirect to file download
			return "redirect:" + TempDir.getDownloadLink(tempFile);
		}
		// redirect to demo page
		return "redirect:demo";
	}


	@RequestMapping(value = "/demo", method = RequestMethod.GET)
	public String demo() {
		return "demo";
	}

	@RequestMapping(method = RequestMethod.POST)
	public HttpEntity<byte[]> exporter(
		@RequestParam(value = "svg", required = false) String svg,
		@RequestParam(value = "type", required = false) String type,
		@RequestParam(value = "filename", required = false) String filename,
		@RequestParam(value = "width", required = false) String width,
		@RequestParam(value = "scale", required = false) String scale,
		@RequestParam(value = "options", required = false) String options,
		@RequestParam(value = "constr", required = false) String constructor,
		@RequestParam(value = "callback", required = false) String callback,
		@RequestParam(value = "async", required = false, defaultValue = "false")  Boolean async,
		HttpServletRequest request,
		HttpSession session) throws ServletException, InterruptedException, SVGConverterException, NoSuchElementException, PoolException, TimeoutException, IOException {

		MimeType mime = getMime(type);
		String tempFilename = null;

		boolean isAndroid = request.getHeader("user-agent") != null && request.getHeader("user-agent").contains("Android");

		if (isAndroid || MimeType.PDF.equals(mime) || async) {
			tempFilename = createUniqueFileName(mime.name().toLowerCase());
		}

		String output = processRequest(svg, mime, width, scale, options, constructor, callback, tempFilename);
		ByteArrayOutputStream stream;

		if (async) {
			String link = TempDir.getDownloadLink(tempFilename);
			// write to stream
			stream = new ByteArrayOutputStream();
			stream.write(link.getBytes("utf-8"));
		} else {
			stream = ouputToStream(output, mime, tempFilename);
		}

		/* If tempFilename is not null, then we want to save the filename in session, in case of GET is used later on*/
		if (isAndroid) {
			session.setAttribute("tempFile", FilenameUtils.getName(tempFilename));
		}

		filename = getFilename(filename);

	    HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", mime.getType() + "; charset=utf-8");
		headers.add("Content-Disposition",
                   "attachment; filename=" + filename.replace(" ", "_") + "." + mime.name().toLowerCase());
		headers.setContentLength(stream.size());

		return new HttpEntity<byte[]>(stream.toByteArray(), headers);
	}

	@RequestMapping(value = "/files/{name}.{ext}", method = RequestMethod.GET)
	public void getFile(@PathVariable("name") String name, @PathVariable("ext") String ext, HttpServletResponse response) throws SVGConverterException, IOException {
		Path path = Paths.get(TempDir.getOutputDir().toString(), name + "." + ext);

		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		try {
			stream.write(FileUtils.readFileToByteArray(new File(path.toString())));
		} catch (IOException ioex) {
			logger.error("Tried to read file from filesystem: " + ioex.getMessage());
			throw new SVGConverterException("IOException: cannot find your file to download...");
		}

		MimeType mime = MimeType.valueOf(ext.toUpperCase());

		response.reset();
		response.setCharacterEncoding("utf-8");
		response.setContentLength(stream.size());
		response.setContentType(mime.getType());
		response.setStatus(HttpStatus.OK.value());
		IOUtils.write(stream.toByteArray(), response.getOutputStream());
		response.flushBuffer();

	}

	@ExceptionHandler(IOException.class)
	public ModelAndView handleIOException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView.addObject("message", ex.getMessage());
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(TimeoutException.class)
	public ModelAndView handleTimeoutException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView
				.addObject(
						"message",
						"Timeout converting SVG, is your file this big, or maybe you have a syntax error in the javascript callback?");
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(PoolException.class)
	public ModelAndView handleServerPoolException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView
				.addObject(
						"message",
						"Sorry, the server is handling too many requests at the moment. Please try again.");
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(SVGConverterException.class)
	public ModelAndView handleSVGRasterizeException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView
				.addObject(
						"message",
						"Something went wrong while converting. " + ex.getMessage());
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(InterruptedException.class)
	public ModelAndView handleInterruptedException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView
				.addObject(
						"message",
						"It took too long time to process the options, no SVG is created. Make sure your javascript is correct");
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(ServletException.class)
	public ModelAndView handleServletException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView.addObject("message", ex.getMessage());
		response.setStatus(500);
		return modelAndView;
	}

	/*
	 * UTILS METHODS
	 */

	private String processRequest(String svg, MimeType mime, String width, String scale, String options, String constructor, String callback, String filename) throws SVGConverterException, PoolException, NoSuchElementException, TimeoutException, ServletException {

		Float parsedWidth = widthToFloat(width);
		Float parsedScale = scaleToFloat(scale);
		options = sanitize(options);
		String input;
		String output;

		boolean convertSvg = false;

		if (options != null) {
			// create a svg file out of the options
			input = options;
			callback = sanitize(callback);
		} else {
			// assume SVG conversion
			if (svg == null) {
				throw new ServletException(
						"The manadatory svg POST parameter is undefined.");
			} else {
				svg = sanitize(svg);
				if (svg == null) {
					throw new ServletException(
							"The manadatory svg POST parameter is undefined.");
				}
				convertSvg = true;
				input = svg;
			}
		}

		if (convertSvg && mime.equals(MimeType.SVG)) {
				output = converter.redirectSVG(input, filename);
		} else {
			output = converter.convert(input, mime, constructor, callback, parsedWidth, parsedScale, filename);
		}

		return output;
	}

	private String getFilename(String name) {
		name = sanitize(name);
		return (name != null) ? name : "chart";
	}

	private static MimeType getMime(String mime) {
		MimeType type = MimeType.get(mime);
		if (type != null) {
			return type;
		}
		return MimeType.PNG;
	}

	private static String sanitize(String parameter) {
		if (parameter != null && !parameter.trim().isEmpty() && !(parameter.compareToIgnoreCase("undefined") == 0)) {
			return parameter.trim();
		}
		return null;
	}

	private static Float widthToFloat(String width) {
		width = sanitize(width);
		if (width != null) {
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
		scale = sanitize(scale);
		if (scale != null) {
			Float parsedScale = Float.valueOf(scale);
			if (parsedScale.compareTo(MAX_SCALE) > 0) {
				return MAX_SCALE;
			} else if (parsedScale.compareTo(0.0F) > 0) {
				return parsedScale;
			}
		}
		return null;
	}

	public String createUniqueFileName(String extension) {
		Path path = Paths.get(TempDir.outputDir.toString(), RandomStringUtils.randomAlphanumeric(8) + "." + extension);
		return path.toString();
	}

	private ByteArrayOutputStream ouputToStream(String output, MimeType mime, String filename) {
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		try {
			// for example with PDF files or async download
			if (output.equalsIgnoreCase(filename)) {
				stream.write(FileUtils.readFileToByteArray(new File(filename)));
			}

			if (filename == null) {
				if (mime.getExtension().equals("svg")) {
					stream.write(output.getBytes());
				} else {
					//decode the base64 string
					stream.write(Base64.decodeBase64(output));
				}
			}
		} catch (IOException ex) {
			java.util.logging.Logger.getLogger(ExportController.class.getName()).log(Level.SEVERE, null, ex);
		}

		return stream;
	}

}