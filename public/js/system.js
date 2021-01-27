"use strict";

import * as expands from "./modules/handsonTable.js";
import * as common from "./common.js";

window.addEventListener("DOMContentLoaded", e => {
    setValue();
    setEvent();
});

const worshipAttendanceModalEl = document.getElementById("worshipAttendanceModal");
const worshipAttendanceModal = new bootstrap.Modal(worshipAttendanceModalEl);

const administratorModalEl = document.getElementById("administratorModal");
const administratorModal = new bootstrap.Modal(administratorModalEl);

function setValue() {
    setAdminValue();
}

function setEvent() {
    document.getElementById("btnWorship").addEventListener("click", setRegisterWorshipAttendance);
    document.getElementById("btnSaveWorship").addEventListener("click", setSaveWorshiopAttendance);
    document.getElementById("btnAdmin").addEventListener("click", setRegisterAdministrator);
    document.querySelector("#memberForm [name=name]").addEventListener("keyup", setSelectedMemeber);
    document.getElementById("btnSaveAdmin").addEventListener("click", setSaveAdministrator);
    document.querySelector("input[name=date]").addEventListener("change", validDateValue);
}

function setRegisterWorshipAttendance() {
    document.getElementById("worshipAttendanceModalForm").reset();
    worshipAttendanceModal.show();
}

function setRegisterAdministrator() {
    document.getElementById("memberForm").reset();
    document.getElementById("administratorModalForm").reset();
    document.getElementById("memberSearchResult").innerHTML = "";
    administratorModal.show();
}

async function setSaveWorshiopAttendance() {
    const formData = document.getElementById("worshipAttendanceModalForm");
    const valid = validWorshipAttendanceFormData(formData);

    if (valid) {
        const param = {
            name: "worship",
            count: [formData.worship1.value, formData.worship2.value],
            date: formData.date.value,
        };

        const existedData = await findOneWorshipAttendance({ date: formData.date.value });

        if (existedData) {
            alert("There is already existed data");
            return false;
        }

        await registerWorshipAttendance(param);
        worshipAttendanceModal.hide();
    }
}

async function setSelectedMemeber() {
    const name = document.querySelector("#memberForm [name=name]").value;

    if (name.length === 0) {
        document.getElementById("memberSearchResult").innerHTML = "";
        return false;
    }

    const member = await findMemberByName(name);

    if (member) {
        setSearchResult(member.result);
    }
}

function setSearchResult(data) {
    const defaultImage = "uploads/blank_profile.png";
    const searchResult = document.getElementById("memberSearchResult");
    searchResult.innerHTML = "";

    data.forEach(member => {
        searchResult.innerHTML += `
            <div class="col-6 pt-3">
                <div class="card text-center">
                    <div class="frame">
                        <img src="/${member.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                    </div>
                    <div class="border-top pTB-10 p-2">${member.name}</div>
                    <button class="btn btn-outline-secondary btn-sm" id="${member._id}" >Add</button>
                </div>
            </div>
        `;

        // set the same height and width
        // set vertical-align : middle
        common.setVerticalImage();

        // binding add event
        searchResult.querySelectorAll("button").forEach(item => item.addEventListener("click", addMember));
    });
}

async function setSaveAdministrator() {
    const formData = document.getElementById("administratorModalForm");
    const valid = validAdministratorFormData(formData);

    if (valid) {
        const param = {
            name: formData.name.value,
            contact: formData.contact.value,
            level: formData.level.value,
        };

        await registerAdministrator(param);
        await setAdminValue();
        administratorModal.hide();
    }
}

async function setAdminValue() {
    const adminList = await findAdminList();

    if (adminList) {
        setAdminTable(adminList);
    }
}

// set admin list
function setAdminTable(data) {
    // make colHeaders
    const colHeaders = ["Image", "Name", "Age", "Group", "Position", "Level", ""];
    // make columns
    const columns = [
        { data: "imagePath", renderer: expands.imageRenderer, width: 50 },
        { data: "name", renderer: expands.identityRenderer },
        { data: "birthday" },
        { data: "address1", className: "htLeft htMiddle" },
        { data: "" },
        { data: "" },
        { data: this, renderer: expands.editRenderer },
    ];
    // initialize container
    const container = document.getElementById("adminTable");
    const positionInfo = container.getBoundingClientRect();
    const containerTop = positionInfo.top;

    container.innerHTML = "";

    new Handsontable(container, expands.defaultSettings(data.result, data.paginator, containerTop, colHeaders, columns));
}

function registerWorshipAttendance(data) {
    return axios
        .post("/system/worship/attendance", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function registerAdministrator(data) {
    return axios
        .post("/system/administrator", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function findOneWorshipAttendance(data) {
    return axios
        .get("/system/worship/attendance", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function findAdminList() {
    return axios
        .get("/system/admin")
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get member by member id
function findMemberDetailById(id) {
    return axios
        .get(`/member/${id}/one`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function findMemberByName(name) {
    return axios
        .get(`/member?name=${name}`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

async function addMember(e) {
    const member = await findMemberDetailById(e.target.id);

    if (member) {
        const adminForm = document.getElementById("administratorModalForm");

        const name = member.name;
        const contact = member.contact1 + member.contact2 + member.contact3;

        adminForm.name.value = name;
        adminForm.contact.value = contact;
    }
}

function validWorshipAttendanceFormData(formData) {
    if (!formData.worship1.value) {
        alert("worship1 is required field");
        return false;
    }
    if (!formData.worship2.value) {
        alert("worship2 is required field");
        return false;
    }
    if (!formData.date.value) {
        alert("date is required field");
        return false;
    }
    return true;
}

function validAdministratorFormData(formData) {
    if (!formData.name.value) {
        alert("name is required field");
        return false;
    }
    if (!formData.contact.value) {
        alert("contact is required field");
        return false;
    }
    if (!formData.level.value) {
        alert("level is required field");
        return false;
    }
    return true;
}

function validDateValue(e) {
    const currentDate = e.target.value;
    const dayOfTheWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date(currentDate).getDay()];

    if (dayOfTheWeek !== "SUN") {
        alert("Please, re-select, This value is not [ Sunday ]");
        e.target.value = null;
    }
}
