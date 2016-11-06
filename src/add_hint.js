///
/// Labeling an element with a hint tag
///


//
// Generic manipulations of DOM elements
//

// add CSS declaration '<item>: <value> !important' to element's
// inline styles;
// has no effect on XML elements, which ignore inline styles
function set_important(element, item, value) {
    try {
	// jquery .css(-,-)  does not handle !important correctly:
	element[0].style.setProperty(item, value, "important");
	//element[0].style.setProperty(item, value);
    } catch (e) {}  // XML elements throw an exception
}


// insert element before/after target or (if put_inside), at the
// beginning of target's contents or at the end of target's contents
function insert_element(target, element, put_before, put_inside) {
    if (put_inside) {
	if (put_before)
	    target.prepend(element);
	else
	    target.append(element);
    } else {
	if (put_before)
	    target.before(element);
	else
	    target.after(element);
    }    
}



//
// Building hint tags
//

function build_base_element() {
    var element = $("<span></span>");
    // mark our inserted elements so we can distinguish them:
    element.attr("CBV_hint_element", "true"); 
    return element;
}

function add_text(element, text) {
    element.attr("CBV_add_text", "true");  // activate style rules
    if (option("c"))
	element.attr("CBV_high_contrast", "true");
    element.append(text);
    return element;
}

function build_hint(element, hint_number, use_overlay) {
    var outer = build_base_element();
    outer.attr("CBV_hint_tag", hint_number);

    if (use_overlay) {
	outer.attr("CBV_outer_overlay", "true");

	var inner = build_base_element();
	outer.append(inner);

	inner.attr("CBV_inner_overlay", "true");
	add_text(inner, hint_number);

	// IMPORTANT: need to have top, left set so offset(-[,-])
	//            works correctly on this element:
	set_important(inner, "top",  "0");
	set_important(inner, "left", "0");

	// beat hinted element's z-index by at least one;
	// if we are not in a different stacking context, this should
	// put us on top of it.
	var zindex = css(element, "z-index", 0);
	if (zindex > 0)
	    set_important(inner, "z-index", zindex+1);

    } else {
	outer.attr("CBV_outer_inline", "true");
	add_text(outer, hint_number);
    }

    return outer;
}



//
// Analysis routines
//

// Can we legally put a span element inside of element and have it be
// visible?  Does not take CSS properties into account.
function can_put_span_inside(element) {
    // unconditionally _empty elements_ that cannot have any child
    // nodes (text or nested elements):
    if (element.is("area, base, br, col, command, embed, hr, img, input, keygen, link, meta, param, source, track, wbr")) 
	return false;

    if (element.is("select, option, textarea")) 
	return false;

    if (element.is("iframe")) 
	// iframe contents are displayed only if browser doesn't support iframe's
	return false;

    // only actual webpage elements are fair game:
    if (CBV_inserted_element(element))
	return false;

    if (element.is("div, span, a, button, li, th, td")) 
	return true;

    // above absolutely correct; below is heuristic:
    try {
	if (element.contents().length > 0)
	    return true;
    } catch (e) {}
    return false;
}


// is it okay to put a span before this element?
function span_before_okay(element) {
    // don't put spans before tr elements (else messes up table
    // formatting as treats span as first column):
    if (element.is("tr")) 
	return false;

    return true;
}



//
// Adding overlay hints
//

function compute_displacement(element) {
    if (option('E')) {
	if (element.is("a") && element.children().length == 0) {
	    return {up: 3, right: 3};
	}
    }
    return {up: 0, right: 0};
}


function add_overlay_hint(element, hint_number) {
    var hint_tag    = build_hint(element, hint_number, true);
    var inner	    = hint_tag.children().first();
    var show_at_end = !option("s");

    // hard coding reddit entire story link: <<<>>>
    if (/\.reddit\.com/.test(window.location.href)) {
	if (element.is(".thing"))
	    show_at_end = false;
    }

    //
    // We prefer to put overlays inside the element so they share the
    // element's fate.  If we cannot legally do that, we prefer before
    // the element because after the element has caused the inserted
    // span to wrap to the next line box, adding space.
    //
    if (can_put_span_inside(element))
	insert_element(element, hint_tag, true, true);
    else 
	insert_element(element, hint_tag, span_before_okay(element), false);
    //$("body").append(hint_tag);


    var displacement = compute_displacement(element);
    // move overlay into place at end after all inline hints have been
    // inserted so their insertion doesn't mess up the overlay's position:
    return () => {
	try { 
	    // this fails for XML files...
	    var target_offset = element.offset();
	    if (show_at_end) {
		target_offset.left += element.outerWidth() 
    		             	    -   inner.outerWidth();
	    }
	    target_offset.top  -= displacement.up;
	    target_offset.left += displacement.right;
	    inner.offset(target_offset);
	} catch (e) {}
    };
}



