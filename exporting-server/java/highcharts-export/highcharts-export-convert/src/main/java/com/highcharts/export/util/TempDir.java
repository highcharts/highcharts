/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.highcharts.export.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.apache.commons.io.FilenameUtils;

/**
 *
 * @author gert
 */
public class TempDir {

	public static Path tmpDir;
	public static Path outputDir;

	public TempDir() throws IOException {
		tmpDir = Files.createTempDirectory("export");

		// Delete this directory on deletion of the JVM
		tmpDir.toFile().deleteOnExit();

		outputDir = Files.createDirectory(Paths.get(tmpDir.toString(), "output"));
		System.out.println("Running with " +TempDir.getTmpDir() + " = TEMP");
	}

	public static Path getTmpDir() {
		return tmpDir;
	}

	public static Path getOutputDir() {
		return outputDir;
	}

	public static String getDownloadLink(String filename) {
		filename = FilenameUtils.getName(filename);
		String link = "files/" + filename;
		return link;
	}



}
