var GoogleInbox = null;

(function() {

	function is_applicable() {
		return window.location.hostname == "mail.google.com";
	}

	function get_root_elements() {
		// main message text block
		return $('div.a3s, div.aHl');
	}

	function place_hints() {
		overlay_before_hints = [
			'div.aSH',
			// 'td.oZ-x3.xY.aid',
			// 'div.oZ-jc.T-Jo.J-J5-Ji',
			'tr.zA',
		];
		$(overlay_before_hints.join(',')).each((index, element) => {
			Hints.add_hint($(element), (e, nr) => AddHint.add_overlay_hint(e, nr, false));
		});

		overlay_after_hints = [
 
		];
		$(overlay_after_hints.join(',')).each((index, element) => {
			Hints.add_hint($(element), (e, nr) => AddHint.add_overlay_hint(e, nr, true));
		});

		// // Link on collapsed thread header
		// $('a.bV.dj').each((index, element) => {
		// 	Hints.add_hint($(element), AddHint.add_hint);
		// });
	}

	GoogleInbox = {
		is_applicable: is_applicable,
		get_root_elements: get_root_elements,
		place_hints: place_hints,
	};
	websites.add_website(GoogleInbox);
})();