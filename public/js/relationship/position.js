"use strict";

import { Pagination } from "../modules/pagination.js";
import * as expands from "../modules/handsonTable.js";
import * as common from "../common.js";

document.getElementById("nav-position-tab").addEventListener("shown.bs.tab", setPosition);
const pagination = new Pagination(document.getElementById("positionPagination"));
const positionModalEl = document.getElementById("positionModal");
const positionModal = new bootstrap.Modal(positionModalEl);

function setPosition() {
    setPositionValue();
    setPositionEvent();
}

async function setPositionValue() {
    const url = new URL(document.URL);
    url.searchParams.append("division", "position");

    const positionList = await findPositionList(url);

    setPositionTable(positionList);
    setPaging(positionList.paginator);
}

function setPositionEvent() {
    document.querySelector("#positionForm #btnSave").addEventListener("click", registerPosition);
    document.querySelector("#positionModal #btnEdit").addEventListener("click", editPositionInfo);
    document.querySelector("#positionTable").addEventListener("click", showPositionInfo);

    document.querySelector("#positionTable").addEventListener("click", setPositionInfo);
    document.querySelector("#positionDetailForm [name=name]").addEventListener("keyup", setSelectedMemeber);
}

async function setPositionInfo(e) {
    if (e.target.name === "name") {
        document.getElementById("selectedPosition").innerText = e.target.textContent;
        document.getElementById("selectedPositionId").value = e.target.dataset.id;

        // refresh position detail
        const positionList = await findMemberByPosition(e.target.dataset.id);
        setPositionDetail(positionList);
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
    const searchResult = document.getElementById("positionSearchResult");
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
        searchResult.querySelectorAll("button").forEach(item => item.addEventListener("click", addPosition));
    });
}

async function addPosition(e) {
    // standard position id
    const selectedPositionId = document.getElementById("selectedPositionId").value;
    // to add member id
    const memberId = e.target.id;

    if (!selectedPositionId) {
        alert("Please, select a standard position");
        return false;
    }
    if (!memberId) {
        alert("Please, select member to add");
        return false;
    }

    const member = await findMemberById(memberId);

    if (member) {
        member.position = selectedPositionId;
        await updateMember(member);

        // re-render table
        setPositionValue();

        // refresh position detail
        const positionList = await findMemberByPosition(selectedPositionId);
        setPositionDetail(positionList);
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

// get member by member position
function findMemberByPosition(position) {
    return fetch(`/member?position=${position}`, {
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
    const name = document.querySelector("#positionDetailForm [name=name]").value || null;

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

// get position list
function findPositionList(url) {
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

// get position by id
function findPositionByDivisionAndId(url) {
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

// get position by name
function findPositionByDivisionAndName(url) {
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

// create position
function createPosition(data) {
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

async function setPositionDetail(data) {
    const positionList = data.result;
    // sort by birthday
    positionList.sort(function (a, b) {
        if (a.birthday > b.birthday) {
            return 1;
        }
        if (a.birthday < b.birthday) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    // set simple member info in family position
    const defaultImage = "uploads/blank_profile.png";
    const related = document.getElementById("relatedPosition");
    related.innerHTML = "";

    positionList.forEach(member => {
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

    // set delete member in family position
    document.querySelectorAll(".btn-close").forEach(member => {
        member.addEventListener("click", deletePositionMember);
    });
}

// set position list
function setPositionTable(data) {
    // make colHeaders
    const colHeaders = ["Name", "Condition", "Count", ""];
    // make columns
    const columns = [{ data: "name", renderer: expands.identityRenderer }, { data: "valid", renderer: expands.conditionRenderer }, { data: "count" }, { data: this, renderer: expands.editRenderer }];
    // initialize container
    const container = document.getElementById("positionTable");
    const positionInfo = container.getBoundingClientRect();
    const containerTop = positionInfo.top;

    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, containerTop, colHeaders, columns));
}

// set paging
function setPaging(paginator) {
    document.getElementById("positionCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchPosition);
}

// show position info
async function showPositionInfo(e) {
    if (!e.target.classList.contains("btn")) {
        return false;
    }
    if (!e.target.dataset.id) {
        return false;
    }

    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "position");
    url.searchParams.append("_id", e.target.dataset.id);

    const position = await findPositionByDivisionAndId(url);

    if (position) {
        positionModalEl.querySelector("[name=_id]").value = position._id;
        positionModalEl.querySelector("[name=name]").value = position.name;
        positionModalEl.querySelector("[name=valid]").value = position.valid;

        positionModal.show();
    }
}

// edit position info
async function editPositionInfo() {
    const positionModalForm = document.getElementById("positionModalForm");

    const _id = positionModalForm.querySelector("[name=_id]").value;
    const name = positionModalForm.querySelector("[name=name]").value;
    const valid = positionModalForm.querySelector("[name=valid]").value;

    const data = {
        _id: _id,
        name: name,
        valid: valid,
    };

    const position = await updatePosition(data);

    if (position) {
        setPositionValue();
        positionModal.hide();
    }
}

// update position info
function updatePosition(data) {
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

async function deletePositionMember(e) {
    const memberId = e.target.dataset.id;

    if (!memberId) {
        return false;
    }

    if (!confirm("Are you sure to delete this member from position?")) {
        return false;
    }

    const member = await findMemberById(memberId);

    if (member) {
        member.position = null;

        await updateMember(member);

        // re-render table
        setPositionValue();

        // refresh position detail
        const positionId = document.getElementById("selectedPositionId").value;
        const positionList = await findMemberByPosition(positionId);
        setPositionDetail(positionList);
    }
}

// search position per page
function searchPosition(e) {
    pagination.currentPage = e.target.dataset.page;
    setPositionValue();
}

// register position
async function registerPosition() {
    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "position");
    url.searchParams.append("name", document.querySelector("#positionForm [name=name]").value);

    const position = await findPositionByDivisionAndName(url);

    if (position) {
        alert("The same position exists!");
        return false;
    }

    // set form data
    const positionForm = document.getElementById("positionForm");
    const name = positionForm.querySelector("[name=name]").value;

    const param = {
        name: name,
        division: "position",
    };

    // create position
    await createPosition(param);
    // set position table
    setPositionValue();
}

function ageFormatter(value) {
    const year = value.substring(0, 4);
    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    return age;
}
