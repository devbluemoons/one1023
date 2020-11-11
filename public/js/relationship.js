import * as expands from "./modules/handsonTable.js";
import { Pagination } from "./modules/pagination.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    findMemberList();
});

function setEvent() {
    document.addEventListener("click", getCellId);
    document.querySelector("[name=name]").addEventListener("keyup", findMemberByName);
}

const pagination = new Pagination(document.getElementById("pagination"));

// get member list
function findMemberList() {
    // create member information
    fetch("/member", {
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
                setMemberTable(data.result);
                setPaging(data.paginator);
            }
        })
        .catch(error => {
            new Error(error);
        });
}

// set member list
function setMemberTable(data) {
    // make colHeaders
    const colHeaders = ["Image", "Name", "Address", "Age", "Family"];
    // make columns
    const columns = [
        { data: "imagePath", renderer: expands.imageRenderer, width: 50 },
        { data: "name", renderer: expands.identityRenderer },
        { data: "address1", className: "htLeft htMiddle" },
        { data: "birthday", renderer: expands.ageRenderer },
        { data: "family", renderer: expands.familyRenderer },
    ];
    // initialize container
    const container = document.getElementById("memberTable");
    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data, colHeaders, columns));
}

// set family list
function setFamilyTable(data) {
    // make colHeaders
    const colHeaders = ["Image", "Name", "Age", ""];
    // make columns
    const columns = [
        { data: "imagePath", renderer: expands.imageRenderer, width: 50 },
        { data: "name" },
        { data: "birthday", renderer: expands.ageRenderer },
        { data: "_id", renderer: expands.relateRenderer },
    ];
    // initialize container
    const container = document.getElementById("familyTable");
    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data, colHeaders, columns));
}

// set paging
function setPaging(paginator) {
    document.getElementById("totalCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchMember);
}

// get cell id on handsonTable
function getCellId(e) {
    if (!e.target.dataset.id) {
        return false;
    }
    const id = e.target.dataset.id;
    findMemberById(id);
}

function findMemberById(id) {
    fetch(`/member/${id}`, {
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
                setMemberValue(data);
            }
        })
        .catch(error => {
            new Error(error);
        });
}

function findMemberByName() {
    const name = document.querySelector("[name=name]").value || null;

    fetch(`/member?name=${name}`, {
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
                setFamilyTable(data.result);
            }
        })
        .catch(error => {
            new Error(error);
        });
}

function setMemberValue(data) {
    if (data.imagePath) {
        document.getElementById("imagePath").src = "/".concat(data.imagePath);
    } else {
        document.getElementById("imagePath").src = "/uploads/blank_profile.png";
    }
    document.getElementById("title").innerHTML = titleFormater(data);
}

/* formatter */
function titleFormater(value) {
    return `
        ${value.name} (${ageFormatter(value.birthday)})
    `;
}

function ageFormatter(value) {
    const year = value.substring(0, 4);
    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    return age;
}
