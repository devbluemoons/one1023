import * as expands from "./modules/handsonTable.js";
import { Pagination } from "./modules/pagination.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    setValue();
});

function setEvent() {
    document.querySelector("#dataTable").addEventListener("click", setMemberInfo);
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

// set member list
function setMemberTable(data) {
    // make colHeaders
    const colHeaders = ["Image", "Name", "Address", "Age", "Family"];
    // make columns
    const columns = [
        { data: "imagePath", renderer: expands.imageRenderer, width: 50 },
        { data: "name", renderer: expands.identityRenderer },
        { data: "address1", className: "htLeft htMiddle" },
        { data: "birthday", renderer: expands.ageRenderer },
        { data: "family", renderer: expands.familyRenderer },
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

async function setMemberInfo(e) {
    if (!e.target.dataset.id) {
        return false;
    }
    const selectedId = e.target.dataset.id;
    const memberInfo = await findMemberById(selectedId);
    setMemberValue(memberInfo);
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

function findFamilyByMemberId(memberId) {
    return fetch(`/family/${memberId}`, {
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        method: "PUT",
        body: data,
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

function setMemberValue(data) {
    if (data.imagePath) {
        document.getElementById("imagePath").src = "/".concat(data.imagePath);
    } else {
        document.getElementById("imagePath").src = "/uploads/blank_profile.png";
    }
    document.getElementById("title").innerHTML = titleFormater(data);
    document.getElementById("title").dataset.id = data._id;
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
    const selectedId = document.getElementById("title").dataset.id;
    const addId = e.target.id;

    if (!selectedId || !addId) {
        alert("Please, select a standard member");
        return false;
    }

    const family = await findFamilyByMemberId(selectedId);

    console.log(family);

    if (family) {
        // updateFamily(addId);
    } else {
        // const data = { memberId: addId };
        // createFamily(data);
    }
}

/* formatter */
function titleFormater(value) {
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
