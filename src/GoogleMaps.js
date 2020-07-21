var GoogleMaps = null;

(function() {

	function is_applicable() {
		return window.location.hostname == "www.google.co.uk" && window.location.pathname.startsWith("/maps");
	}

	function get_root_elements() {
		return $();
		// return null;
	}

	function place_hints() {
		overlay_before_hints = [
			'.section-info-action-button', // Send to phone how to button, AND location action buttons
			'.section-open-hours',
			'.section-popular-times-arrow-right',
		];
		$(overlay_before_hints.join(',')).each((index, element) => {
			Hints.add_hint($(element), (e, nr) => AddHint.add_overlay_hint(e, nr, false));
		});

		overlay_after_hints = [
			'.widget-settings-button', // Buttons in settings menu
			'.tactile-searchbox-input.searchboxinput', // Main search box
			'.tactile-searchbox-input#searchboxinput', // Main search box
			'.sbib_b .tactile-searchbox-input', // Main search box
			'.travel-mode-switcher-toggle', // Little toggle between driving and public transport
			'.sbsb_c > div', // suggestions
			'.section-categorical-shortcut-button', // Search this area category
			'.searchbox-hamburger', // Top left menu button
			// Below doesn't work, there is a disabled search box
			// '.searchbox .tactile-searchbox-input', // Main search box
			'.section-destination', // Directions suggestions
			'.section-hero-header-directions', // Big directions button
			'.section-action-button', // Action buttons
			'.gsst_a', // Close button
			'.section-result', // Search results
			'.section-directions-trip', // Direction search results
			'.context-menu-entry.kd-menulistitem', // Save to lists
			'.widget-directions-close',
			'.travel-mode > button',
			'.widget-directions-reverse',
			'.widget-directions-icon.waypoint-add',
			'.widget-directions-remove-waypoint',
			'.close-button-white-circle', // Send to phone how to close button
			'.goog-menu-button-dropdown', // Very small drop down button
			'.goog-menuitem', // drop down for leave now needs 2 clicks?
			// '.goog-menuitem-content',
			'.widget-mylocation-button',
			'.widget-minimap-shim-button',
			'.section-directions-details-action-button', // Direction details small buttons (share, send to phone)
			'.transit-logical-step-content', // Direction details step
			'.section-trip-header-back', // Back from directions results button
			'.time-input', // Leave on / depart at time input box
			'.date-picker-buttons > .decrease-button',
			'.date-picker-buttons > .increase-button',
			'.section-popular-times-arrow-left',
			'.section-image-pack-button', // Photos
			'.section-header-button', // Reviews back button, and probably more
			'.calendar-trip-button', // Trips in schedule explore
		];
		$(overlay_after_hints.join(',')).each((index, element) => {
			Hints.add_hint($(element), (e, nr) => AddHint.add_overlay_hint(e, nr, true));
		});

		default_hints = [
			// 'label', // options and other crap that doesn't work so well
			'.kd-radio-label', // Options for directions
			'.kd-checkbox-label', // Options for directions
			'.section-button-label', // Suggest an edit
			'button.widget-pane-link', // X reviews link
			'.section-schedule-explorer-label',
			'.section-directions-action-button', // In line send to phone button
			'.section-directions-options-link',
			'.section-transit-station-footer-departure-board-link-text',
			'.section-reviewchart-numreviews', // Linked to reviews next to review summary
			'.section-write-review',
			'.section-back-to-list-button',
			'.section-copy-link-copy-button',
		];
		$(default_hints.join(',')).each((index, element) => {
			Hints.add_hint($(element), AddHint.add_hint);
		});

		// Link on collapsed thread header
		// $('a.bV.dj').each((index, element) => {
		// 	Hints.add_hint($(element), AddHint.add_hint);
		// });
	}

	GoogleMaps = {
		is_applicable: is_applicable,
		get_root_elements: get_root_elements,
		place_hints: place_hints,
	};
	websites.add_website(GoogleMaps);
})();
