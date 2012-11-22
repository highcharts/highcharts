package com.highcharts.export.util;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum MimeType 
{
     PNG("image/png"),
     JPEG("image/jpeg"),
     PDF("application/pdf"),
     SVG("image/svg+xml");
     
     private static final Map<String,MimeType> lookup 
          = new HashMap<String,MimeType>();
     
     static {
          for(MimeType m : EnumSet.allOf(MimeType.class))
               lookup.put(m.getType(), m);
     }     
     
     private String type;
        		  
     private MimeType(String type) {
          this.type = type;
     }

     public String getType() { return type; }

     public static MimeType get(String type) {
    	  
          return lookup.get(type); 
     }
}