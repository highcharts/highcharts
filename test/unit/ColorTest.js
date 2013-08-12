ColorTest = TestCase("ColorTest");

ColorTest.prototype.testConstruction = function () {
    assertEquals("Color function should be defined.", "function", typeof Color);
    
    // Get all public members
    var members = [];
    for (var member in Color("rgba(0,0,0,1)")) {
        members.push(member);
    }

    // These 3 methods should be public
    assertEquals("4 methods.", 4, members.length);
    assertEquals("get should be public.", "get", members[0]);
    assertEquals("brighten should be public.", "brighten", members[1]);
    assertEquals("rgba should be public.", "rgba", members[2]);
    assertEquals("setOpacity should be public.", "setOpacity", members[3]);
 }

ColorTest.prototype.testGet = function () {
    var colorRgba = Color("rgba(100,100,100,1)");
    var colorHex = Color("#ff00ff");

    assertEquals("hex to rgb.", "rgb(255,0,255)", colorHex.get("rgb"));
    assertEquals("hex to rgba.", "rgba(255,0,255,1)", colorHex.get("rgba"));
    assertEquals("rgba to rgba.", "rgba(100,100,100,1)", colorRgba.get("rgba"));
    assertEquals("rgba to rgb.", "rgb(100,100,100)", colorRgba.get("rgb"));

    assertEquals("alpha component.", 1, colorRgba.get("a"));
    colorRgba = Color("rgba(100,100,100,0.5)");
    assertEquals("alpha component.", 0.5, colorRgba.get("a"));        
    assertEquals("hex colors have alpha of 1.", 1, colorHex.get("a"));
}

ColorTest.prototype.testBrighten = function () {
    var color = Color("rgba(100,100,100,1)");

    assertEquals("Test no brightening", "rgba(100,100,100,1)", color.brighten(0).get("rgba"));
    assertEquals("Test full brightening", "rgba(255,255,255,1)", color.brighten(1).get("rgba"));

    color = Color("rgba(100,100,100,1)");
    //var componentValue = Math.round(100 + (255 * 0.5));
    var componentValue = Math.floor(100 + (255 * 0.5));
    assertEquals("Test 0.5 brightening", "rgba(" + componentValue + "," + componentValue + "," + componentValue + ",1)", color.brighten(0.5).get("rgba"));
}

ColorTest.prototype.testSetOpacity = function () {
	var color = Color("rgba(100,100,100,1)");

	assertEquals("Alpha untouched.", 1, color.get("a"));
	
	color.setOpacity(0);
	assertEquals("Modified alpha.", 0, color.get("a"));
}
