var Youtube = null;

(function() {

	function is_applicable() {
		return window.location.hostname.includes('.youtube.');
	}

	function do_not_hint_element(element) {
		return element.hasClass("ytd-guide-section-renderer") || element.hasClass("ytd-guide-collapsible-entry-renderer");
	}


	Youtube = {
		is_applicable: is_applicable,
		do_not_hint_element: do_not_hint_element,
	};
	websites.add_website(Youtube);
})();
