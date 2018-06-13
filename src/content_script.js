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
    // setInterval(Hints.refresh_hints, 3000);
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
        if (mutation.type == 'attributes') {
            if (!mutation.target.hasAttribute('cbv_hint_number')) {
                // console.log('The ' + mutation.attributeName + ' attribute was deleted.');
                Hints.remove_hint(mutation.target, mutation.oldValue);
            }
        }

        mutation.removedNodes.forEach((node) => {
            // console.log('Node removed ');
            // console.log(node);

            if (node.hasAttribute && node.hasAttribute('cbv_hint_number')) {
                // console.log('Node has attribute');
                Hints.remove_hint(node);
            }

            $(node).find('[cbv_hint_number]').each((index, element) => {
                Hints.remove_hint(element);
            });

            function remove_hint_tag(tag_element) {
                hint_number = tag_element.getAttribute("CBV_hint_tag");
                elements = $("[cbv_hint_number='" + hint_number + "']");
                elements.each((index, element) => Hints.remove_hint(element, hint_number));
            }

            if (node.hasAttribute && node.hasAttribute('CBV_hint_tag')) {
                // console.log('Node has attribute CBV_hint_tag');
                remove_hint_tag(node);
            }

            $(node).find("[CBV_hint_tag]").each((index, tag_element) => {
                remove_hint_tag(tag_element);
            });
        });
    })
});
observer.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['cbv_hint_number'], attributeOldValue: true});


window.addEventListener('scroll', () => {
    if (!refresh_timer)
        refresh_timer = setTimeout(refresh_hints, 100);
});

window.addEventListener('focus', () => {
    if (!refresh_timer)
        refresh_timer = setTimeout(refresh_hints, 100);
});

