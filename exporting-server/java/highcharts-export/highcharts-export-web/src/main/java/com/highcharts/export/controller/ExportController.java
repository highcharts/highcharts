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

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import org.apache.commons.io.FileUtils;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequestMapping("/")
public class ExportController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Float MAX_WIDTH = 2000.0F;
	private static final Float MAX_SCALE = 4.0F;
	protected static Logger logger = Logger.getLogger("exporter");

	/*for test*/
	/*@Autowired
	private ServletContext servletContext;*/

	@Autowired
	private TempDir tempDir;

	/* end*/

	@Resource(name = "svgConverter")
	private SVGConverter converter;

	/* Catch All */
	@RequestMapping(method = RequestMethod.POST)
	public void exporter(
		@RequestParam(value = "svg", required = false) String svg,
		@RequestParam(value = "type", required = false) String type,
		@RequestParam(value = "filename", required = false) String filename,
		@RequestParam(value = "width", required = false) String width,
		@RequestParam(value = "scale", required = false) String scale,
		@RequestParam(value = "options", required = false) String options,
		@RequestParam(value = "constr", required = false) String constructor,
		@RequestParam(value = "callback", required = false) String callback,
		HttpServletResponse response, HttpServletRequest request) throws ServletException, InterruptedException, SVGConverterException, NoSuchElementException, PoolException, TimeoutException, IOException {

		MimeType mime = getMime(type);
		ByteArrayOutputStream stream = processRequest(svg, mime, width, scale, options, constructor, callback, false);
		filename = getFilename(filename);
		response.reset();
		response.setCharacterEncoding("utf-8");
		response.setContentLength(stream.size());
		response.setStatus(HttpStatus.OK.value());
		response.setHeader("Content-disposition", "attachment; filename=\""
						+ filename + "." + mime.name().toLowerCase() + "\"");
		IOUtils.write(stream.toByteArray(), response.getOutputStream());
		response.flushBuffer();
	}

	private ByteArrayOutputStream processRequest(String svg, MimeType mime, String width, String scale, String options, String constructor, String callback, boolean async) throws SVGConverterException, PoolException, NoSuchElementException, TimeoutException, ServletException {

		Float parsedWidth = widthToFloat(width);
		Float parsedScale = scaleToFloat(scale);
		options = sanitize(options);
		String input;

		boolean convertSvg = false;
		ByteArrayOutputStream stream = null;

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
			try {
				String convertedSvg = converter.redirectSVG(input, async);
				stream = new ByteArrayOutputStream();
				stream.write(convertedSvg.getBytes("utf-8"));
			} catch (UnsupportedEncodingException ueex) {
				logger.error("Cannot encode this string, while writing SVG to stream. " + ueex.getMessage());
				throw new SVGConverterException("Error while converting " + ueex.getMessage());
			} catch (IOException ioex) {
				logger.error("Cannot write SVG to stream. " + ioex.getMessage());
				throw new SVGConverterException("Error while converting " + ioex.getMessage());
			}
		} else {
			stream = converter.convert(input, mime, constructor, callback, parsedWidth, parsedScale, async);
		}

		if (stream == null) {
			throw new ServletException("Error while converting");
		}

		return stream;
	}

	@RequestMapping(value = "/async",  method = RequestMethod.POST, consumes = { "application/json" })
	public void async(@RequestBody String json, HttpServletResponse response ) throws IOException, SVGConverterException, PoolException, NoSuchElementException, TimeoutException, ServletException {

		Gson gson = new Gson();
		Type type = new TypeToken<Map<String, String>>(){}.getType();
		Map<String, String> map = gson.fromJson(json, type);

		MimeType mime = MimeType.get(map.get("type"));
		ByteArrayOutputStream stream = processRequest(map.get("svg"), mime, map.get("width"), map.get("scale"),
				map.get("options"), map.get("constructor"), map.get("callback"), true);

		response.reset();
		response.setCharacterEncoding("utf-8");
		response.setContentLength(stream.size());
		response.setStatus(HttpStatus.OK.value());
		// without this line, you get an error message in the client
		response.setHeader("Access-Control-Allow-Origin", "*");
		IOUtils.write(stream.toByteArray(), response.getOutputStream());
		response.flushBuffer();
    }

	@RequestMapping(value = "/files/{name}.{ext}", method = RequestMethod.GET)
	public void getFile(@PathVariable("name") String name, @PathVariable("ext") String ext, HttpServletResponse response) throws IOException {
		Path path = Paths.get(TempDir.getOutputDir().toString(), name + "." + ext);

		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		stream.write(FileUtils.readFileToByteArray(new File(path.toString())));
		MimeType mime = MimeType.valueOf(ext.toUpperCase());

		response.reset();
		response.setCharacterEncoding("utf-8");
		response.setContentLength(stream.size());
		response.setContentType(mime.getType());
		response.setStatus(HttpStatus.OK.value());
		IOUtils.write(stream.toByteArray(), response.getOutputStream());
		response.flushBuffer();

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
						"Timeout converting SVG, is your file this big, or maybe you have a syntax error in the javascript callback?");
		return modelAndView;
	}

	@ExceptionHandler(PoolException.class)
	public ModelAndView handleServerPoolException(Exception ex) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView
				.addObject(
						"message",
						"Sorry, the server is handling too many requests at the moment. Please try again.");
		return modelAndView;
	}

	@ExceptionHandler(SVGConverterException.class)
	public ModelAndView handleSVGRasterizeException(Exception ex) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView
				.addObject(
						"message",
						"Something went wrong while converting.");
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


	/* TEST */
	/*@RequestMapping(value = "/test/{fileName}", method = RequestMethod.GET)
	public ResponseEntity<byte[]> staticImagesDownload(
					 @PathVariable("fileName") String fileName) throws IOException {

		String imageLoc = servletContext.getRealPath("WEB-INF/benchmark");
		FileInputStream fis = new FileInputStream(imageLoc + "/" + fileName + ".png");

		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		byte[] buf = new byte[1024];
		try {
			for (int readNum; (readNum = fis.read(buf)) != -1;) {
				bos.write(buf, 0, readNum);
			}
		} catch (IOException ex) {
			// nothing here
		} finally {
			fis.close();
		}

		HttpHeaders responseHeaders = httpHeaderAttachment("TEST-" + fileName,  MimeType.PNG,
				bos.size());
		return new ResponseEntity<byte[]>(bos.toByteArray(),
				responseHeaders, HttpStatus.OK);
	}*/
	/* end TEST */


	/*
	 * Util methods
	 */

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

	public String getExtension(String filename) {
        if (filename == null) {
            return null;
        }
        int index = filename.indexOf(".");
        if (index == -1) {
            return "";
        } else {
            return filename.substring(index + 1);
        }
    }

}