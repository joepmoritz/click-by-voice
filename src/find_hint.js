///
/// Code for figuring out which elements of the webpage should be hinted
///
/// Provides FindHint

var FindHint = null;

(function() {


    // does element occupy enough space to be easily clickable?
    function clickable_space(element) {
	try {
	    // Jquery gives errors for these if they are auto due to
	    // no CSS (e.g., XML files):
	    if (element.outerHeight(true)<8 
		|| element.outerWidth(true)<8)
		return false;
	} catch (e) {}
	return true;
    }


    function hintable(element) {
	// for timing how much hintable costs:
	if (Hints.option("N"))
	    return false;

    if (websites.do_not_hint_element(element)) return false;

    if (window.location.hostname.includes('github.com')) {
    	if (element.hasClass('js-line-number') || element.hasClass('blob-num')) {
    		return false;
    	}
    }

    if (element.hasClass('MathJax')) return false;

    // Elements that have the word button or checkbox in their class are hintable
    // This makes waaay too many elements hintable
    // var class_name = element.attr('class');
    // if (class_name) {
	   //  if (class_name.includes('button') ||
	   //  	class_name.includes('checkbox'))
	   //  	return true;
    // }

	// don't hint invisible elements (their children may be another matter)
	if ((css(element, "visibility") == "hidden" ||
		element.height() < 3 ||
		element.width() < 3 ||
		element.css("opacity") == 0) && !Hints.option("+")) 
	    return false;


	//
	// Experiments:
	//
	if (Hints.option('$'))
	    return element.is(Hints.option_value('$'));
	if (Hints.option('|') && element.is(Hints.option_value('|')))
	    return true;
	if (Hints.option('^') && element.is(Hints.option_value('^')))
	    return false;


	//
	// Standard clickable or focusable HTML elements
	//
	//   Quora has placeholder links with click handlers so allow a's
	//   w/o hrefs...
	//   JM: that should be handled by .is("[onclick]") below
	//
	if (element.is("button, select, textarea, keygen, iframe"))
	    return true;

	if (element.is("a[href]") && element.attr("href").length > 1)
		return true;


	if (element.is("input")) {
	    var input_type = element.attr("type");
	    if (input_type)
		input_type = input_type.toLowerCase();
	    if (input_type != "hidden" 
		// not sure false is actually kosher; spec says otherwise <<<>>>
		&& (element.attr("disabled")=="false" || element.attr("disabled")===undefined))
		return true;
	}


	//
	// HTML elements directly made clickable or focusable
	//
	if (element.is("[onclick]")) 
	    return true;
	if (element.is("[tabindex]") && element.attr("tabindex") >= 0)
	    return true;


	//
	// HTML elements that might be clickable due to event listeners or
	// focusable via tabindex=-1
	//
	if (!Hints.option("A")) {
	    var role = element.attr("role");
	    switch (role) {
	    case "button":
	    case "checkbox":
	    case "link":
	    case "menuitem":
	    case "menuitemcheckbox":
	    case "menuitemradio":
	    case "option":
	    case "radio":
	    case "slider":
	    case "tab":
	    case "textbox":
	    case "treeitem":
		return true;
	    }
	}


	// code for finding clickable elements due to cursor: pointer in
	// post-order traversal of each_hintable


	// hard coding XML file buttons: <<<>>>
	if (/\.xml/.test(window.location.href)) {
	    if (element.is("span.button.collapse-button, span.button.expand-button"))
		return true;
	}


	if (!Hints.option("+"))
	    return false;

	//
	// Anything we think likely to be clickable or focusable
	//

	// this is *everything* focusable:
	if (element.is("[tabindex]")) 
	    return true;

	if (element.is("li")) 
	    return true;

	// innermost div/span/img's are tempting click targets
	if (element.is("div, span, img")) {
	    if (clickable_space(element) && element.children().length == 0)
		return true;
	}


	return false;
    }


    // Enumerate each element that we should hint:
    function each_hintable(root_elements, callback) {
	DomWalk.each_displaying(
		root_elements,
	    // pre-order traversal:
	    function (element) {
	    	if (websites.do_not_hint_element(element)) return true;

	    	// Return true to stop walking down children if this is a small element
			return hintable(element) && callback(element) && element.height() < 50 && element.width() < 50;

		// post-order traversal:
	    }, function (element) {
	    if (websites.do_not_hint_element(element)) return;
	    
	    if (window.location.href.includes('github.com')) {
	    	if (element.hasClass('js-line-number') || element.hasClass('blob-num')) {
	    		return;
	    	}
	    }

		if (Hints.option('$') && !Hints.option("C"))
		    return;
		if (element.attr("CBV_hint_number"))
		    return;

		if (css(element, "cursor") != "pointer")
		    return;  // XML webpages return here
		if (element.css("visibility") == "hidden") 
		    return;  // visibility blocks cursor: pointer
		if (element.parents().css("cursor")=="pointer")
		    return;

		if (!clickable_space(element))
		    return;

		if (element.parents().attr("CBV_hint_number"))
		    return;

		if (element.has("[CBV_hint_number]").length != 0)
		    return;

		if (Hints.option('^') && element.is(Hints.option_value('^')))
		    return false;

		if (Hints.option("C"))
		    Hints.with_high_contrast(
			function () { callback(element); });
		else
		    callback(element);
	    },
	    '.search-map,#gmap' + Hints.option_value('!') // exclusion
	);
    }


    FindHint = {each_hintable: each_hintable};
})();
