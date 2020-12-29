"use strict";

import * as expands from "../modules/handsonTable.js";
import { Pagination } from "../modules/pagination.js";
import { SearchParam } from "../modules/searchParam.js";
import * as common from "../common.js";

document.getElementById("nav-family-tab").addEventListener("shown.bs.tab", setFamily);
const pagination = new Pagination(document.getElementById("familyPagination"));

function setFamily() {
    setFamilyEvent();
    setFamilyValue();
}

function setFamilyEvent() {
    document.querySelector("#familyTable").addEventListener("click", setFamilyInfo);
    document.querySelector("#familyForm [name=name]").addEventListener("keyup", setSelectedMemeber);
}

async function setFamilyValue() {
    const url = makeSearchParameter();
    const memberList = await findMemberList(url);

    if (memberList) {
        setMemberTable(memberList);
        setPaging(memberList.paginator);
    }
}

async function setSelectedMemeber() {
    const member = await findMemberByName();

    if (member) {
        setSearchResult(member.result);
    }
}

// get member list
function findMemberList(url) {
    return axios
        .get("/member/" + url.params.search)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get searh param
function makeSearchParameter() {
    return new SearchParam(pagination.currentPage, null);
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
        { data: "family", renderer: expands.familyGroupRenderer },
    ];
    // initialize container
    const container = document.getElementById("familyTable");
    const positionInfo = container.getBoundingClientRect();
    const containerTop = positionInfo.top;

    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, containerTop, colHeaders, columns));
}

// set paging
function setPaging(paginator) {
    document.getElementById("familyCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchMember);
}

async function setFamilyInfo(e) {
    if (!e.target.dataset.id) {
        return false;
    }
    const selectedMemberId = e.target.dataset.id;
    const member = await findMemberById(selectedMemberId);

    if (member) {
        setFamilyGroup(member);
    }
}

function findMemberById(id) {
    return axios
        .get(`/member/${id}/one`)
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

function findFamilyByMemberId(memberId) {
    return axios
        .get(`/family/member/${memberId}`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function createFamily(data) {
    return axios
        .post("/family", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function updateFamily(data) {
    return axios
        .put("/family", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

async function deleteFamily(e) {
    const memberId = e.target.dataset.id;

    if (!memberId) {
        return false;
    }

    if (confirm("Are you sure to delete this member from family group?")) {
        const family = await findFamilyByMemberId(memberId);

        if (family) {
            // set to delete member id from family group
            family.memberId = family.memberId.filter(member => member._id !== memberId);

            // delete member id from family group
            await updateFamily(family);
            // delete family group when there is one member in family group
            if (family.memberId.length === 1) {
                deleteFamilyGroup(family);
            }
            // delete family id from family field of member Schema
            const member = await findMemberById(memberId);
            delete member.family;

            await updateMember(member);
        }
        // re-render table
        setFamilyValue();

        // refresh family group
        const selectedMemberId = document.getElementById("title").dataset.id;
        const member = await findMemberById(selectedMemberId);
        setFamilyGroup(member);
    }
}

function deleteFamilyGroup(data) {
    return axios
        .delete("/family", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function findMemberByName() {
    const name = document.querySelector("#familyForm [name=name]").value || null;

    return axios
        .get(`/member?name=${name}`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function searchMember(e) {
    pagination.currentPage = e.target.dataset.page;
    setFamilyValue();
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

    const related = document.getElementById("related");
    related.innerHTML = "";

    if (data.family) {
        // except myself family info
        const familyGroup = data.family.memberId.filter(info => info._id !== data._id);

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

        familyGroup.forEach(member => {
            related.innerHTML += `
            <div class="col-3">
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

        // set delete member in family group
        document.querySelectorAll(".btn-close").forEach(member => {
            member.addEventListener("click", deleteFamily);
        });
    }

    // set to same height and width
    // set vertical-align : middle
    common.setVerticalImage();
}

function setSearchResult(data) {
    const defaultImage = "uploads/blank_profile.png";
    const searchResult = document.getElementById("familySearchResult");
    searchResult.innerHTML = "";

    data.forEach(member => {
        searchResult.innerHTML += `
            <div class="col-3 pt-3">
                <div class="card text-center">
                    <div class="frame">
                        <img src="/${member.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                    </div>
                    <div class="border-top pTB-10 p-2">${member.name}</div>
                    <button class="btn btn-outline-secondary btn-sm" id="${member._id}" >Add</button>
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
    const selectedMemberId = document.getElementById("title").dataset.id;
    // to add member id
    const toAddMemberId = e.target.id;

    if (!selectedMemberId) {
        alert("Please, select a standard member");
        return false;
    }
    if (!toAddMemberId) {
        alert("Please, select member to add");
        return false;
    }
    if (selectedMemberId === toAddMemberId) {
        alert("Do not add myself");
        return false;
    }

    // get family info by standard member id
    const family = await findFamilyByMemberId(selectedMemberId);

    if (family) {
        // check duplication member id
        const sameMember = family.memberId.filter(member => member._id === toAddMemberId);

        if (sameMember.length > 0) {
            alert("There is a same member in this family");
            return false;
        }

        // check duplicaation member id in another family group
        const anotherGroup = await findFamilyByMemberId(toAddMemberId);

        // return when duplication member id is already another group
        if (anotherGroup && anotherGroup.memberId.length > 0) {
            alert("There is already same member in another group");
            return false;
        }

        // add member id to family group
        family.memberId = [...family.memberId, toAddMemberId];
        const result = await updateFamily(family);

        // set family after saving family group
        if (!result) {
            return false;
        }

        for (const memberId of result.memberId) {
            // get member one by member id
            const member = await findMemberById(memberId);

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
    } else {
        // set data of member id
        const data = { memberId: [selectedMemberId, toAddMemberId] };

        // create family group
        const result = await createFamily(data);

        console.log(result);
        return;

        // set family after saving family group
        if (!result) {
            return false;
        }

        for (const memberId of result.memberId) {
            // get member one by member id
            const member = await findMemberById(memberId);

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
