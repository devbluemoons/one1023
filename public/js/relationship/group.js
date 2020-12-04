import * as expands from "../modules/handsonTable.js";

document.getElementById("nav-group-tab").addEventListener("shown.bs.tab", setGroup);

function setGroup() {
    setGroupValue();
    setGroupEvent();
}

async function setGroupValue() {
    const url = new URL(document.URL);
    url.searchParams.append("division", "group");
    url.searchParams.append("valid", "01");

    const groupList = await findGroupList(url);
    setGroupTable(groupList);
}

function setGroupEvent() {
    document.querySelector("#groupForm #btnSave").addEventListener("click", registerGroup);
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
    const colHeaders = ["Name", "Condition", ""];
    // make columns
    const columns = [
        { data: "name", renderer: expands.identityRenderer, width: 150 },
        { data: "valid", renderer: expands.conditionRenderer },
        { data: this, renderer: expands.editRenderer },
    ];
    // initialize container
    const container = document.getElementById("groupTable");
    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, container.offsetTop, colHeaders, columns));
}

// register group
async function registerGroup() {
    // set form data
    const groupForm = document.getElementById("groupForm");
    const name = groupForm.querySelector("[name=name]").value;
    const param = {
        name: name,
        division: "group",
    };

    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "group");
    url.searchParams.append("name", document.querySelector("#groupForm [name=name]").value);

    const group = await findGroupByDivisionAndName(url);

    if (group) {
        alert("The same group exists!");
        return false;
    }

    // create group
    await createGroup(param);
    // set group table
    setGroupValue();
}
