var GoogleInbox = null;

(function() {

	function is_applicable() {
		return window.location.hostname == "inbox.google.com";
	}

	function get_root_elements() {
		// main message text block: div.b5
		// attachments on collapsed message header: div.nJ.u2
		return $('div\.b5, div\.nJ');
	}

	GoogleInbox = {
		is_applicable: is_applicable,
		get_root_elements: get_root_elements,
	};
})();