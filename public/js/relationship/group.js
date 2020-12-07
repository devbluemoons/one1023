import * as expands from "../modules/handsonTable.js";
import { Pagination } from "../modules/pagination.js";

document.getElementById("nav-group-tab").addEventListener("shown.bs.tab", setGroup);
const pagination = new Pagination(document.getElementById("groupPagination"));

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
    document.querySelector("#groupTable").addEventListener("click", showGroupInfo);
    document.querySelector("#btnEdit").addEventListener("click", editGroupInfo);

    // document.querySelector("#groupTable").addEventListener("click", setGroupInfo);
    // document.querySelector("[name=name]").addEventListener("keyup", setSelectedGroupMemeber);
}

// get group list
function findGroupList(url) {
    return fetch("/code/division" + url.search, {
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

function findGroupByDivisionAndName(url) {
    return fetch("/code/division/name" + url.search, {
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

// create group
function createGroup(data) {
    return fetch("/code", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data),
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

// set group list
function setGroupTable(data) {
    // make colHeaders
    const colHeaders = ["Name", "Condition", "Count", ""];
    // make columns
    const columns = [
        { data: "name", renderer: expands.identityRenderer },
        { data: "valid", renderer: expands.conditionRenderer },
        { data: "this", renderer: expands.countRenderer },
        { data: this, renderer: expands.editRenderer },
    ];
    // initialize container
    const container = document.getElementById("groupTable");
    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, container.offsetTop, colHeaders, columns));
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
        const container = document.getElementById("groupModal");
        container.querySelector("[name=_id]").value = group._id;
        container.querySelector("[name=name]").value = group.name;
        container.querySelector("[name=valid]").value = group.valid;

        const modal = new bootstrap.Modal(container);
        modal.show();
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
                console.error(response);
            }
            return response.json();
        })
        .catch(error => {
            new Error(error);
        });
}

// get group by id
function findGroupByDivisionAndId(url) {
    return fetch("/code/division/id" + url.search, {
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
