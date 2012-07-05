package com.highcharts.export.controller;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.batik.dom.svg.SAXSVGDocumentFactory;
import org.apache.batik.transcoder.SVGAbstractTranscoder;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.JPEGTranscoder;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.batik.util.XMLResourceDescriptor;
import org.apache.fop.svg.PDFTranscoder;
import org.apache.log4j.Logger;
import org.w3c.dom.Document;

import com.highcharts.export.util.EncodingType;
import com.highcharts.export.util.MimeType;

/**
 * Servlet implementation class BatikExport
 */
@WebServlet(name = "Highcharts-Chart-Export", urlPatterns = { "/*" })
@MultipartConfig
public class BatikExport extends HttpServlet {
	private static final long serialVersionUID = 1L;
	protected static Logger logger = Logger.getLogger("controller");
	private Document emptyDocument;
	private String[] params = { "svg", "filename", "type", "width" };

	// private final String FORM_URL_ENC = "application/x-www-form-urlencoded";
	// private final String MULTIPART = "multipart/form-data";

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public BatikExport() {
		super();
		// TODO Auto-generated constructor stub
	}

	private Document getEmptyDocument() {
		if (this.emptyDocument == null) {
			this.emptyDocument = createEmptyDocument();
		}
		return this.emptyDocument;
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		processrequest(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		processrequest(request, response);
	}

	private Document createEmptyDocument() {
		DocumentBuilderFactory builderFactory = DocumentBuilderFactory
				.newInstance();
		DocumentBuilder builder = null;
		try {
			builder = builderFactory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		return builder.newDocument();
	}

	private Document buildSVGFromString(String svg) {
		StringReader reader = new StringReader(svg);
		Document doc = this.getEmptyDocument();
		String uri = "highcharts-svg";
		try {
			String parser = XMLResourceDescriptor.getXMLParserClassName();
			SAXSVGDocumentFactory f = new SAXSVGDocumentFactory(parser);
			doc = f.createSVGDocument(uri, reader);
		} catch (Exception ex) {
			logger.error("Error in creating Document from svg String", ex);
			doc = null;
		} finally {
			reader.close();
		}

		return doc;
	}

	private SVGAbstractTranscoder getTranscoder(MimeType mime) {

		SVGAbstractTranscoder transcoder = null;

		switch (mime) {
		case PNG:
			transcoder = new PNGTranscoder();
			break;
		case JPEG:
			transcoder = new JPEGTranscoder();
			transcoder.addTranscodingHint(JPEGTranscoder.KEY_QUALITY,
					new Float(0.99));
			break;
		case PDF:
			transcoder = new PDFTranscoder();
		default:
			break;
		}
		return transcoder;
	}

	private static String getValue(Part part) throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				part.getInputStream(), "UTF-8"));
		StringBuilder value = new StringBuilder();
		char[] buffer = new char[1024];
		for (int length = 0; (length = reader.read(buffer)) > 0;) {
			value.append(buffer, 0, length);
		}

		return value.toString();
	}

	private HashMap<String, String> getParams(HttpServletRequest request,
			EncodingType encType) throws IOException {
		// repsond to ie6 "application/x-www-form-urlencoded"
		HashMap<String, String> map = new HashMap<String, String>();
		
		if (encType != null) {
			switch (encType) {
			case FORM_URL_ENC:
				for (int i = 0; i < params.length; i++) {
					String param = request.getParameter(params[i]);
					if (param != null && !param.isEmpty()) {
						map.put(params[i], param);
					}
				}
				break;
			case MULTIPART:
				for (int i = 0; i < params.length; i++) {
					String param = params[i];
					try {
						if (request.getPart(param) != null && !param.isEmpty()) {
							map.put(param, getValue(request.getPart(param)));
						}
					} catch (IOException e) {
						logger.error(e.getMessage());
						e.printStackTrace();
					} catch (ServletException e) {
						logger.error(e.getMessage());
						e.printStackTrace();
					}
				}
			default:
				// do nothing
			}
		}

		return map;
	}

	private void processrequest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		String contentTypeParam = request.getContentType(); 
		
		if(contentTypeParam != null && contentTypeParam.indexOf(";") > -1) {
			contentTypeParam = contentTypeParam.split(";")[0];
		}	
		
		EncodingType encType = EncodingType.get(contentTypeParam);
		if (encType == null) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"You have specified wrong enctype");
			return;
		}

		// get parameters and store in map
		HashMap<String, String> map = getParams(request, encType);

		if (map.size() == 0) {
			// TODO: send to default error page
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"There are no POST parameters specified");
			return; 
		}

		// check if sufficient parameters are supplied
		if (!map.containsKey("svg")) {
			// TODO: send to a default error page.
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"SVG element is not posted to the server");
			return;
		}
		// TODO: what happens when it's not replaced by a svg document?
		Document doc = this.buildSVGFromString(map.get("svg"));

		if (doc == null) {
			// TODO: send to a default error page
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Could not create DOM document from SVG request parameter");
			return;
		}

		ByteArrayOutputStream output = new ByteArrayOutputStream();
		MimeType mime = MimeType.get(map.get("type"));

		try {
			if (!MimeType.SVG.equals(mime)) {
				// Create the transcoder input
				TranscoderInput input = new TranscoderInput(doc);

				// Create the transcoder output
				TranscoderOutput transOutput = new TranscoderOutput(output);

				// get right Transcoder, depends on mime
				SVGAbstractTranscoder transcoder = getTranscoder(mime);
				if (map.containsKey("width")) {
					/*
					 * If the raster image height is not provided (using the
					 * KEY_HEIGHT), the transcoder will compute the raster image
					 * height by keeping the aspect ratio of the SVG document.
					 */
					transcoder.addTranscodingHint(
							SVGAbstractTranscoder.KEY_WIDTH,
							new Float(map.get("width")));
				}
				transcoder.transcode(input, transOutput);

			} else {
				// svg
				TransformerFactory tFactory = TransformerFactory.newInstance();
				Transformer transformer = tFactory.newTransformer();
				DOMSource source = new DOMSource(doc);
				StreamResult result = new StreamResult(output);
				transformer.transform(source, result);
			}

		} catch (Exception e) {
			logger.error("error with creating or transformation of file", e);
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"error while creating or transforming file");
			return;
		}

		String filename = map.containsKey("filename") ? map.get("filename")
				: "chart";
		// prepare response
		response.reset();
		response.setContentLength(output.size());
		response.setHeader("Content-disposition", "attachment; filename="
				+ filename + "." + mime.name().toLowerCase());
		response.setHeader("Content-type", map.get("type"));

		ServletOutputStream out = response.getOutputStream();
		// Send content to Browser
		out.write(output.toByteArray());
		out.flush();
		out.close();
	}

}
