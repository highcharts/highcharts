package com.highcharts.export.util;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum EncodingType 
{
	FORM_URL_ENC("application/x-www-form-urlencoded"),
	MULTIPART("multipart/form-data");
     
     private static final Map<String,EncodingType> lookup 
          = new HashMap<String,EncodingType>();
     
     static {
          for(EncodingType m : EnumSet.allOf(EncodingType.class))
               lookup.put(m.getType(), m);
     }     
     
     private String type;
        		  
     private EncodingType(String type) {
          this.type = type;
     }

     public String getType() { return type; }

     public static EncodingType get(String type) { 
          return lookup.get(type); 
     }
}