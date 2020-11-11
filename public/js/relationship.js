import * as expands from "./modules/handsonTable.js";
import { Pagination } from "./modules/pagination.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    findMemberList();
});

function setEvent() {
    document.addEventListener("click", e => getCellId(e));
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
                setDataTable(data.result);
                setPaging(data.paginator);
            }
        })
        .catch(error => {
            new Error(error);
        });
}

// find member list
function setDataTable(data) {
    const container = document.getElementById("memberTable");
    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data, makeColHeaders(), makeColumns()));
}

// make colHeaders
function makeColHeaders() {
    return ["Image", "Name", "Address", "Age", "Family"];
}

// make columns
function makeColumns() {
    return [
        { data: "imagePath", renderer: expands.imageRenderer, width: 50 },
        { data: "name", renderer: expands.familyRenderer },
        { data: "address1", className: "htLeft htMiddle" },
        { data: "birthday", renderer: expands.ageRenderer },
        { data: "family", renderer: expands.buttonRenderer },
    ];
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
    console.log(e.target.dataset.id);
}
