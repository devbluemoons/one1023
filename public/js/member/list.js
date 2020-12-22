import * as expands from "../modules/handsonTable.js";
import { Pagination } from "../modules/pagination.js";
import { SearchParam } from "../modules/searchParam.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    setValue();
});

const pagination = new Pagination(document.getElementById("pagination"));

async function setValue() {
    // make search parameter
    const url = makeSearchParameter("searchForm");

    // get member list
    const memberList = await findMemberList(url);

    if (memberList) {
        setDataTable(memberList);
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
function findMemberList(url) {
    // create member information
    return fetch("/member" + url.params.search, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

// find member list
function setDataTable(data) {
    // make colHeaders
    const colHeaders = ["Image", "Name", "Contact", "Address", "Gender", "Birthday", "Age", "Family", "Marital Status", "Faith State"];
    // make columns
    const columns = [
        { data: "imagePath", renderer: expands.imageRenderer, width: 50 },
        { data: "name", renderer: expands.memberDetailRenderer },
        { data: null, renderer: expands.contactRenderer },
        { data: "address1", className: "htLeft htMiddle" },
        { data: "gender", renderer: expands.genderRenderer },
        { data: "birthday", renderer: expands.birthdayRenderer },
        { data: "birthday", renderer: expands.ageRenderer },
        { data: "family", renderer: expands.familyGroupRenderer },
        { data: "married" },
        { data: "faithState" },
    ];

    const container = document.getElementById("dataTable");
    const positionInfo = container.getBoundingClientRect();
    const containerTop = positionInfo.top;

    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, containerTop, colHeaders, columns));
}

function searchMember(e) {
    pagination.currentPage = e.target.dataset.page;
    setValue();
}

function makeSearchParameter(form) {
    const searchForm = document.getElementById(form);
    const formData = new FormData(searchForm);
    const url = new SearchParam(pagination.currentPage, formData, null);

    return url;
}

// set paging
function setPaging(paginator) {
    document.getElementById("totalCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchMember);
}
