"use strict";

window.addEventListener("DOMContentLoaded", e => {
    // active tab (default: first tab)
    document.querySelector("#nav-tab a:first-child").dispatchEvent(new Event("click"));

    // set current tab
    const triggerTabList = [].slice.call(document.querySelectorAll("#nav-tab a"));

    triggerTabList.forEach(function (triggerEl) {
        // reload when click tab
        triggerEl.addEventListener("click", function () {
            location.hash = this.hash;
            location.reload();
        });
    });

    // get current tab
    if (!location.hash) {
        return false;
    }
    const currentTabEl = document.querySelector(`#nav-tab a[href="${location.hash}"]`);
    const tab = new bootstrap.Tab(currentTabEl);
    tab.show();
});
