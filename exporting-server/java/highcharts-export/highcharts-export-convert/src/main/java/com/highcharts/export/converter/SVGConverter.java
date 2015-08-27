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

import java.io.File;
import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeoutException;

import com.highcharts.export.util.TempDir;
import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.highcharts.export.pool.PoolException;
import com.highcharts.export.pool.BlockingQueuePool;
import com.highcharts.export.server.Server;
import com.highcharts.export.util.MimeType;

@Service("svgConverter")
public class SVGConverter {

	@Autowired
	private BlockingQueuePool serverPool;
	protected static Logger logger = Logger.getLogger("converter");
	private static final String SVG_DOCTYPE = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">";

	public String convert(String input, MimeType mime,
			String constructor, String callback, String globalOptions, Float width, Float scale, String filename) throws SVGConverterException, PoolException, NoSuchElementException, TimeoutException {
		return this.convert(input, globalOptions, null, null, mime, constructor, callback, width, scale, filename);
	}

	public String convert(String input, String globalOptions, String dataOptions, String customCode, MimeType mime,
			String constructor, String callback, Float width, Float scale, String filename) throws SVGConverterException, PoolException, NoSuchElementException, TimeoutException {

			Map<String, String> params = new HashMap<String, String>();
			Gson gson = new Gson();

			if (filename != null) {
				params.put("outfile", filename);
			} else {
				params.put("type", mime.name().toLowerCase());
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

			// send to phantomJs
			String output = "";
			output = requestServer(json);

			// check first for errors
			if (output.length() > 5 && output.substring(0,5).equalsIgnoreCase("error")) {
				throw new SVGConverterException("recveived error from phantomjs:" + output);
			}

			return output;
	}

	/*
	 * Redirect the SVG string directly
	 */
	public String redirectSVG(String svg, String filename) throws SVGConverterException {
		// add XML Doctype for svg
		String output = SVG_DOCTYPE + svg;

		// for async/android use we need to load the file
		if (filename != null) {
			// Create file and return filename instead.
			File file = new File(TempDir.getOutputDir() + "/" + filename);
			try {
				FileUtils.writeStringToFile(file, output);
			} catch (IOException ioex) {
				logger.error(ioex.getMessage());
				throw new SVGConverterException("Error while converting, " + ioex.getMessage());
			}
			return filename;
		}
		return output;
	}

	public String requestServer(String params) throws SVGConverterException, TimeoutException, NoSuchElementException, PoolException {
		Server server = null;

		try {
			server = (Server) serverPool.borrowObject();
			String response = server.request(params);

			return response;
		} catch (SocketTimeoutException ste) {
			logger.error(ste);
			throw new TimeoutException(ste.getMessage());
		} catch (TimeoutException te) {
			logger.error(te);
			throw new TimeoutException(te.getMessage());
		} catch (PoolException nse) {
				logger.error("POOL EXHAUSTED!!");
				throw new PoolException(nse.getMessage());
		} catch (Exception e) {
			logger.error(e);
			throw new SVGConverterException("Error converting SVG: " + e.getMessage());
		} finally {
			try {
				serverPool.returnObject(server, true);
			} catch (Exception e) {
				logger.error("Exception while returning server to pool: " + e.getMessage());
			}
		}
	}
}