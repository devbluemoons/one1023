import * as expands from "./modules/handsonTable.js";
import { Pagination } from "./modules/pagination.js";
import * as common from "./common.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
});

function setEvent() {
    // default Active Tab
    setFamily();

    // each tab event
    document.getElementById("nav-family-tab").addEventListener("shown.bs.tab", setFamily);
    document.getElementById("nav-group-tab").addEventListener("shown.bs.tab", setGroup);
    document.getElementById("nav-position-tab").addEventListener("shown.bs.tab", setPosition);
    document.getElementById("nav-service-tab").addEventListener("shown.bs.tab", setService);
}

//////////////////
//              //
//  Family Tab  //
//              //
//////////////////

function setFamily() {
    setFamilyEvent();
    setFamilyValue();
}

function setFamilyEvent() {
    document.querySelector("#familyTable").addEventListener("click", setFamilyInfo);
    document.querySelector("[name=name]").addEventListener("keyup", setSelectedMemeber);
}

async function setFamilyValue() {
    const memberList = await findMemberList();

    if (memberList) {
        setMemberTable(memberList.result);
        setPaging(memberList.paginator);
    }
}

async function setSelectedMemeber() {
    const member = await findMemberByName();

    if (member) {
        setSearchResult(member.result);
    }
}

const pagination = new Pagination(document.getElementById("pagination"));

