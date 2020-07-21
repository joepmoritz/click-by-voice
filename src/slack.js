var Slack = null;

(function() {

    function is_applicable() {
        return window.location.host.includes("slack.com");
    }

    function get_root_elements() {
        return $();
    }

    function place_hints() {
        overlay_before_hints = [
        ];
        $(overlay_before_hints.join(',')).each((index, element) => {
            Hints.add_hint($(element), (e, nr) => AddHint.add_overlay_hint(e, nr, false));
        });

        overlay_after_hints = [
            'a.c-link.p-channel_sidebar__channel',
            'button.c-button-unstyled.p-channel_sidebar__link',
            'a.c-link.c-pillow_file__header',
        ];
        $(overlay_after_hints.join(',')).each((index, element) => {
            Hints.add_hint($(element), (e, nr) => AddHint.add_overlay_hint(e, nr, true));
        });

        // Link on collapsed thread header
        normal_add_hints = [
            'a.c-link[target=_blank]'
        ];
        $(normal_add_hints.join(',')).each((index, element) => {
            Hints.add_hint($(element), AddHint.add_hint);
        });
    }

    Slack = {
        is_applicable: is_applicable,
        get_root_elements: get_root_elements,
        place_hints: place_hints,
    };
    websites.add_website(Slack);
})();
