"use strict";

import { Pagination } from "../modules/pagination.js";
import * as expands from "../modules/handsonTable.js";
import * as common from "../common.js";

document.getElementById("nav-group-tab").addEventListener("shown.bs.tab", setGroup);
const pagination = new Pagination(document.getElementById("groupPagination"));
const groupModalEl = document.getElementById("groupModal");
const groupModal = new bootstrap.Modal(groupModalEl);

function setGroup() {
    setGroupValue();
    setGroupEvent();
}

async function setGroupValue() {
    const url = new URL(document.URL);
    url.searchParams.append("division", "group");

    const groupList = await findGroupList(url);

    setGroupTable(groupList);
    setPaging(groupList.paginator);
}

function setGroupEvent() {
    document.querySelector("#groupForm #btnSave").addEventListener("click", registerGroup);
    document.querySelector("#groupModal #btnEdit").addEventListener("click", editGroupInfo);
    document.querySelector("#groupTable").addEventListener("click", showGroupInfo);

    document.querySelector("#groupTable").addEventListener("click", setGroupInfo);
    document.querySelector("#groupDetailForm [name=name]").addEventListener("keyup", setSelectedMemeber);
}

async function setGroupInfo(e) {
    if (e.target.name === "name") {
        document.getElementById("selectedGroup").innerText = e.target.textContent;
        document.getElementById("selectedGroupId").value = e.target.dataset.id;

        // refresh group detail
        const groupList = await findMemberByGroup(e.target.dataset.id);
        setGroupDetail(groupList);
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
    const searchResult = document.getElementById("groupSearchResult");
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
        searchResult.querySelectorAll("button").forEach(item => item.addEventListener("click", addGroup));
    });
}

async function addGroup(e) {
    // standard group id
    const selectedGroupId = document.getElementById("selectedGroupId").value;
    // to add member id
    const memberId = e.target.id;

    if (!selectedGroupId) {
        alert("Please, select a standard group");
        return false;
    }
    if (!memberId) {
        alert("Please, select member to add");
        return false;
    }

    const member = await findMemberById(memberId);

    if (member) {
        member.group = selectedGroupId;
        await updateMember(member);

        // re-render table
        setGroupValue();

        // refresh group detail
        const groupList = await findMemberByGroup(selectedGroupId);
        setGroupDetail(groupList);
    }
}

// get member by member id
function findMemberById(id) {
    return fetch(`/member/${id}`, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

// get member by member group
function findMemberByGroup(group) {
    return fetch(`/member?group=${group}`, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

function findMemberByName() {
    const name = document.querySelector("#groupDetailForm [name=name]").value || null;

    return fetch(`/member?name=${name}`, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

// get group list
function findGroupList(url) {
    return fetch("/code/division" + url.search, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

// get group by id
function findGroupByDivisionAndId(url) {
    return fetch("/code/division/id" + url.search, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

// get group by name
function findGroupByDivisionAndName(url) {
    return fetch("/code/division/name" + url.search, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

// update family field of member
function updateMember(data) {
    return fetch("/member", {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

// create group
function createGroup(data) {
    return fetch("/code", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

async function setGroupDetail(data) {
    const groupList = data.result;
    // sort by birthday
    groupList.sort(function (a, b) {
        if (a.birthday > b.birthday) {
            return 1;
        }
        if (a.birthday < b.birthday) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    // set simple member info in family group
    const defaultImage = "uploads/blank_profile.png";
    const related = document.getElementById("relatedGroup");
    related.innerHTML = "";

    groupList.forEach(member => {
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

    // set delete member in family group
    document.querySelectorAll(".btn-close").forEach(member => {
        member.addEventListener("click", deleteGroupMember);
    });
}

// set group list
function setGroupTable(data) {
    // make colHeaders
    const colHeaders = ["Name", "Condition", "Count", ""];
    // make columns
    const columns = [{ data: "name", renderer: expands.identityRenderer }, { data: "valid", renderer: expands.conditionRenderer }, { data: "count" }, { data: this, renderer: expands.editRenderer }];
    // initialize container
    const container = document.getElementById("groupTable");
    const positionInfo = container.getBoundingClientRect();
    const containerTop = positionInfo.top;

    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, containerTop, colHeaders, columns));
}

// set paging
function setPaging(paginator) {
    document.getElementById("groupCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchGroup);
}

// show group info
async function showGroupInfo(e) {
    if (!e.target.classList.contains("btn")) {
        return false;
    }
    if (!e.target.dataset.id) {
        return false;
    }

    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "group");
    url.searchParams.append("_id", e.target.dataset.id);

    const group = await findGroupByDivisionAndId(url);

    if (group) {
        groupModalEl.querySelector("[name=_id]").value = group._id;
        groupModalEl.querySelector("[name=name]").value = group.name;
        groupModalEl.querySelector("[name=valid]").value = group.valid;

        groupModal.show();
    }
}

// edit group info
async function editGroupInfo() {
    const groupModalForm = document.getElementById("groupModalForm");

    const _id = groupModalForm.querySelector("[name=_id]").value;
    const name = groupModalForm.querySelector("[name=name]").value;
    const valid = groupModalForm.querySelector("[name=valid]").value;

    const data = {
        _id: _id,
        name: name,
        valid: valid,
    };

    const group = await updateGroup(data);

    if (group) {
        setGroupValue();
        groupModal.hide();
    }
}

// update group info
function updateGroup(data) {
    return fetch("/code", {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

async function deleteGroupMember(e) {
    const memberId = e.target.dataset.id;

    if (!memberId) {
        return false;
    }

    if (!confirm("Are you sure to delete this member from group?")) {
        return false;
    }

    const member = await findMemberById(memberId);

    if (member) {
        member.group = null;

        await updateMember(member);

        // re-render table
        setGroupValue();

        // refresh group detail
        const groupId = document.getElementById("selectedGroupId").value;
        const groupList = await findMemberByGroup(groupId);
        setGroupDetail(groupList);
    }
}

// search group per page
function searchGroup(e) {
    pagination.currentPage = e.target.dataset.page;
    setGroupValue();
}

// register group
async function registerGroup() {
    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "group");
    url.searchParams.append("name", document.querySelector("#groupForm [name=name]").value);

    const group = await findGroupByDivisionAndName(url);

    if (group) {
        alert("The same group exists!");
        return false;
    }

    // set form data
    const groupForm = document.getElementById("groupForm");
    const name = groupForm.querySelector("[name=name]").value;

    const param = {
        name: name,
        division: "group",
    };

    // create group
    await createGroup(param);
    // set group table
    setGroupValue();
}

function ageFormatter(value) {
    const year = value.substring(0, 4);
    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    return age;
}
