import * as expands from "../modules/handsonTable.js";
import { Pagination } from "../modules/pagination.js";
import { SearchParam } from "../modules/searchParam.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    findMemberList();
});

const pagination = new Pagination(document.getElementById("pagination"));

// get member list
function findMemberList() {
    // make search parameter
    const url = makeSearchParameter();

    // create member information
    fetch("/member" + url.params.search, {
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
    const container = document.getElementById("dataTable");
    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data, makeColHeaders(), makeColumns()));
}

// make colHeaders
function makeColHeaders() {
    return ["Image", "Name", "Contact", "Address", "Gender", "Birthday", "Age", "Family", "Marital Status", "Faith State"];
}

// make columns
function makeColumns() {
    return [
        { data: "imagePath", renderer: expands.imageRenderer, width: 50 },
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

function searchMember(e) {
    pagination.currentPage = e.target.dataset.page;
    findMemberList();
}

function makeSearchParameter() {
    const searchForm = document.getElementById("searchForm");
    const formData = new FormData(searchForm);
    const url = new SearchParam(pagination.currentPage, formData);

    return url;
}

function setEvent() {
    // set click event at search button
    document.getElementById("btnSearch").addEventListener("click", searchMember);

    // dynamic search
    document.querySelectorAll("input").forEach(item => {
        item.addEventListener("keyup", e => {
            searchMember(e);
        });
    });
}

// set paging
function setPaging(paginator) {
    document.getElementById("totalCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchMember);
}
