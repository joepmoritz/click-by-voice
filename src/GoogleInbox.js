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

	function place_hints() {
		// normal message header: b9
		// group header: an.aT
		// reminder header: an.cF
		$('div\.an\.b9, div\.an\.aT, div\.an\.cF').each((index, element) => {
			Hints.add_hint($(element), (e, nr) => AddHint.add_overlay_hint(e, nr, false));
		});
	}

	GoogleInbox = {
		is_applicable: is_applicable,
		get_root_elements: get_root_elements,
		place_hints: place_hints,
	};
})();