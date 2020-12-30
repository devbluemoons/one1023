"use strict";

import { Pagination } from "../modules/pagination.js";
import * as expands from "../modules/handsonTable.js";
import * as common from "../common.js";

document.getElementById("nav-school-tab").addEventListener("shown.bs.tab", setSchool);
const pagination = new Pagination(document.getElementById("schoolPagination"));
const schoolModalEl = document.getElementById("schoolModal");
const schoolModal = new bootstrap.Modal(schoolModalEl);

function setSchool() {
    setSchoolValue();
    setSchoolEvent();
}

async function setSchoolValue() {
    const url = new URL(document.URL);
    url.searchParams.append("division", "school");

    const schoolList = await findSchoolList(url);

    setSchoolTable(schoolList);
    setPaging(schoolList.paginator);
}

function setSchoolEvent() {
    document.querySelector("#schoolForm #btnSave").addEventListener("click", registerSchool);
    document.querySelector("#schoolModal #btnEdit").addEventListener("click", editSchoolInfo);
    document.querySelector("#schoolTable").addEventListener("click", showSchoolInfo);

    document.querySelector("#schoolTable").addEventListener("click", setSchoolInfo);
    document.querySelector("#schoolDetailForm [name=name]").addEventListener("keyup", setSelectedMemeber);
}

async function setSchoolInfo(e) {
    if (e.target.name === "name") {
        document.getElementById("selectedSchool").innerText = e.target.textContent;
        document.getElementById("selectedSchoolId").value = e.target.dataset.id;

        // refresh school detail
        const schoolList = await findMemberBySchool(e.target.dataset.id);
        setSchoolDetail(schoolList);
    }
}

async function setSelectedMemeber() {
    const member = await findMemberByName();

    if (member) {
        setSearchResult(member.result);
    }
}

function setSearchResult(data) {
    const defaultImage = "uploads/blank_profile.png";
    const searchResult = document.getElementById("schoolSearchResult");
    searchResult.innerHTML = "";

    data.forEach(item => {
        searchResult.innerHTML += `
            <div class="col-2 pt-3">
                <div class="card text-center">
                    <div class="frame">
                        <img src="/${item.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                    </div>
                    <div class="border-top pTB-10 p-2">${item.name}</div>
                    <button class="btn btn-outline-secondary btn-sm" id="${item._id}" >Add</button>
                </div>
            </div>
        `;

        // set to same height and width
        // set vertical-align : middle
        common.setVerticalImage();

        // binding add event
        searchResult.querySelectorAll("button").forEach(item => item.addEventListener("click", addSchool));
    });
}

async function addSchool(e) {
    // standard school id
    const selectedSchoolId = document.getElementById("selectedSchoolId").value;
    // to add member id
    const memberId = e.target.id;

    if (!selectedSchoolId) {
        alert("Please, select a standard school");
        return false;
    }
    if (!memberId) {
        alert("Please, select member to add");
        return false;
    }

    const member = await findMemberById(memberId);

    if (member) {
        member.school = selectedSchoolId;
        await updateMember(member);

        // re-render table
        setSchoolValue();

        // refresh school detail
        const schoolList = await findMemberBySchool(selectedSchoolId);
        setSchoolDetail(schoolList);
    }
}