//
// 
//











function visual_contents(element) {
    if (element.is("iframe"))
	return [];
	
    var indent = css(element, "text-indent");
    if (indent && /^-999/.test(indent))
	return [];

    return element.contents().filter(function () {
	if (this.nodeType === Node.COMMENT_NODE)
	    return false;

	// ignore nodes intended solely for screen readers and the like
	if (this.nodeType === Node.ELEMENT_NODE) {
	    if (css($(this),"display") == "none")
		 return false;
//	    if ($(this).width()==0 && $(this).height()==0)
	    if (css($(this),"position")=="absolute"
		|| css($(this),"position")=="fixed")
		return false;
	}

	return true;
    });
}


function CSS_number(element, property_name) {
    var value = element.css(property_name);
    //console.log(property_name + " -> " + value);
    if (value == "none")
	return 0;
    if (/^[0-9]+px$/.test(value))
	return parseFloat(value);
    if (value == "100%")
	return element.parent().width(); // <<<>>>
    return 0;
}
function get_text_overflow_ellipisis_clip(element) {
    for (;;) {
	if (element.css("text-overflow") != "clip") {
	    var clip = {right: element[0].getBoundingClientRect().right};

	    clip.right  -= CSS_number(element,"border-right-width") - 
		           CSS_number(element,"padding-right");
	    var slop = CSS_number(element,"max-width") - element.width();
	    if (slop>0)
		clip.right += slop;

	    if (slop>0)
		clip.top = -slop;
	    // if (slop>0)
	    // 	console.log(clip);
	    // console.log(element[0]);
	    // console.log(element.css("max-width"));
	    // console.log(slop);

	    return clip;
	}
	if (element.css("display") != "inline")
	    return null;
	element = element.parent();
    }
}


function ellipsis_clipping_possible(element) {
    var clip = get_text_overflow_ellipisis_clip(element);
    if (!clip)
	return false;

    if (element[0].getBoundingClientRect().right + 40 < clip.right)
	return false;

    return true;
}


//
// Adding inline hints
//

// returns false iff unable to safely add hint
function add_inline_hint_inside(element, hint_number) {
    var current = element;
    for (;;) {
	if (!can_put_span_inside(current))
	    return false;

	var inside = visual_contents(current);
	if (inside.length == 0)
	    return false;
	var last_inside = inside.last();

	if (last_inside[0].nodeType == Node.ELEMENT_NODE
	    && last_inside.is("div, span, i, b, strong, em, code, font, abbr")) {
	    current = last_inside;
	    continue;
	}

	if (last_inside[0].nodeType != Node.TEXT_NODE)
	    return false;
	if (css(current, "display") == "flex")
	    return false;

	var put_before = false;
	if (!option(".") && ellipsis_clipping_possible(current)) {
	    if (option("<"))
		put_before = true;
	    else
		return false;
	}

	//var hint_tag = build_hint(element, hint_number, false);
	var hint_tag = build_hint(current, hint_number, false);
	insert_element(current, hint_tag, put_before, true);
	return true;
    }
}


// this is often unsafe; prefer add_inline_hint_inside
function add_inline_hint_outside(element, hint_number) {
    var hint_tag = build_hint(element, hint_number, false);
    insert_element(element, hint_tag, false, false);
}



function add_hint(element, hint_number) {
    if (option("#")) {
	if (element.is("a") || element.is("button")) {
	    var hint_tag = build_hint(current, hint_number, false);
	    insert_element(current, hint_tag, false, true);
	    return null;
	}
	add_inline_hint_outside(element, hint_number);
	return null;
    }


    if (option("o"))
	return add_overlay_hint(element, hint_number);

    if (option("i")) {
	if (!add_inline_hint_inside(element, hint_number))
	    add_inline_hint_outside(element, hint_number);
	return null;
    }

    if (option("h")) {
	if (!add_inline_hint_inside(element, hint_number))
	    return add_overlay_hint(element, hint_number);
	return null;
    }

    // current fallback is inline
    if (!add_inline_hint_inside(element, hint_number))
	add_inline_hint_outside(element, hint_number);
    return null;
}