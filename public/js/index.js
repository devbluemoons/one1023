document.addEventListener("DOMContentLoaded", async function () {
    await setValue();
    await setEvent();
});

const calendarModalEl = document.getElementById("calendarModal");
const calendarModal = new bootstrap.Modal(calendarModalEl);

function setValue() {
    setDday();
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

function registerSchedule(param) {
    // create schedule
    return fetch("/calendar", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(param),
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
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

function updateSchedule(param) {
    // update schedule
    return fetch("/calendar", {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(param),
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
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

function deleteSchedule(param) {
    // update schedule
    return fetch("/calendar", {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        body: JSON.stringify(param),
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}

// get calendarScheme list
function findSchedule(param) {
    return fetch(`/calendar?${param}`, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.error(e);
        });
}
