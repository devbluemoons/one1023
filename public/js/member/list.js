import * as expands from "../common.js";
import * as pagination from "../modules/pagination.js";

window.onload = function () {
    findMemberList();
    countMemberList();
};

// get count of member list
function countMemberList() {
    // create member information
    fetch("/member/count", {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // document.getElementById("totalCount").textContent = data.count;
        })
        .catch(error => {
            new Error(error);
        });
}

// get member list
function findMemberList() {
    // create member information
    fetch("/member/find", {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                setDataTable(data);
                setPagination();
            }
        })
        .catch(error => {
            new Error(error);
        });
}

// find member list
function setDataTable(data) {
    const container = document.getElementById("dataTable");
    const hot = new Handsontable(container, expands.defaultSettings(data, makeColHeaders(), makeColumns(), 0.58));
}

// set pagination
function setPagination() {
    document.getElementById("pagination").innerHTML = pagination.makePagination();
}

// make colHeaders
function makeColHeaders() {
    return ["Image", "Name", "Contact", "Address", "Gender", "Birthday", "Age", "Family", "Marital Status", "Faith State"];
}

// make columns
function makeColumns() {
    return [
        { data: "imagePath", renderer: expands.imageRenderer },
        { data: "name", renderer: expands.memberDetailRenderer },
        { data: "contact", renderer: expands.contactRenderer },
        { data: "address1" },
        { data: "gender", renderer: expands.genderRenderer },
        { data: "birthday", renderer: expands.birthdayRenderer },
        { data: "birthday", renderer: expands.ageRenderer },
        { data: "family" },
        { data: "married" },
        { data: "faithState" },
    ];
}
