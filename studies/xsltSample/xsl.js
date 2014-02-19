function loadXMLDoc(filename)
{
    if (window.ActiveXObject)
    {
        xhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else
    {
        xhttp = new XMLHttpRequest();
    }

    xhttp.open("GET", filename, false);
    try {
        xhttp.responseType = "msxml-document"
    } catch(err) {

    } // Helping IE11
    xhttp.send("");
    return xhttp.responseXML;
};

function loadSVG(mapFile, dataFile, xslFile)
{
    //xml = loadXMLDoc('catalog.xml');
    //xml = loadXMLDoc("Germany.svg");
    xml = loadXMLDoc(mapFile);
    xsl = loadXMLDoc(xslFile);
    var result;

    // code for IE
    if (window.ActiveXObject || xhttp.responseType == "msxml-document")
    {
        xsl.setProperty('AllowDocumentFunction', true);
        result = xml.transformNode(xsl);
        //document.getElementById("example").innerHTML = ex;
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument)
    {
        xsltProcessor = new XSLTProcessor();
        console.log(xsltProcessor);
        xsltProcessor.setParameter('AllowDocumentFunction', true);
        xsltProcessor.importStylesheet(xsl);
        result = xsltProcessor.transformToFragment(xml, document);

        result = result.textContent;
    }

    return JSON.parse(result);
};