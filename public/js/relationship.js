import * as expands from "./modules/handsonTable.js";
import { Pagination } from "./modules/pagination.js";
import * as common from "./common.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    setValue();
});

function setEvent() {
    document.querySelector("#dataTable").addEventListener("click", setFamilyInfo);
    document.querySelector("[name=name]").addEventListener("keyup", setSelectedMemeber);
}

async function setValue() {
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
    // create member information
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
    // find one member information
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
    const container = document.getElementById("dataTable");
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
        setFamilyValue(member);
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

function findFamilyById(_id) {
    return fetch(`/family/${_id}`, {
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

async function setFamilyValue(data) {
    if (data.imagePath) {
        document.getElementById("imagePath").src = "/".concat(data.imagePath);
    } else {
        document.getElementById("imagePath").src = "/uploads/blank_profile.png";
    }
    document.getElementById("title").innerHTML = titleFormatter(data);
    document.getElementById("title").dataset.id = data._id;

    if (!data.family) {
        return false;
    }

    const family = await findFamilyById(data.family);

    if (!family && !family.memberId) {
        return false;
    }

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
            <div class="col-3 pt-3">
                <div class="card text-center">
                    <div class="frame">
                        <img src="/${member.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                        <button type="button" class="btn-close btn-close-white" aria-label="Close" data-id="${member._id}"></button>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><b>${member.name} (${ageFormatter(member.birthday)})</b></li>
                    </ul>
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
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><b>${item.name}</b></li>
                    </ul>
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

    if (!selectedId || !addId) {
        alert("Please, select a standard member");
        return false;
    }

    // get family info by standard member id
    const family = await findFamilyByMemberId(selectedId);

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
        if (anotherGroup.memberId.length > 0) {
            alert("There is already same member in another group");
            return false;
        }

        // add member id to family group
        family.memberId = [...family.memberId, addId];
        const result = await updateFamily(family);

        // set family after saving family group
        if (!result && !result._id && !result.memberId) {
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
            const updateInfo = await updateMember(member);

            // re-render data table
            if (updateInfo) {
                setValue();
            }
        }
    } else {
        // set data of member id
        const data = { memberId: [selectedId, addId] };

        // create family group
        const result = await createFamily(data);

        // set family after saving family group
        if (!result && !result._id && !result.memberId) {
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
            const updateInfo = await updateMember(member);

            // re-render data table
            if (updateInfo) {
                setValue();
            }
        }
    }
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
            await updateFamily(family);

            // delete family id from family field of member Schema
            const member = await findMemberById(memberId);
            member.family = null;

            await updateMember(member);

            // re-render table, family group
            setValue();
            setFamilyValue(member);
        }
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
