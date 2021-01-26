"use strict";

document.addEventListener("DOMContentLoaded", function () {
    setValue();
    setEvent();
});

const calendarModalEl = document.getElementById("calendarModal");
const calendarModal = new bootstrap.Modal(calendarModalEl);

function setValue() {
    // setDday();
    setAttendanceChart();
    setGenerationChart();
    setGenerationRatioChart();
    setMenWomenRatioChart();
    setCalendar();
}

function setEvent() {
    document.getElementById("btnSave").addEventListener("click", setRegisterSchedule);
    document.getElementById("btnEdit").addEventListener("click", setUpdateSchedule);
    document.getElementById("btnDelete").addEventListener("click", setDeleteSchedule);
}

function setDday() {
    const oneDay = 1000 * 3600 * 24;
    const openDt = new Date("10/23/2015");
    const today = new Date();
    const period = today.getTime() - openDt.getTime();
    const days = Math.ceil(period / oneDay);

    document.getElementById("foundingDays").textContent = `D+ ${days}`;
}

function setAttendanceChart() {
    const ctx = document.getElementById("attendanceChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: [
                "2020-10-04",
                "2020-10-11",
                "2020-10-18",
                "2020-10-25",
                "2020-11-01",
                "2020-11-08",
                "2020-11-15",
                "2020-11-22",
                "2020-11-29",
                "2020-12-06",
                "2020-12-13",
                "2020-12-20",
                "2020-12-27",
            ],
            datasets: [
                {
                    label: "Worship (part1)",
                    backgroundColor: "rgba(204, 204, 204, 0.2)",
                    borderColor: "rgba(204, 204, 204, 0.7)",
                    pointBorderColor: "#ffffff",
                    data: [92, 111, 80, 32, 41, 58, 63, 74, 56, 61, 34, 46, 25],
                },
                {
                    label: "Worship (part2)",
                    backgroundColor: "rgba(0, 85, 128, 0.2)",
                    borderColor: "rgba(0, 85, 128, 0.3)",
                    pointBorderColor: "#ffffff",
                    data: [77, 68, 89, 17, 25, 53, 41, 32, 29, 55, 12, 25, 10],
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: "Last 3 months",
            },
            plugins: {
                datalabels: {
                    display: false,
                },
            },
        },
    });
}

async function setGenerationChart() {
    const result = await getValuesForGeneration();
    const ctx = document.getElementById("generationChart").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: result.labels,
            datasets: [
                {
                    label: "Men",
                    backgroundColor: "rgba(0, 89, 179, 0.5)",
                    borderColor: "rgba(0, 89, 179, 0.5)",
                    borderWidth: 2,
                    pointBorderColor: "#ffffff",
                    data: result.menGeneration,
                },
                {
                    label: "Women",
                    backgroundColor: "rgba(179, 0, 89, 0.5)",
                    borderColor: "rgba(179, 0, 89, 0.5)",
                    borderWidth: 2,
                    pointBorderColor: "#ffffff",
                    data: result.womenGeneration,
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: "All Generation",
            },
            plugins: {
                datalabels: {
                    display: true,
                },
                labels: {
                    render: "value",
                    display: false,
                },
            },
        },
    });
}

async function setGenerationRatioChart() {
    const result = await getValuesForGeneration();
    const ctx = document.getElementById("generationRatioChart").getContext("2d");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: result.labels,
            datasets: [
                {
                    label: "Men",
                    backgroundColor: result.backgroundColor,
                    data: result.ratioGeneration[0],
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: "Ratio : each generation",
            },
            legend: {
                display: true,
                position: "left",
            },
            elements: {
                arc: {
                    borderWidth: 1,
                },
            },
            tooltips: {
                enabled: true,
            },
            plugins: {
                labels: {
                    render: function (data) {
                        return `${data.value}%`;
                    },
                    fontColor: "#ffffff",
                },
            },
        },
    });
}

async function setMenWomenRatioChart() {
    const memberList = await findAllMemberList();

    // caculation of all generation
    const men = memberList.filter(i => i.gender === "M");
    const women = memberList.filter(i => i.gender === "W");
    const totalCount = memberList.length;

    const menRatio = Math.round((men.length * 100) / totalCount);
    const womenRatio = Math.round((women.length * 100) / totalCount);

    const ctx = document.getElementById("menWomenRatioChart").getContext("2d");

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["men", "women"],
            datasets: [
                {
                    backgroundColor: ["rgba(0, 89, 179, 0.5)", "rgba(179, 0, 89, 0.5)"],
                    borderColor: ["rgba(0, 89, 179, 0.5)", "rgba(179, 0, 89, 0.5)"],
                    borderWidth: 2,
                    pointBorderColor: "#ffffff",
                    data: [menRatio, womenRatio],
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: "Ratio : Men / Women",
            },
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false,
            },
            plugins: {
                labels: {
                    render: function (data) {
                        return `${data.label}\n\n${data.value}%`;
                    },
                    fontColor: "#ffffff",
                },
            },
        },
    });
}

