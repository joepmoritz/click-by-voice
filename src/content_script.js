///
/// Main routine
///

function perform_operation(operation, hint_number) {
    if (operation.startsWith("+")) {
	act("set_initial_operation", {initial_operation: operation});
	Hints.remove_hints();
	Hints.add_hints(operation.substr(1));
    } else if (operation == "-") {
	act("set_initial_operation", {initial_operation: operation});
	Hints.remove_hints();
    } else if (operation.startsWith("once+")) {
	Hints.remove_hints();
	Hints.add_hints(operation.substr(5));
    } else if (operation == "once-") {
	Hints.remove_hints();
    } else {
	Activate.goto_hint(hint_number, operation);
	setTimeout(Hints.refresh_hints, 750);
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
	perform_operation(request.operation, request.hint_number);
    });


$(document).ready(function() {
    Hints.refresh_hints();

    //setTimeout(function() { add_hints(); }, 5000);
    // This runs even when our tab is in the background:
    setInterval(Hints.refresh_hints, 3000);
});


request("get_initial_operation", {}, function(response) {
    perform_operation(response.initial_operation, "");
});

var refresh_timer = false;

function refresh_hints() {
    refresh_timer = false;
    Hints.refresh_hints();
}

var observer = new MutationObserver(function(mutations) {
    if (!refresh_timer)
    {
        refresh_timer = setTimeout(refresh_hints, 100);
    }

    mutations.forEach(function(mutation) {
        mutation.removedNodes.forEach((node) => {
            $(node).find("[CBV_hint_number]").each((index, element) => {
                Hints.remove_hint(element);
            });
        });
    })
});
observer.observe(document, { childList: true, subtree: true });
