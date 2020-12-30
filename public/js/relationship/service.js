"use strict";

import { Pagination } from "../modules/pagination.js";
import * as expands from "../modules/handsonTable.js";
import * as common from "../common.js";

document.getElementById("nav-service-tab").addEventListener("shown.bs.tab", setService);
const pagination = new Pagination(document.getElementById("servicePagination"));
const serviceModalEl = document.getElementById("serviceModal");
const serviceModal = new bootstrap.Modal(serviceModalEl);

function setService() {
    setServiceValue();
    setServiceEvent();
}

async function setServiceValue() {
    const url = new URL(document.URL);
    url.searchParams.append("division", "service");

    const serviceList = await findServiceList(url);

    setServiceTable(serviceList);
    setPaging(serviceList.paginator);
}

function setServiceEvent() {
    document.querySelector("#serviceForm #btnSave").addEventListener("click", registerService);
    document.querySelector("#serviceModal #btnEdit").addEventListener("click", editServiceInfo);
    document.querySelector("#serviceTable").addEventListener("click", showServiceInfo);

    document.querySelector("#serviceTable").addEventListener("click", setServiceInfo);
    document.querySelector("#serviceDetailForm [name=name]").addEventListener("keyup", setSelectedMemeber);
}

async function setServiceInfo(e) {
    if (e.target.name === "name") {
        document.getElementById("selectedService").innerText = e.target.textContent;
        document.getElementById("selectedServiceId").value = e.target.dataset.id;

        // refresh service detail
        const serviceList = await findMemberByService(e.target.dataset.id);
        setServiceDetail(serviceList);
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
    const searchResult = document.getElementById("serviceSearchResult");
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
        searchResult.querySelectorAll("button").forEach(item => item.addEventListener("click", addService));
    });
}

async function addService(e) {
    // standard service id
    const selectedServiceId = document.getElementById("selectedServiceId").value;
    // to add member id
    const memberId = e.target.id;

    if (!selectedServiceId) {
        alert("Please, select a standard service");
        return false;
    }
    if (!memberId) {
        alert("Please, select member to add");
        return false;
    }

    const member = await findMemberById(memberId);

    if (member) {
        member.service = selectedServiceId;
        await updateMember(member);

        // re-render table
        setServiceValue();

        // refresh service detail
        const serviceList = await findMemberByService(selectedServiceId);
        setServiceDetail(serviceList);
    }
}

// get member by member id
function findMemberById(id) {
    return axios
        .get(`/member/${id}/one`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get member by member service
function findMemberByService(service) {
    return axios
        .get(`/member?service=${service}`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get member by name
function findMemberByName() {
    const name = document.querySelector("#serviceDetailForm [name=name]").value || null;

    return axios
        .get(`/member?name=${name}`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get service list
function findServiceList(url) {
    return axios
        .get("/code/division" + url.search)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get service by id
function findServiceByDivisionAndId(url) {
    return axios
        .get("/code/division/id" + url.search)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get service by name
function findServiceByDivisionAndName(url) {
    return axios
        .get("/code/division/name" + url.search)
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

// create service
function createService(data) {
    return axios
        .post("/code", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

async function setServiceDetail(data) {
    const serviceList = data.result;
    // sort by birthday
    serviceList.sort(function (a, b) {
        if (a.birthday > b.birthday) {
            return 1;
        }
        if (a.birthday < b.birthday) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    // set simple member info in family service
    const defaultImage = "uploads/blank_profile.png";
    const related = document.getElementById("relatedService");
    related.innerHTML = "";

    serviceList.forEach(member => {
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

    // set delete member in family service
    document.querySelectorAll(".btn-close").forEach(member => {
        member.addEventListener("click", deleteServiceMember);
    });
}

// set service list
function setServiceTable(data) {
    // make colHeaders
    const colHeaders = ["Name", "Condition", "Count", ""];
    // make columns
    const columns = [{ data: "name", renderer: expands.identityRenderer }, { data: "valid", renderer: expands.conditionRenderer }, { data: "count" }, { data: this, renderer: expands.editRenderer }];
    // initialize container
    const container = document.getElementById("serviceTable");
    const serviceInfo = container.getBoundingClientRect();
    const containerTop = serviceInfo.top;

    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, containerTop, colHeaders, columns));
}

// set paging
function setPaging(paginator) {
    document.getElementById("serviceCount").textContent = paginator.totalCount;
    pagination.setPagination(paginator).setEvent(searchService);
}

// show service info
async function showServiceInfo(e) {
    if (!e.target.classList.contains("btn")) {
        return false;
    }
    if (!e.target.dataset.id) {
        return false;
    }

    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "service");
    url.searchParams.append("_id", e.target.dataset.id);

    const service = await findServiceByDivisionAndId(url);

    if (service) {
        serviceModalEl.querySelector("[name=_id]").value = service._id;
        serviceModalEl.querySelector("[name=name]").value = service.name;
        serviceModalEl.querySelector("[name=valid]").value = service.valid;

        serviceModal.show();
    }
}

// edit service info
async function editServiceInfo() {
    const serviceModalForm = document.getElementById("serviceModalForm");

    const _id = serviceModalForm.querySelector("[name=_id]").value;
    const name = serviceModalForm.querySelector("[name=name]").value;
    const valid = serviceModalForm.querySelector("[name=valid]").value;

    const data = {
        _id: _id,
        name: name,
        valid: valid,
    };

    const service = await updateService(data);

    if (service) {
        setServiceValue();
        serviceModal.hide();
    }
}

// update service info
function updateService(data) {
    return axios
        .put("/code", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

async function deleteServiceMember(e) {
    const memberId = e.target.dataset.id;

    if (!memberId) {
        return false;
    }

    if (!confirm("Are you sure to delete this member from service?")) {
        return false;
    }

    const member = await findMemberById(memberId);

    if (member) {
        delete member.service;
        await updateMember(member);

        // re-render table
        setServiceValue();

        // refresh service detail
        const serviceId = document.getElementById("selectedServiceId").value;
        const serviceList = await findMemberByService(serviceId);
        setServiceDetail(serviceList);
    }
}

// search service per page
function searchService(e) {
    pagination.currentPage = e.target.dataset.page;
    setServiceValue();
}

// register service
async function registerService() {
    // make search parameter
    const url = new URL(document.URL);
    url.searchParams.append("division", "service");
    url.searchParams.append("name", document.querySelector("#serviceForm [name=name]").value);

    const service = await findServiceByDivisionAndName(url);

    if (service) {
        alert("The same service exists!");
        return false;
    }

    // set form data
    const serviceForm = document.getElementById("serviceForm");
    const name = serviceForm.querySelector("[name=name]").value;

    const param = {
        name: name,
        division: "service",
    };

    // create service
    await createService(param);
    // set service table
    setServiceValue();
}

function ageFormatter(value) {
    const year = value.substring(0, 4);
    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    return age;
}