async function getValuesForGeneration() {
    const memberList = await findAllMemberList();

    const labels = ["very young", "teenager", "twenties", "thirties", "forties", "fifties", "sixties", "seventies", "eighties", "nineties", "centenary"];
    const backgroundColor = [
        "rgba(107 ,184 ,218, 1)",
        "rgba(105, 150, 218, 1)",
        "rgba(104, 116, 217, 1)",
        "rgba(128, 107,	217, 1)",
        "rgba(162, 107,	217, 1)",
        "rgba(198, 107,	218, 1)",
        "rgba(218, 107,	204, 1)",
        "rgba(218, 106,	170, 1)",
        "rgba(218, 105,	137, 1)",
        "rgba(236, 139,	123, 1)",
    ];

    // caculation of all generation
    const allBirthYears = memberList.map(i => Number(i.birthday.substr(0, 4)));
    const menBirthYears = memberList.filter(i => i.gender === "M").map(i => Number(i.birthday.substr(0, 4)));
    const womenBirthYears = memberList.filter(i => i.gender === "W").map(i => Number(i.birthday.substr(0, 4)));

    const totalCount = memberList.length;
    const thisYear = new Date().getFullYear();

    const allGeneration = [];
    const ratioGeneration = [];
    const menGeneration = [];
    const womenGeneration = [];

    for (let i = 0; i <= 10; i++) {
        const startYear = thisYear - (i + 1) * 10 + 1;
        const endYear = thisYear - i * 10 + 1;

        allGeneration.push(allBirthYears.filter(i => startYear < i && endYear >= i).length);
        menGeneration.push(menBirthYears.filter(i => startYear < i && endYear >= i).length);
        womenGeneration.push(womenBirthYears.filter(i => startYear < i && endYear >= i).length);
    }

    ratioGeneration.push(allGeneration.map(i => Math.round((i * 100) / totalCount)));

    return {
        allGeneration,
        ratioGeneration,
        menGeneration,
        womenGeneration,
        backgroundColor,
        labels,
    };
}

// get all member list
function findAllMemberList() {
    return axios
        .get("/member/all")
        .then(response => response.data)
        .catch(e => console.error(e));
}

// create schedule
function registerSchedule(param) {
    return axios
        .post("/calendar", param)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// get calendarScheme list
function findSchedule(param) {
    return axios
        .get(`/calendar?${param}`)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// update schedule
function updateSchedule(param) {
    return axios
        .put("/calendar", param)
        .then(response => response.data)
        .catch(e => console.error(e));
}

// delete schedule
function deleteSchedule(param) {
    return axios
        .delete("/calendar", { data: param })
        .then(response => response.data)
        .catch(e => console.error(e));
}

function setCalendar() {
    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: "local",
        initialView: "dayGridMonth",
        themeSystem: "bootstrap",
        selectable: true,
        editable: true,
        droppable: true,
        locale: "us",
        dateClick: info => {
            document.querySelector("#calendarModalForm").reset();
            document.querySelector("#calendarModalForm [name=start]").value = info.dateStr;

            document.getElementById("btnSave").classList.remove("hide");
            document.getElementById("btnEdit").classList.add("hide");
            document.getElementById("btnDelete").classList.add("hide");

            calendarModal.show();
        },
        eventChange: info => {
            const change = info.event;

            const param = {
                _id: change._def.extendedProps._id,
                start: change.startStr,
                end: change.endStr,
            };

            updateSchedule(param);
        },
        eventClick: info => {
            document.getElementById("btnSave").classList.add("hide");
            document.getElementById("btnEdit").classList.remove("hide");
            document.getElementById("btnDelete").classList.remove("hide");

            const change = info.event;

            // calendar default field
            const title = change.title;
            const start = change.startStr;
            const end = change.endStr;

            // calendar document field in mongoDB
            const _id = change._def.extendedProps._id;
            const comment = change._def.extendedProps.comment || "";

            // set field value to calendar modal form
            calendarModalEl.querySelector("[name=title]").value = title;
            calendarModalEl.querySelector("[name=start]").value = start;
            calendarModalEl.querySelector("[name=end]").value = end;

            calendarModalEl.querySelector("[name=_id]").value = _id;
            calendarModalEl.querySelector("[name=comment]").value = comment;

            calendarModal.show();
        },
        datesSet: async info => {
            //set search period
            const startDt = info.startStr.substr(0, 10);
            const endDt = info.endStr.substr(0, 10);
            const param = `startDt=${startDt}&endDt=${endDt}`;

            // remove all events
            const events = calendar.getEvents();

            events.forEach(info => {
                const event = calendar.getEventById(info.id);
                event.remove();
            });

            // set events
            const schedule = await findSchedule(param);

            schedule.forEach(info => {
                info.id = info._id;
                calendar.addEvent(info);
            });
        },
    });

    calendar.render();
}

async function setRegisterSchedule() {
    const formData = document.getElementById("calendarModalForm");

    const param = {
        title: formData.title.value,
        start: formData.start.value,
        comment: formData.comment.value,
    };

    if (!param.title) {
        alert("Please, fill title field!");
        return false;
    }

    await registerSchedule(param);

    // close modal
    calendarModal.hide();

    // refresh calendar
    setCalendar();
}

async function setUpdateSchedule() {
    // set field value to calendar modal form
    const title = calendarModalEl.querySelector("[name=title]").value;
    const start = calendarModalEl.querySelector("[name=start]").value;
    const end = calendarModalEl.querySelector("[name=end]").value;

    const _id = calendarModalEl.querySelector("[name=_id]").value;
    const comment = calendarModalEl.querySelector("[name=comment]").value;

    const param = {
        title: title,
        start: start,
        end: end,
        _id: _id,
        comment: comment,
    };

    await updateSchedule(param);

    // close modal
    calendarModal.hide();

    // refresh calendar
    setCalendar();
}

async function setDeleteSchedule() {
    const _id = calendarModalEl.querySelector("[name=_id]").value;
    const param = { _id: _id };

    await deleteSchedule(param);

    // close modal
    calendarModal.hide();

    // refresh calendar
    setCalendar();
}
