var GoogleInbox = null;

(function() {

	function is_applicable() {
		return window.location.hostname == "inbox.google.com";
	}

	function get_root_elements() {
		// main message text block: div.b5
		return $('div.b5');
	}

	function place_hints() {
		// normal thread header: an.b9
		// group header: an.aT
		// reminder header: an.cF
		// attachments on collapsed thread header: div.nJ
		// attachment below message body: div.u2.k9
		// message header within a thread: j3.s2
		// collapsed message headers (with number) within a thread: n0
		overlay_before_hints = [
			'an.b9', // normal thread header
			'an.aT', // group header
			'an.cF', // reminder header
			'nJ.u2', // attachments on collapsed thread header
			'nJ.s0', // Google maps attachment on the collapsed thread header
			'u2.k9', // attachment below message body
			'j3.s2', // message header within a thread
			'n0', // collapsed message headers (with number) within thread
		];
		$('div.' + overlay_before_hints.join(',div.')).each((index, element) => {
			Hints.add_hint($(element), (e, nr) => AddHint.add_overlay_hint(e, nr, false));
		});
	}

	GoogleInbox = {
		is_applicable: is_applicable,
		get_root_elements: get_root_elements,
		place_hints: place_hints,
	};
})();