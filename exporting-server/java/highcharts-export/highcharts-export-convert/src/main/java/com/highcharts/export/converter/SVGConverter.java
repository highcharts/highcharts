/**
 * @license Highcharts JS v2.3.3 (2012-11-02)
 *
 * (c) 20012-2014
 *
 * Author: Gert Vaartjes
 *
 * License: www.highcharts.com/license
 */
package com.highcharts.export.converter;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeoutException;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.highcharts.export.pool.PoolException;
import com.highcharts.export.pool.BlockingQueuePool;
import com.highcharts.export.server.Server;
import com.highcharts.export.util.MimeType;
import com.highcharts.export.util.TempDir;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.apache.commons.io.FilenameUtils;

@Service("svgConverter")
public class SVGConverter {

	@Autowired
	private BlockingQueuePool serverPool;
	protected static Logger logger = Logger.getLogger("converter");
	private static final String SVG_DOCTYPE = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";

	public ByteArrayOutputStream convert(String input, MimeType mime,
			String constructor, String callback, Float width, Float scale, Boolean async) throws SVGConverterException, PoolException, NoSuchElementException, TimeoutException {
		return this.convert(input, null, null, null, mime, constructor, callback, width, scale, async);
	}

	public ByteArrayOutputStream convert(String input, String globalOptions, String dataOptions, String customCode, MimeType mime,
			String constructor, String callback, Float width, Float scale, Boolean async) throws SVGConverterException, PoolException, NoSuchElementException, TimeoutException {

			ByteArrayOutputStream stream = null;
			String outFilename = null;

			Map<String, String> params = new HashMap<String, String>();
			Gson gson = new Gson();

			// get filename
			String extension = mime.name().toLowerCase();
			if (async || MimeType.PDF.equals(mime)) {
				// only PDF cannot be returned as a string by PhantomJS
				outFilename = createUniqueFileName("." + extension);
				params.put("outfile", outFilename);
			} else {
				// set the mime we want to convert to
				params.put("outtype", extension);
			}

			params.put("infile", input);

			if (constructor != null && !constructor.isEmpty()) {
				params.put("constr", constructor);
			}

			if (callback != null && !callback.isEmpty()) {
				params.put("callback", callback);
			}

			if (globalOptions != null && !globalOptions.isEmpty()) {
				params.put("globaloptions", globalOptions);
			}

			if (dataOptions != null && !dataOptions.isEmpty()) {
				params.put("dataoptions", dataOptions);
			}

			if (customCode != null && !customCode.isEmpty()) {
				params.put("customcode", customCode);
			}

			if (width != null) {
				params.put("width", String.valueOf(width));
			}

			if (scale != null) {
				params.put("scale", String.valueOf(scale));
			}

			// parameters to JSON
			String json = gson.toJson(params);

			// send to PhantomServer, get 64bit string image in return
			// or filelocation

			// TODO: send with async parameter -> if async let phantomjs create the local file in /temp and get the fileloc in return.
			String output = requestServer(json);

			// check first for errors
			if (output.substring(0,5).equalsIgnoreCase("error")) {
				logger.debug("recveived error from phantomjs: " + output);
				throw new SVGConverterException("recveived error from phantomjs:" + output);
			}

			stream = new ByteArrayOutputStream();
			try {
				if (output.equalsIgnoreCase(outFilename)) {
					if (async) {
						// asnc outputs a filename
						String filename = FilenameUtils.getName(outFilename);
						String link = "files/" + filename; // + "/safe";
						stream.write(link.getBytes("utf-8"));
					} else {
						// in case of pdf, phantom cannot base64 on pdf files
						stream.write(FileUtils.readFileToByteArray(new File(outFilename)));
					}
				} else {
					// assume phantom is returning SVG or a base64 string for images
					if (extension.equals("svg")) {
						stream.write(output.getBytes());
					} else {
						//decode the base64 string
						stream.write(Base64.decodeBase64(output));
					}
				}
			} catch (IOException ioex) {
				logger.error(ioex.getMessage());
				throw new SVGConverterException("Error while converting, " + ioex.getMessage());
			}

			return stream;
	}

	/*
	 * Redirect the SVG string directly
	 */
	public String redirectSVG(String svg, boolean async) throws SVGConverterException {
		// add XML Doctype for svg
		String input = SVG_DOCTYPE + svg;
		if (async) {
			// Create file and return filename instead.
			String filename = createUniqueFileName(".svg");
			File file = new File(filename);
			try {
				FileUtils.writeStringToFile(file, svg);
			} catch (IOException ioex) {
				logger.error(ioex.getMessage());
				throw new SVGConverterException("Error while converting, " + ioex.getMessage());
			}
			return "files/" + FilenameUtils.getName(filename);// + "/safe";
		}
		return input;
	}

	public String requestServer(String params) throws SVGConverterException, TimeoutException, NoSuchElementException, PoolException {
		Server server = null;

		try {
			server = (Server) serverPool.borrowObject();
			String response = server.request(params);

			return response;
		} catch (SocketTimeoutException ste) {
			throw new TimeoutException(ste.getMessage());
		} catch (TimeoutException te) {
			throw new TimeoutException(te.getMessage());
		} catch (PoolException nse) {
				logger.error("POOL EXHAUSTED!!");
				throw new PoolException(nse.getMessage());
		} catch (Exception e) {
			logger.debug(e.getMessage());
			throw new SVGConverterException("Error converting SVG" + e.getMessage());
		} finally {
			try {
				serverPool.returnObject(server, true);
			} catch (Exception e) {
				logger.error("Exception while returning server to pool: " + e.getMessage());
			}
		}
	}

	public String createUniqueFileName(String extension) {
		Path path = Paths.get(TempDir.outputDir.toString(), RandomStringUtils.randomAlphanumeric(8) + extension);
		return path.toString();
	}

}