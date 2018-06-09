///
/// Overall control code for labeling elements with hint tags
///
/// Provides Hints

var Hints = null;

(function() {

    var hints_enabled = true;
    var hint_first_letters = ['L', 'B', 'M', 'R', 'T', 'S', 'G', 'Y', 'F', 'J', 'SL', 'FL', 'BL', 'GL', 'BR', 'ST', 'TR', 'KR'];
    var MAX_HINT_NUMBERS = 18 * 26;
    var hint_number_to_text_map = 0;
    var text_to_hint_number_map = 0;

    var available_hint_numbers = new Set();
    var options_       = new Map();

    function reset_available_hint_numbers() {
	    for (var i = 0; i < MAX_HINT_NUMBERS; ++i)
	    {
			available_hint_numbers.add(i);
	    }
    }

    function pop_available_hint_number() {
		for (var i = 0; i < MAX_HINT_NUMBERS; ++i)
		{
			if (available_hint_numbers.has(i))
			{
				available_hint_numbers.delete(i);
				return i;
			}
		}
    }

    reset_available_hint_numbers();



    //
    // Main exported actions:
    //

    function add_hints(parameters) {
	set_hinting_parameters(parameters);
	place_hints();
    }

    function refresh_hints() {
       if (document.hidden) {
            console.log("skipping refresh...");
            return;
       }

       if (hints_enabled) place_hints();
    }

    function remove_hints() {
	$("[CBV_hint_element]").remove();
	$("[CBV_hint_number]").removeAttr("CBV_hint_number");

       hints_enabled = false;
       reset_available_hint_numbers();
    }

    function remove_hint(element) {
		hint_number = parseInt(element.getAttribute("CBV_hint_number"));
		available_hint_numbers.add(hint_number);
		element.removeAttribute("CBV_hint_number");
    }

    function build_hint_number_maps() {
		hint_number_to_text_map = {}
		text_to_hint_number_map = {}

		for (var hint_number = 0; hint_number < MAX_HINT_NUMBERS; hint_number++)
		{
			number1 = Math.floor(hint_number / 26)
			number2 = hint_number % 26
			char_code_start = "A".charCodeAt(0)
			text = hint_first_letters[number1].toUpperCase() + String.fromCharCode(char_code_start + number2)

			hint_number_to_text_map[hint_number] = text
			text_to_hint_number_map[text] = hint_number
		}
    }
    
    function map_hint_number_to_text(hint_number) {
		if (Hints.option("A"))
		{
			if (!hint_number_to_text_map) build_hint_number_maps()
			return hint_number_to_text_map[hint_number]
		}
		else
			return hint_number
    }

    function map_text_to_hint_number(text) {
		if (Hints.option("A"))
		{
			if (!text_to_hint_number_map) build_hint_number_maps()
			return text_to_hint_number_map[text.toUpperCase()]
		}
		else
			return text
    }


    //
    // Parameters for hinting:
    //

    function reset_option(option_name) {
	options_.delete(option_name);
    }
    function set_option(option_name, arguments) {
	// The main mode switches are exclusive:
	if (/^[ioh]$/.test(option_name)) {
	    reset_option("i");
	    reset_option("o");
	    reset_option("h");
	}
	// syntax for long option names & reseting options:
	if (option_name == 'X') {
	    if (arguments.length > 0) {
		option_name = arguments[0];
		arguments = arguments.slice(1);
		if (/-$/.test(option_name)) {
		    // X{<option_name>-}
		    reset_option(option_name.substring(0, option_name.length-1));
		} else {
		    // X{<option_name>}<optional arguments>
		    set_option(option_name, arguments);
		}
	    }
	    return;
	}
	options_.set(option_name, arguments);
    }

    function option(option_name) {
	return options_.has(option_name);
    }
    function option_value(option_name, default_value) {
	if (options_.has(option_name) && options_.get(option_name).length>0) {
	    return options_.get(option_name)[0];
	} else {
	    return default_value;
	}
    }

    function options_to_string() {
	var result = "";
	var flags = "";
	options_.forEach(function(value, key) {
	    if (value.length==0 && key.length==1) {
		flags += key;
	    } else {
		result += ' ' + key + value.map(function (v) { return '{' + v + '}';}).join('');
	    }
	});
	return flags + result;
    }

    function parse_option(text) {
	if (m = text.match(/^([^{])\{([^{}]*)\}\{([^{}]*)\}(.*)/)) {
	    return [m[1], [m[2],m[3]], m[4]];
	}
	if (m = text.match(/^([^{])\{([^{}]*)\}(.*)/)) {
	    return [m[1], [m[2]], m[3]];
	}
	return [text[0], [], text.substring(1)];
    }
    function set_hinting_parameters(value) {
	options_ = new Map();
	var default_hints = "h";
	var text = default_hints + value;
	while (text != "") {
	    // console.log(text);
	    r = parse_option(text);
	    name = r[0];
	    arguments = r[1];
	    text = r[2];
	    // console.log([name, arguments, text]);
	    set_option(name, arguments);
	}
    }

    function with_high_contrast(callback) {
	var saved = options_;
	options_= new Map(options_);
	set_option('c', []);
	callback();
	options_ = saved;
    }


    //
    // 
    //

    function place_hints() {
		console.log("adding hints: " + options_to_string());

		hints_enabled = true;
		var start = performance.now();
		// FindHint.each_hintable(function(element) {});
		// console.log("  just FindHint.each_hintable time:   " + (performance.now()-start) + " ms");
		// start = performance.now();

		if (GoogleInbox.is_applicable()) root_elements = GoogleInbox.get_root_elements();
		else root_elements = $("html").children().filter(":not(head)");
		

		var delayed_work = [];
		FindHint.each_hintable(root_elements, function(element) {
		    if (element.is("[CBV_hint_number]")) return;
		    if (available_hint_numbers.size == 0) return;
		    if (!element.visible(true)) return;
		    hint_number = pop_available_hint_number();
		    element.attr("CBV_hint_number", hint_number);

		    var delayed = AddHint.add_hint(element, hint_number);
		    if (delayed)
			delayed_work.push(delayed);

			available_hint_numbers.delete(hint_number)
		});

		delayed_work.map(function (o) { o(); });


		// console.log("total hints assigned: " + next_CBV_hint_ 
		// 		+ "    (" + delayed_work.length + " overlays added)");
		// console.log("  " + (performance.now()-start) + " ms");
    }



    Hints = {
	add_hints	   : add_hints,
	refresh_hints	   : refresh_hints,
	remove_hints	   : remove_hints,
	remove_hint	   : remove_hint,

	option		   : option,
	option_value 	   : option_value,
	with_high_contrast : with_high_contrast,
	map_hint_number_to_text : map_hint_number_to_text,
	map_text_to_hint_number : map_text_to_hint_number,
    };
})();
