var websites = null;

(function() {
	var registered_sites = [];

	function add_website(website)
	{
		registered_sites.push(website);
	}

	function is_applicable()
	{
		return registered_sites.some((website) => website.is_applicable());
	}

	function get_root_elements()
	{
		var root_elements = null;
		registered_sites.forEach((website) => {
			if (website.is_applicable() && 'get_root_elements' in website) {
				if (root_elements) root_elements.add(website.get_root_elements());
				else root_elements = website.get_root_elements();
			}
		});
		return root_elements;
	}

	function place_hints() {
		registered_sites.forEach((website) => {
			if (website.is_applicable() && 'place_hints' in website) website.place_hints();
		});
	}

	function force_overlay(element) {
		return registered_sites.some((website) => website.is_applicable() && 'force_overlay' in website && website.force_overlay(element));
	}

	function do_not_hint_element(element) {
		return registered_sites.some((website) => website.is_applicable() && 'do_not_hint_element' in website && website.do_not_hint_element(element));
	}

	websites = {
		add_website: add_website,
		is_applicable: is_applicable,
		get_root_elements: get_root_elements,
		place_hints: place_hints,
		force_overlay: force_overlay,
		do_not_hint_element: do_not_hint_element,
	};
})();
