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

@Service("svgConverter")
public class SVGConverter {

	@Autowired
	private BlockingQueuePool serverPool;
	protected static Logger logger = Logger.getLogger("converter");

	public ByteArrayOutputStream convert(String input, MimeType mime,
			String constructor, String callback, Float width, Float scale) throws SVGConverterException, IOException, PoolException, NoSuchElementException, TimeoutException {
		return this.convert(input, null, null, null, mime, constructor, callback, width, scale);
	}

	public ByteArrayOutputStream convert(String input, String globalOptions, String dataOptions, String customCode, MimeType mime,
			String constructor, String callback, Float width, Float scale) throws SVGConverterException, IOException, PoolException, NoSuchElementException, TimeoutException {

			ByteArrayOutputStream stream = null;

			// get filename
			String extension = mime.name().toLowerCase();
			String outFilename = createUniqueFileName("." + extension);

			Map<String, String> params = new HashMap<String, String>();
			Gson gson = new Gson();

			params.put("infile", input);
			params.put("outfile", outFilename);

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

			String json = gson.toJson(params);
			String output = requestServer(json);

			// check for errors
			if (output.substring(0,5).equalsIgnoreCase("error")) {
				logger.debug("recveived error from phantomjs: " + output);
				throw new SVGConverterException("recveived error from phantomjs:" + output);
			}

			stream = new ByteArrayOutputStream();
			if (output.equalsIgnoreCase(outFilename)) {
				// in case of pdf, phantom cannot base64 on pdf files
				stream.write(FileUtils.readFileToByteArray(new File(outFilename)));
			} else {
				// assume phantom is returning SVG or a base64 string for images
				if (extension.equals("svg")) {
					stream.write(output.getBytes());
				} else {
					stream.write(Base64.decodeBase64(output));
				}
			}
			return stream;
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
		}catch (Exception e) {
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

	public String createUniqueFileName(String extension) throws IOException {
		return System.getProperty("java.io.tmpdir") + "/" + RandomStringUtils.randomAlphanumeric(8) + extension;
	}
}