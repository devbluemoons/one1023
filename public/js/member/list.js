import * as expands from "../modules/handsonTable.js";
import { Pagination } from "../modules/pagination.js";
import { SearchParam } from "../modules/searchParam.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    setValue();
});

const pagination = new Pagination(document.getElementById("pagination"));

async function setValue() {
    const memberList = await findMemberList();

    if (memberList) {
        setDataTable(memberList.result);
        setPaging(memberList.paginator);
    }
}

function setEvent() {
    // set click event at search button
    document.getElementById("btnSearch").addEventListener("click", searchMember);

    // dynamic search
    document.querySelectorAll("input").forEach(item => {
        item.addEventListener("keyup", searchMember);
    });
}

// get member list
function findMemberList() {
    // make search parameter
    const url = makeSearchParameter();

    // create member information
    return fetch("/member" + url.params.search, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
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
        { data: this, renderer: expands.contactRenderer },
        { data: "address1", className: "htLeft htMiddle" },
        { data: "gender", renderer: expands.genderRenderer },
        { data: "birthday", renderer: expands.birthdayRenderer },
        { data: "birthday", renderer: expands.ageRenderer },
        { data: "familyGroup", renderer: expands.familyGroupRenderer },
        { data: "married" },
        { data: "faithState" },
    ];
}

function searchMember(e) {
    pagination.currentPage = e.target.dataset.page;
    setValue();
}

function makeSearchParameter() {
    const searchForm = document.getElementById("searchForm");
    const formData = new FormData(searchForm);
    const url = new SearchParam(pagination.currentPage, formData);

    return url;
}

// set paging
function setPaging(paginator) {
    document.getElementById("totalCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchMember);
}
