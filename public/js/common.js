window.addEventListener("DOMContentLoaded", e => {
    setEvent();
});

function setEvent() {
    // set autocomplete off at all input tag
    document.querySelectorAll("input").forEach(item => {
        item.setAttribute("autocomplete", "off");
    });

    // verify search form
    if (!document.getElementById("searchForm")) {
        return false;
    }

    // set [keyup] event input tag
    document
        .getElementById("searchForm")
        .querySelectorAll("input")
        .forEach(item => {
            item.addEventListener("keyup", e => {
                if (e.keyCode === 13) {
                    document.getElementById("btnSearch").dispatchEvent(new Event("click"));
                }
            });
        });

    // set [change] event select tag
    document
        .getElementById("searchForm")
        .querySelectorAll("select")
        .forEach(item => {
            item.addEventListener("change", e => {
                document.getElementById("btnSearch").dispatchEvent(new Event("click"));
            });
        });
}
