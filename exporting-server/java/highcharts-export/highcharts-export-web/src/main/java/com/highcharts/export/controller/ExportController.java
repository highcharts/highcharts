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

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
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
import javax.servlet.http.HttpSession;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequestMapping("/")
public class ExportController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Float MAX_WIDTH = 2000.0F;
	private static final Float MAX_SCALE = 4.0F;
	protected static Logger logger = Logger.getLogger("exporter");

	@Autowired
	private SVGConverter converter;

	@RequestMapping(value = "/demo", method = RequestMethod.GET)
	public String demo() {
		return "demo";
	}

	@RequestMapping(method = {RequestMethod.POST, RequestMethod.GET})
	public HttpEntity<byte[]> exporter(
		@RequestParam(value = "svg", required = false) String svg,
		@RequestParam(value = "type", required = false) String type,
		@RequestParam(value = "filename", required = false) String filename,
		@RequestParam(value = "width", required = false) String width,
		@RequestParam(value = "scale", required = false) String scale,
		@RequestParam(value = "options", required = false) String options,
        @RequestParam(value = "globaloptions", required = false) String globalOptions,
		@RequestParam(value = "constr", required = false) String constructor,
		@RequestParam(value = "callback", required = false) String callback,
		@RequestParam(value = "callbackHC", required = false) String callbackHC,
		@RequestParam(value = "async", required = false, defaultValue = "false")  Boolean async,
		@RequestParam(value = "jsonp", required = false, defaultValue = "false") Boolean jsonp,
		HttpServletRequest request,
		HttpSession session) throws ServletException, InterruptedException, SVGConverterException, NoSuchElementException, PoolException, TimeoutException, IOException, ZeroRequestParameterException {

		MimeType mime = getMime(type);
		String randomFilename = null;
		String jsonpCallback = "";
		boolean isAndroid = request.getHeader("user-agent") != null && request.getHeader("user-agent").contains("Android");

		if ("GET".equalsIgnoreCase(request.getMethod())) {

            // Handle redirect downloads for Android devices, these come in without request parameters
            String tempFile = (String) session.getAttribute("tempFile");
            session.removeAttribute("tempFile");

            if (tempFile != null && !tempFile.isEmpty()) {
				logger.debug("filename stored in session, read and stream from filesystem");				
				String basename = FilenameUtils.getBaseName(tempFile);
				String extension = FilenameUtils.getExtension(tempFile);

				return getFile(basename, extension);

            }
        }

        // check for visitors who don't know this domain is really only for the exporting service ;)
		if (request.getParameterMap().isEmpty()) {
			 throw new ZeroRequestParameterException();
        }

		/* Most JSONP implementations use the 'callback' request parameter and this overwrites
		 * the original callback parameter for chart creation with Highcharts. If JSONP is
		 * used we recommend using the requestparameter callbackHC as the callback for Highcharts.
		 * store the callback method name and reset the callback parameter,
		 * otherwise it will be used when creation charts
		 */
		if (jsonp) {
			async = true;
			jsonpCallback = callback;
			callback = null;

			if (callbackHC != null) {
				callback = callbackHC;
			}
        }
       
		if (isAndroid || MimeType.PDF.equals(mime) || async) {
			randomFilename = createRandomFileName(mime.name().toLowerCase());
		}

		/* If randomFilename is not null, then we want to save the filename in session, in case of GET is used later on*/
        if (isAndroid) {
            logger.debug("storing randomfile in session: " +  FilenameUtils.getName(randomFilename));
            session.setAttribute("tempFile", FilenameUtils.getName(randomFilename));
        }

		String output = convert(svg, mime, width, scale, options, constructor, callback, globalOptions, randomFilename);
		ByteArrayOutputStream stream;

		HttpHeaders headers = new HttpHeaders();

		if (async) {
			String link = TempDir.getDownloadLink(randomFilename);
            stream = new ByteArrayOutputStream();
            if (jsonp) {
                StringBuilder sb = new StringBuilder(jsonpCallback);
                sb.append("('");
                sb.append(link);
                sb.append("')");
                stream.write(sb.toString().getBytes("utf-8"));
                headers.add("Content-Type", "text/javascript; charset=utf-8");
            } else {
                stream.write(link.getBytes("utf-8"));
                headers.add("Content-Type", "text/html; charset=UTF-8");
            }
		} else {
			headers.add("Content-Type", mime.getType() + "; charset=utf-8");
			if (randomFilename != null && randomFilename.equals(output)) {
				stream = writeFileToStream(randomFilename);
			} else {
				boolean base64 = !mime.getExtension().equals("svg");
				stream = outputToStream(output, base64);
			}
			filename = getFilename(filename);
			headers.add("Content-Disposition",
                   "attachment; filename=" + filename.replace(" ", "_") + "." + mime.name().toLowerCase());
		}

		headers.setContentLength(stream.size());

		return new HttpEntity<byte[]>(stream.toByteArray(), headers);
	}

	@RequestMapping(value = "/files/{name}.{ext}", method = RequestMethod.GET)
	public HttpEntity<byte[]> getFile(@PathVariable("name") String name, @PathVariable("ext") String extension) throws SVGConverterException, IOException {
		
		Path path = Paths.get(TempDir.getOutputDir().toString(), name + "." + extension);
		String filename = path.toString();
		MimeType mime = getMime(extension);

		ByteArrayOutputStream stream = writeFileToStream(filename);

		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", mime.getType() + "; charset=utf-8");
		headers.setContentLength(stream.size());

		return new HttpEntity<byte[]>(stream.toByteArray(), headers);
	}

	@RequestMapping(value="/json/{name}.{ext}", method = RequestMethod.POST)
	public HttpEntity<byte[]> exportFromJson(
		@PathVariable("name") String name,
		@PathVariable("ext") String extension,
		@RequestBody String requestBody) throws SVGConverterException, TimeoutException, NoSuchElementException, PoolException {

		String randomFilename;
		randomFilename = null;
		String json = requestBody;
		MimeType mime = getMime(extension);

		// add outfile parameter to the json with a simple string replace
		if (MimeType.PDF.equals(mime)) {
			randomFilename = createRandomFileName(mime.name().toLowerCase());
			int ind = json.lastIndexOf("}");
			json = new StringBuilder(json).replace(ind, ind+1,",\"outfile\":\"" + randomFilename).toString() + "\"}";
		}

		String result = converter.requestServer(json);
		ByteArrayOutputStream stream;
		if (randomFilename != null && randomFilename.equals(result)) {
			stream = writeFileToStream(randomFilename);
		} else {
			boolean base64 = !mime.getExtension().equals("svg");
			stream = outputToStream(result, base64);
		}

		HttpHeaders headers = new HttpHeaders();

		headers.add("Content-Type", mime.getType() + "; charset=utf-8");
		headers.add("Content-Disposition",
                   "attachment; filename=" + name + "." + extension);
		headers.setContentLength(stream.size());

		return new HttpEntity<byte[]>(stream.toByteArray(), headers);
	}
	
	/*
	 * INSTANCE METHODS
	 */

	private String convert(String svg, MimeType mime, String width, String scale, String options, String constructor, String callback, String globalOptions, String filename) throws SVGConverterException, PoolException, NoSuchElementException, TimeoutException, ServletException {

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
            globalOptions = sanitize(globalOptions);
		} else {
			// assume SVG conversion
			svg = sanitize(svg);
			if (svg == null) {
				logger.error("The mandatory 'svg' or 'options' POST parameter is undefined.");
				throw new ServletException(
						"The mandatory 'svg' or 'options' POST parameter is undefined.");
			} else {				
				convertSvg = true;
				input = svg;
			}
		}

		if (convertSvg && mime.equals(MimeType.SVG)) {
				output = converter.redirectSVG(input, filename);
		} else {
			output = converter.convert(input, mime, constructor, callback, globalOptions, parsedWidth, parsedScale, filename);
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
		if (parameter == null || parameter.trim().isEmpty() || parameter.compareToIgnoreCase("undefined") == 0 || parameter.compareTo("null") == 0 || parameter.compareTo("{}") == 0) {
			return null;
		}
		return parameter.trim();
	}

	private static Float widthToFloat(String width) throws SVGConverterException {
		width = sanitize(width);
		if (width != null) {
			width = width.replace("px", "");
			try {
				Float parsedWidth = Float.valueOf(width);
				if (parsedWidth.compareTo(MAX_WIDTH) > 0) {
					return MAX_WIDTH;
				}
				if (parsedWidth.compareTo(0.0F) > 0) {
					return parsedWidth;
				}
			} catch (NumberFormatException nfe) {
				logger.error("Parameter width is wrong for value: " + width, nfe.fillInStackTrace());
				throw new SVGConverterException("Parameter width is wrong for value: " + width);
			}
			
		}
		return null;
	}

	private static Float scaleToFloat(String scale) throws SVGConverterException {
		scale = sanitize(scale);
		if (scale != null) {
			try {
				Float parsedScale = Float.valueOf(scale);
				if (parsedScale.compareTo(MAX_SCALE) > 0) {
					return MAX_SCALE;
				} else if (parsedScale.compareTo(0.0F) > 0) {
					return parsedScale;
				}
			} catch (NumberFormatException nfe) {
				logger.error("Parameter scale is wrong for value: " + scale, nfe.fillInStackTrace());
				throw new SVGConverterException("Parameter scale is wrong for value: " + scale);
			}
		}
		return null;
	}

	public String createRandomFileName(String extension) {
		Path path = Paths.get(TempDir.outputDir.toString(), RandomStringUtils.randomAlphanumeric(8) + "." + extension);
		return path.toString();
	}

	private ByteArrayOutputStream outputToStream(String output, boolean base64) throws SVGConverterException {
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		try {
			if (base64) {
				 //decode the base64 string
				stream.write(Base64.decodeBase64(output));
			} else {
				stream.write(output.getBytes());
			}
		} catch (IOException ex) {
			logger.error("Error in outputToStream: " + ex.getMessage());
			throw new SVGConverterException("Error while converting");
		}

		return stream;
	}

	private ByteArrayOutputStream writeFileToStream(String filename) throws SVGConverterException {
		ByteArrayOutputStream stream = new ByteArrayOutputStream();

		try {
			stream.write(FileUtils.readFileToByteArray(new File(filename)));
		} catch (IOException ioex) {
			logger.error("Tried to read file from filesystem: " + ioex.getMessage());
			throw new SVGConverterException("IOException: cannot find your file to download...");
		}

		return stream;
	}

	/* EXCEPTION HANDLERS */

	@ExceptionHandler(ZeroRequestParameterException.class)
	public ModelAndView handleZeroRequestParameterException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("demo");
		response.setStatus(302);
		return modelAndView;
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
		modelAndView.addObject("message",
				"Timeout converting SVG, is your file this big, or maybe you have a syntax error in the javascript callback?");
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(PoolException.class)
	public ModelAndView handleServerPoolException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView.addObject("message",
				"Sorry, the server is handling too many requests at the moment. Please try again.");
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(SVGConverterException.class)
	public ModelAndView handleSVGRasterizeException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView.addObject("message",
				"Something went wrong while converting. " + ex.getMessage());
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(InterruptedException.class)
	public ModelAndView handleInterruptedException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("error");
		modelAndView.addObject("message",
				"It took too long time to process the options, no SVG is created. Make sure your javascript is correct");
		response.setStatus(500);
		return modelAndView;
	}

	@ExceptionHandler(ServletException.class)
	public ModelAndView handleServletException(Exception ex, HttpServletResponse response) {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("message", ex.getMessage());
		response.setStatus(500);
		return modelAndView;
	}
}
