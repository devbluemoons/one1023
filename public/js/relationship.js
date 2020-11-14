import * as expands from "./modules/handsonTable.js";
import { Pagination } from "./modules/pagination.js";

window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    findMemberList();
    test();
});

function setEvent() {
    document.addEventListener("click", setMemberInfo);
    document.querySelector("[name=name]").addEventListener("keyup", findMemberByName);
}

const pagination = new Pagination(document.getElementById("pagination"));

// get member list
function findMemberList() {
    // create member information
    fetch("/member", {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                setMemberTable(data.result);
                setPaging(data.paginator);
            }
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

function findMemberByName() {
    const name = document.querySelector("[name=name]").value || null;

    fetch(`/member?name=${name}`, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                setSearchResult(data.result);
            }
        })
        .catch(error => {
            new Error(error);
        });
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
        searchResult.addEventListener("click", addFamily);
    });
}

function addFamily(e) {
    const selectedId = document.getElementById("title").dataset.id;
    const addId = e.target.id;

    if (!selectedId || !addId) {
        return false;
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
