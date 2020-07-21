var Github = null;

(function() {

    function is_applicable() {
        return window.location.host.includes("github");
    }

    function get_root_elements() {
    }

    function place_hints() {
        overlay_before_hints = [
            // 'div.aSH'
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
        //  Hints.add_hint($(element), AddHint.add_hint);
        // });
    }

    function do_not_hint_element(element) {
        // div.TimelineItem-body
        return element.is(".blob-num") || element.is("a.d-inline-block") || element.is("a.avatar");
    }

    Github = {
        is_applicable: is_applicable,
        // get_root_elements: get_root_elements,
        place_hints: place_hints,
        do_not_hint_element: do_not_hint_element,
    };
    websites.add_website(Github);
})();