// get member by member id
function findMemberById(id) {
    return axios
        .get(`/member/${id}/one`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get member by member school
function findMemberBySchool(school) {
    return axios
        .get(`/member?school=${school}`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get member by name
function findMemberByName() {
    const name = document.querySelector("#schoolDetailForm [name=name]").value || null;

    return axios
        .get(`/member?name=${name}`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get school list
function findSchoolList(url) {
    return axios
        .get("/code/division" + url.search)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get school by id
function findSchoolByDivisionAndId(url) {
    return axios
        .get("/code/division/id" + url.search)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get school by name
function findSchoolByDivisionAndName(url) {
    return axios
        .get("/code/division/name" + url.search)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// update family field of member
function updateMember(data) {
    return axios
        .put("/member", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// create school
function createSchool(data) {
    return axios
        .post("/code", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

async function setSchoolDetail(data) {
    const schoolList = data.result;
    // sort by birthday
    schoolList.sort(function (a, b) {
        if (a.birthday > b.birthday) {
            return 1;
        }
        if (a.birthday < b.birthday) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    // set simple member info in family school
    const defaultImage = "uploads/blank_profile.png";
    const related = document.getElementById("relatedSchool");
    related.innerHTML = "";

    schoolList.forEach(member => {
        related.innerHTML += `
            <div class="col-2">
                <div class="card text-center">
                    <div class="frame">
                        <img src="/${member.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                        <button type="button" class="btn-close btn-close-white" aria-label="Close" data-id="${member._id}"></button>
                    </div>
                    <div class="border-top pTB-10">
                        ${member.name} (${ageFormatter(member.birthday)})
                    </div>
                </div>
            </div>
        `;
    });

    // set to same height and width
    // set vertical-align : middle
    common.setVerticalImage();

    // set delete member in family school
    document.querySelectorAll(".btn-close").forEach(member => {
        member.addEventListener("click", deleteSchoolMember);
    });
}

// set school list
function setSchoolTable(data) {
    // make colHeaders
    const colHeaders = ["Name", "Condition", "Count", ""];
    // make columns
    const columns = [{ data: "name", renderer: expands.identityRenderer }, { data: "valid", renderer: expands.conditionRenderer }, { data: "count" }, { data: this, renderer: expands.editRenderer }];
    // initialize container
    const container = document.getElementById("schoolTable");
    const schoolInfo = container.getBoundingClientRect();
    const containerTop = schoolInfo.top;

    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, containerTop, colHeaders, columns));
}

// set paging
function setPaging(paginator) {
    document.getElementById("schoolCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchSchool);
}

// show school info
async function showSchoolInfo(e) {
    if (!e.target.classList.contains("btn")) {
        return false;
    }
    if (!e.target.dataset.id) {
        return false;
    }

    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "school");
    url.searchParams.append("_id", e.target.dataset.id);

    const school = await findSchoolByDivisionAndId(url);

    if (school) {
        schoolModalEl.querySelector("[name=_id]").value = school._id;
        schoolModalEl.querySelector("[name=name]").value = school.name;
        schoolModalEl.querySelector("[name=valid]").value = school.valid;

        schoolModal.show();
    }
}

// edit school info
async function editSchoolInfo() {
    const schoolModalForm = document.getElementById("schoolModalForm");

    const _id = schoolModalForm.querySelector("[name=_id]").value;
    const name = schoolModalForm.querySelector("[name=name]").value;
    const valid = schoolModalForm.querySelector("[name=valid]").value;

    const data = {
        _id: _id,
        name: name,
        valid: valid,
    };

    const school = await updateSchool(data);

    if (school) {
        setSchoolValue();
        schoolModal.hide();
    }
}

// update school info
function updateSchool(data) {
    return axios
        .put("/code", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

async function deleteSchoolMember(e) {
    const memberId = e.target.dataset.id;

    if (!memberId) {
        return false;
    }

    if (!confirm("Are you sure to delete this member from school?")) {
        return false;
    }

    const member = await findMemberById(memberId);

    if (member) {
        delete member.school;
        await updateMember(member);

        // re-render table
        setSchoolValue();

        // refresh school detail
        const schoolId = document.getElementById("selectedSchoolId").value;
        const schoolList = await findMemberBySchool(schoolId);
        setSchoolDetail(schoolList);
    }
}

// search school per page
function searchSchool(e) {
    pagination.currentPage = e.target.dataset.page;
    setSchoolValue();
}

// register school
async function registerSchool() {
    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "school");
    url.searchParams.append("name", document.querySelector("#schoolForm [name=name]").value);

    const school = await findSchoolByDivisionAndName(url);

    if (school) {
        alert("The same school exists!");
        return false;
    }

    // set form data
    const schoolForm = document.getElementById("schoolForm");
    const name = schoolForm.querySelector("[name=name]").value;

    const param = {
        name: name,
        division: "school",
    };

    // create school
    await createSchool(param);
    // set school table
    setSchoolValue();
}

function ageFormatter(value) {
    const year = value.substring(0, 4);
    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    return age;
}