// get member list
function findMemberList() {
    return fetch("/member", {
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

// get member one
function findMemberOne(id) {
    return fetch(`/member/${id}`, {
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

// set member list
function setMemberTable(data) {
    // make colHeaders
    const colHeaders = ["Image", "Name", "Age", "Address", "Family"];
    // make columns
    const columns = [
        { data: "imagePath", renderer: expands.imageRenderer, width: 50 },
        { data: "name", renderer: expands.identityRenderer },
        { data: "birthday", renderer: expands.ageRenderer },
        { data: "address1", className: "htLeft htMiddle" },
        { data: "familyGroup", renderer: expands.familyGroupRenderer },
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

async function setFamilyInfo(e) {
    if (!e.target.dataset.id) {
        return false;
    }
    const selectedId = e.target.dataset.id;
    const member = await findMemberById(selectedId);

    if (member) {
        setFamilyGroup(member);
    }
}

function findMemberById(id) {
    return fetch(`/member/${id}`, {
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

// update family field of member
function updateMember(data) {
    return fetch("/member", {
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

function findFamilyByMemberId(memberId) {
    return fetch(`/family/member/${memberId}`, {
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

function createFamily(data) {
    return fetch("/family", {
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

function updateFamily(data) {
    return fetch("/family", {
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

async function deleteFamily(e) {
    const memberId = e.target.dataset.id;

    if (!memberId) {
        return false;
    }

    if (confirm("Are you sure to delete this member from family group?")) {
        const family = await findFamilyByMemberId(memberId);

        if (family) {
            // set to delete memberid from family group
            const idx = family.memberId.findIndex(item => item === memberId);
            family.memberId.splice(idx, 1);

            // delete member id from family group
            const updatedFamily = await updateFamily(family);

            // delete family group when there is one member in family group
            if (updatedFamily && updatedFamily.memberId.length === 1) {
                deleteFamilyGroup(updatedFamily);
            }
            // delete family id from family field of member Schema
            const member = await findMemberById(memberId);
            member.family = null;

            await updateMember(member);
        }
        // re-render table
        setFamilyValue();

        // refresh family group
        const selectedId = document.getElementById("title").dataset.id;
        const member = await findMemberById(selectedId);
        setFamilyGroup(member);
    }
}

function deleteFamilyGroup(data) {
    return fetch("/family", {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
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

function findMemberByName() {
    const name = document.querySelector("[name=name]").value || null;

    return fetch(`/member?name=${name}`, {
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

function searchMember(e) {
    pagination.currentPage = e.target.dataset.page;
    findMemberList();
}

async function setFamilyGroup(data) {
    // set image
    if (data.imagePath) {
        document.getElementById("imagePath").src = "/".concat(data.imagePath);
    } else {
        document.getElementById("imagePath").src = "/uploads/blank_profile.png";
    }

    document.getElementById("title").innerHTML = titleFormatter(data);
    document.getElementById("title").dataset.id = data._id;

    // get family group member info
    const familyGroup = [];

    for (const memberId of data.familyGroup) {
        // except myself family info
        if (data._id === memberId) {
            continue;
        }

        const member = await findMemberById(memberId);
        familyGroup.push(member);
    }

    // sort by birthday
    familyGroup.sort(function (a, b) {
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
    const related = document.getElementById("related");
    related.innerHTML = "";

    familyGroup.forEach(member => {
        related.innerHTML += `
            <div class="col-3">
                <div class="card text-center">
                    <div class="frame">
                        <img src="/${member.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                        <button type="button" class="btn-close btn-close-white" aria-label="Close" data-id="${member._id}"></button>
                    </div>
                    <div class="card-body border-top">
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
        member.addEventListener("click", deleteFamily);
    });
}

function setSearchResult(data) {
    const defaultImage = "uploads/blank_profile.png";
    const searchResult = document.getElementById("searchResult");
    searchResult.innerHTML = "";

    data.forEach(item => {
        searchResult.innerHTML += `
            <div class="col-3 pt-3">
                <div class="card text-center">
                    <div class="frame">
                        <img src="/${item.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                    </div>
                    <div class="card-body border-top p-2">${item.name}</div>
                    <button class="btn btn-outline-secondary btn-sm" id="${item._id}" >Add</button>
                </div>
            </div>
        `;

        // set to same height and width
        // set vertical-align : middle
        common.setVerticalImage();

        // binding add event
        searchResult.querySelectorAll("button").forEach(item => item.addEventListener("click", addFamily));
    });
}

async function addFamily(e) {
    // standard member id
    const selectedId = document.getElementById("title").dataset.id;
    // to add member id
    const addId = e.target.id;

    if (!selectedId) {
        alert("Please, select a standard member");
        return false;
    }
    if (!addId) {
        alert("Please, select member to add");
        return false;
    }

    // get family info by standard member id
    const family = await findFamilyByMemberId(selectedId);

    // create new family group
    if (family) {
        // check duplication member id
        const hasMemberId = family.memberId.indexOf(addId);

        // return when duplication member id is exist
        if (hasMemberId > -1) {
            alert("There is a same member in this family");
            return false;
        }

        // check duplicaation member id in another family group
        const anotherGroup = await findFamilyByMemberId(addId);

        // return when duplication member id is already another group
        if (anotherGroup && anotherGroup.memberId.length > 0) {
            alert("There is already same member in another group");
            return false;
        }

        // add member id to family group
        family.memberId = [...family.memberId, addId];
        const result = await updateFamily(family);

        // set family after saving family group
        if (!result) {
            return false;
        }

        for (const memberId of result.memberId) {
            // get member one by member id
            const member = await findMemberOne(memberId);

            // update family info to standard member
            if (!member) {
                return false;
            }
            member.family = result._id;
            await updateMember(member);
        }
        // re-render data table
        setFamilyValue();

        // refresh family group
        const standardId = document.getElementById("title").dataset.id;
        const member = await findMemberById(standardId);
        setFamilyGroup(member);

        // update exist family group
    } else {
        // set data of member id
        const data = { memberId: [selectedId, addId] };

        // create family group
        const result = await createFamily(data);

        // set family after saving family group
        if (!result) {
            return false;
        }

        for (const memberId of result.memberId) {
            // get member one by member id
            const member = await findMemberOne(memberId);

            // update family info to standard member
            if (!member) {
                return false;
            }
            member.family = result._id;
            await updateMember(member);
        }
        // re-render data table
        setFamilyValue();

        // refresh family group
        const standardId = document.getElementById("title").dataset.id;
        const member = await findMemberById(standardId);
        setFamilyGroup(member);
    }
}

/* formatter */
function titleFormatter(value) {
    return `${value.name} (${ageFormatter(value.birthday)})`;
}

function ageFormatter(value) {
    const year = value.substring(0, 4);
    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    return age;
}

/////////////////
//             //
//  Group Tab  //
//             //
/////////////////

function setGroup() {
    setGroupValue();
    setGroupEvent();
}

async function setGroupValue() {
    const groupList = await findGroupList();
    setGroupTable(groupList.result);
}

function setGroupEvent() {
    document.querySelector("#groupForm #btnSave").addEventListener("click", registerGroup);
}

// get group list
function findGroupList() {
    return fetch("/code/group", {
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
    return fetch("/group", {
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
    const colHeaders = ["Name", "Valid"];
    // make columns
    const columns = [{ data: "name", renderer: expands.identityRenderer }, { data: "valid" }];
    // initialize container
    const container = document.getElementById("groupTable");
    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data, colHeaders, columns));
}

// register group
async function registerGroup() {
    // set form data
    const groupForm = document.getElementById("groupForm");
    const formData = new FormData(groupForm);
    formData.append("division", "group");

    // create group
    const groupList = await createGroup(formData);
    // set group table
    setGroupTable(groupList);
}

////////////////////
//                //
//  Position Tab  //
//                //
////////////////////

function setPosition() {
    console.clear();
    console.log(this);
}

///////////////////
//               //
//  Service Tab  //
//               //
///////////////////

function setService() {
    console.clear();
    console.log(this);
}
