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

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;
import java.util.concurrent.TimeoutException;

import org.apache.commons.lang.RandomStringUtils;
import org.apache.log4j.Logger;

public class SVGCreator {

	private final String PHANTOM_EXEC = "/usr/local/bin/phantomjs";
	private String PHANTOM_SCRIPT = "highcharts-convert.js";

	protected static Logger logger = Logger.getLogger("svgCreator");
	private static final SVGCreator INSTANCE = new SVGCreator();

	public static final SVGCreator getInstance() {
		return INSTANCE;
	}

	private SVGCreator() {
	}

	public synchronized String createSVG(String location, String options,
			String constructor, String callback) throws IOException,
			InterruptedException, TimeoutException {

		// create options file
		File infile = createUniqueFile(options, ".json");
		String inFilename = infile.getAbsolutePath();
		String outFilename = inFilename.replaceAll(".json", ".svg");

		String commandLine = buildCommand(location, inFilename, outFilename,
				callback, constructor);
		logger.debug(commandLine);
		int success = executeCommandLine(commandLine, 5000);
		logger.debug("succes " + success);
		if (success == 0) {
			String svg = this.readFile(outFilename);
			return svg;
		}
		return "no-svg";
	}

	private String buildCommand(String location, String inFilename,
			String outFilename, String callback, String constr)
			throws IOException {

		StringBuilder sb = new StringBuilder(PHANTOM_EXEC);
		sb.append(" " + location + "/phantomjs/" + PHANTOM_SCRIPT);
		sb.append(" -infile " + inFilename);
		sb.append(" -outfile " + outFilename);

		if (callback != null) {
			File callbackFile = createUniqueFile(callback, "cb.js");
			sb.append(" -callback " + callbackFile.getAbsolutePath());
		}

		if (constr != null && !constr.isEmpty()) {
			sb.append(" -constr  " + constr);
		}

		return sb.toString();
	}

	public File createUniqueFile(String content, String extension)
			throws IOException {
		File file = File.createTempFile(
				RandomStringUtils.randomAlphanumeric(8), extension);
		writeFile(file, content);
		return file;
	}

	private void writeFile(File file, String content) throws IOException {
		FileWriter fw = new FileWriter(file);
		BufferedWriter bw = new BufferedWriter(fw);
		try {
			bw.write(content);
		} finally {
			bw.close();
			fw.close();
		}

	}

	private String readFile(String path) throws IOException {
		FileInputStream stream = new FileInputStream(new File(path));
		try {
			FileChannel fc = stream.getChannel();
			MappedByteBuffer bb = fc.map(FileChannel.MapMode.READ_ONLY, 0,
					fc.size());
			/* Instead of using default, pass in a decoder. */
			return Charset.forName("utf-8").decode(bb).toString();
		} finally {
			stream.close();
		}
	}

	public static int executeCommandLine(final String commandLine,
			final long timeout) throws IOException, InterruptedException,
			TimeoutException {
		Runtime runtime = Runtime.getRuntime();
		Process process = runtime.exec(commandLine);

		Worker worker = new Worker(process);
		worker.start();
		try {
			worker.join(timeout);
			if (worker.exit != null)
				return worker.exit;
			else
				throw new TimeoutException();
		} catch (InterruptedException ex) {
			worker.interrupt();
			Thread.currentThread().interrupt();
			throw ex;
		} finally {
			process.destroy();
		}

	}

	private static class Worker extends Thread {
		private final Process process;
		private Integer exit;

		private Worker(Process process) {
			this.process = process;
		}

		public void run() {
			try {
				exit = process.waitFor();
				logger.debug("exit value thread = " + exit);
			} catch (InterruptedException ignore) {
				return;
			}
		}
	}

}
