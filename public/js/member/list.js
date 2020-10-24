import * as expands from "../modules/handsonTable.js";
import * as pagination from "../modules/pagination.js";

window.addEventListener("DOMContentLoaded", event => {
    findMemberList();
    countMemberList();
});

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
            document.getElementById("totalCount").textContent = data.count;
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
                setDataTable(data.docs);
                setPagination(data);
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
function setPagination(data) {
    document.getElementById("pagination").insertAdjacentHTML("afterend", pagination.makePagination(data));
    setEvent();
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
