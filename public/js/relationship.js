import * as expands from "./modules/handsonTable.js";
import { Pagination } from "./modules/pagination.js";

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

    const defaultImage = "uploads/blank_profile.png";
    const related = document.getElementById("related");
    related.innerHTML = "";

    for (const memberId of family.memberId) {
        // except myself family info
        if (data._id === memberId) {
            continue;
        }

        const member = await findMemberById(memberId);

        related.innerHTML += `
            <div class="col-3 pt-3">
                <div class="card text-center">
                    <div>
                        <img src="/${member.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><b>${member.name}</b></li>
                    </ul>
                </div>
            </div>
        `;
    }
}

function setSearchResult(data) {
    const defaultImage = "uploads/blank_profile.png";
    const searchResult = document.getElementById("searchResult");
    searchResult.innerHTML = "";

    data.forEach(item => {
        searchResult.innerHTML += `
            <div class="col-3 pt-3">
                <div class="card text-center">
                    <div>
                        <img src="/${item.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><b>${item.name}</b></li>
                    </ul>
                    <button class="btn btn-outline-secondary btn-sm" id="${item._id}" >Add</button>
                </div>
            </div>
        `;
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

/* formatter */
function titleFormatter(value) {
    return `
        ${value.name} (${ageFormatter(value.birthday)})
    `;
}

function ageFormatter(value) {
    const year = value.substring(0, 4);
    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    return age;
}
