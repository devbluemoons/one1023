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
                loadMemberList(data);
            }
        })
        .catch(error => {
            new Error(error);
        });
}

function loadMemberList(data) {
    const tableContainer = document.getElementById("handsonTable");

    new Handsontable(tableContainer, {
        data: data,
        bindRowsWithHeaders: true,
        rowHeaders: true,
        colHeaders: ["Image", "Name", "Contact", "Address", "Gender", "Birthday", "Marital Status", "Faith State"],
        preventOverflow: "vertical",
        height: "100vh",
        autoColumnSize: { useHeaders: true },
        readOnly: true,
        licenseKey: "non-commercial-and-evaluation",
    });
}
