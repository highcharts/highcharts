<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:svg="http://www.w3.org/2000/svg"
	xmlns:hc="http://www.highcharts.com/svg/namespace"
	>
<xsl:output method="text"/>

<xsl:template match="/">
	[
		<xsl:for-each select="svg:svg/svg:path[not(@id='__border_lines__')]">
  		<xsl:variable name="id" select="@id"/>
			{
				"code": "<xsl:value-of select="$id"/>",
				"name": "<xsl:value-of select="hc:desc/hc:name"/>",
				"path": "<xsl:value-of select="@d"/>",
				"color": "<xsl:choose>
						<xsl:when test="hc:desc/hc:country = 'Belgium'">
							<xsl:choose>
								<xsl:when test="hc:desc/hc:region = 'Flemish'">#FFFF00</xsl:when>
								<xsl:when test="hc:desc/hc:region = 'Walloon'">#FF0000</xsl:when>
								<xsl:when test="hc:desc/hc:region = 'Capital Region'">#0000FF</xsl:when>
								<xsl:otherwise>#000000</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:when test="hc:desc/hc:country = 'Netherlands'">#FF6600</xsl:when>
						<xsl:when test="hc:desc/hc:country = 'Luxembourg'">#00CDCD</xsl:when>
						<xsl:otherwise>#F0F0F0</xsl:otherwise>
					</xsl:choose>",

				"value": 1
			}
			<xsl:if test="position() != last()">,</xsl:if>
		</xsl:for-each>
	]
</xsl:template>

</xsl:stylesheet>