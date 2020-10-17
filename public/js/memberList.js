import * as expands from "./common.js";

window.onload = function () {
    getMemberList();
};

// get member list
function getMemberList() {
    // create member information
    fetch("member/list", {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                findMemberList(data);
            }
        })
        .catch(error => {
            new Error(error);
        });
}

// find member list
function findMemberList(data) {
    const container = document.getElementById("dataTable");
    const hot = new Handsontable(container, expands.defaultSettings(data, makeColHeaders(), makeColumns(), 0.58));

    hot.render();

    // hot.addHook("beforeInit", function (a, b, c) {
    //     console.log(111111);
    // });

    // hot.selectRows(5);
}

function makeColHeaders() {
    return ["Image", "Name", "Contact", "Address", "Gender", "Birthday", "Marital Status", "Faith State"];
}

function makeColumns() {
    return [
        { data: null, renderer: expands.imageRenderer },
        { data: "name" },
        { data: "contact", renderer: expands.contactRenderer },
        { data: "address1" },
        { data: "gender" },
        { data: "birthday" },
        { data: "married" },
        { data: "faithState" },
    ];
}
