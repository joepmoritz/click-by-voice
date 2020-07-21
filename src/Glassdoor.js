var Glassdoor = null;

(function() {

	function is_applicable() {
		return window.location.hostname.includes('.glassdoor.');
	}

	function force_overlay(element) {
		return element.is("button.mfp-close");
	}


	Glassdoor = {
		is_applicable: is_applicable,
		force_overlay: force_overlay,
	};
	websites.add_website(Glassdoor);
})();
