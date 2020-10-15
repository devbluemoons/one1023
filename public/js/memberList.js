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
                testGrirdJS(data);
                // loadMemberList(data);
            }
        })
        .catch(error => {
            new Error(error);
        });
}

function loadMemberList(data) {
    const tableContainer = document.getElementById("dataTable");

    new Handsontable(tableContainer, {
        data: data,
        bindRowsWithHeaders: true,
        rowHeaders: true,
        height: window.innerHeight,
        stretchH: "all",
        readOnly: true,
        licenseKey: "non-commercial-and-evaluation",
        maxRows: 20,
        autoColumnSize: true,
        colHeaders: ["Image", "Name", "Contact", "Address", "Gender", "Birthday", "Marital Status", "Faith State"],
        columns: [
            { data: null, renderer: imageRenderer },
            { data: "name" },
            { data: "contact", renderer: contactRenderer, autoColumnSize: true },
            { data: "address1" },
            { data: "gender" },
            { data: "birthday" },
            { data: "married" },
            { data: "martialStatus" },
            { data: "faithState" },
        ],
        manualRowResize: true,
        manualColumnResize: true,
    });
}

// hansdonTable Renderer
function imageRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value) {
        const textNode = document.createTextNode(value);
        td.appendChild(textNode);
    } else {
        const textNode = document.createTextNode(null);
        td.appendChild(textNode);
    }
}

function contactRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value) {
        const contact = [value.contact1, value.contact2, value.contact3].join("-");
        const textNode = document.createTextNode(contact);
        td.appendChild(textNode);
    }
}

// grid.js
function testGrirdJS(data) {
    new gridjs.Grid({
        data: data,
        columns: [
            { name: "Image", id: "imagePath" },
            { name: "Name", id: "name" },
            { name: "Contact", id: "contact", formatter: contactFormatter },
            { name: "Address", id: "address1" },
            { name: "Gender", id: "gender" },
            { name: "Birthday", id: "birthday" },
            { name: "Marital Status", id: "married" },
            { name: "Faith State", id: "faithState" },
        ],
        data: data,
        pagination: true,
        fixedHeader: true,
        sort: false,
        search: {
            enabled: true,
        },
        language: {
            search: {
                placeholder: "🔍 Search...",
            },
            pagination: {
                previous: "<<",
                next: ">>",
                showing: "😃 Displaying",
                results: () => "Records",
            },
        },
    }).render(document.getElementById("dataTable"));
}

function contactFormatter(data) {
    if (data) {
        return [data.contact1, data.contact2, data.contact3].join("-");
    }
}
