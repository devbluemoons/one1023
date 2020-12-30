"use strict";

window.addEventListener("DOMContentLoaded", e => {
    setValue();
    setEvent();
});

const worshipAttendanceModalEl = document.getElementById("worshipAttendanceModal");
const worshipAttendanceModal = new bootstrap.Modal(worshipAttendanceModalEl);

function setValue() {
    //
}

function registerWorshipAttendance(data) {
    return axios
        .post("/system/worship/attendance", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function findOneWorshipAttendance(data) {
    return axios
        .get("/system/worship/attendance", data)
        .then(response => response.data)
        .catch(e => console.error(e));
}

function setEvent() {
    document.getElementById("btnRegister").addEventListener("click", setRegisterWorshipAttendance);
    document.getElementById("btnSave").addEventListener("click", setSaveWorshiopAttendance);
    document.querySelector("input[name=date]").addEventListener("change", validDateValue);
}

function setRegisterWorshipAttendance() {
    document.getElementById("worshipAttendanceModalForm").reset();
    worshipAttendanceModal.show();
}

async function setSaveWorshiopAttendance() {
    const formData = document.getElementById("worshipAttendanceModalForm");
    const valid = validWorshipAttendanceFormData(formData);

    if (valid) {
        const param = [
            {
                name: "worship",
                type: "part1",
                count: formData.worship1.value,
                date: formData.date.value,
            },
            {
                name: "worship",
                type: "part2",
                count: formData.worship2.value,
                date: formData.date.value,
            },
        ];

        const existedData = await findOneWorshipAttendance({ date: formData.date.value });

        if (existedData) {
            alert("There is already existed data");
            return false;
        }

        param.map(async data => await registerWorshipAttendance(data));
        worshipAttendanceModal.hide();
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

function validDateValue(e) {
    const currentDate = e.target.value;
    const dayOfTheWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date(currentDate).getDay()];
    if (dayOfTheWeek !== "SUN") {
        alert("Please, re-select, This value is not [ Sunday ]");
        e.target.value = null;
    }
}
