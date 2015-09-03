/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.highcharts.export.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;

/**
 *
 * @author gert
 */
public class TempDir {

	public static Path tmpDir;
	public static Path outputDir;
	public static Path phantomJsDir;

    protected static Logger logger = Logger.getLogger(TempDir.class.getName());
	
	
	public TempDir() throws IOException {
		tmpDir = Files.createTempDirectory("export");

		// Delete this directory on deletion of the JVM
		tmpDir.toFile().deleteOnExit();

		outputDir = Files.createDirectory(Paths.get(tmpDir.toString(), "output"));
		outputDir.toFile().deleteOnExit();
		
		phantomJsDir = Files.createDirectory(Paths.get(tmpDir.toString(), "phantomjs"));
		phantomJsDir.toFile().deleteOnExit();

		Runtime.getRuntime().addShutdownHook(new Thread() {
			@Override
		    public void run() {
		        FileUtils.deleteQuietly(tmpDir.toFile());
		    }
		});
		
		logger.debug("Highcharts Export Server using " +TempDir.getTmpDir() + " as TEMP folder.");
	}

	public static Path getTmpDir() {
		return tmpDir;
	}

	public static Path getOutputDir() {
		return outputDir;
	}

	public static Path getPhantomJsDir() {
		return phantomJsDir;
	}

	public static String getDownloadLink(String filename) {
		String link = "files/" + filename;
		return link;
	}



}
