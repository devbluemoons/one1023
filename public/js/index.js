document.addEventListener("DOMContentLoaded", function () {
    setValue();
    setEvent();
});

function setValue() {
    setCalendar();
}

function setEvent() {
    document.getElementById("btnSave").addEventListener("click", registerSchedule);
}

async function setCalendar() {
    // set search param
    const thisYear = new Date().getFullYear();
    let thisMonth = new Date().getMonth() + 1;
    thisMonth = thisMonth < 10 ? `0${thisMonth}` : thisMonth;

    const param = `${thisYear}-${thisMonth}`;

    const schedule = await findSchedule(param);

    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        events: schedule,
        initialView: "dayGridMonth",
        themeSystem: "bootstrap",
        selectable: true,
        editable: true,
        droppable: true,
        locale: "us",
        dateClick: info => {
            document.querySelector("#calendarModalForm [name=start]").value = info.dateStr;

            const calendarModalEl = document.getElementById("calendarModal");
            const calendarModal = new bootstrap.Modal(calendarModalEl);
            calendarModal.show();
        },
        eventChange: info => {
            const change = info.event;

            const start = change.start ? new Date(change.start).toISOString().substr(0, 10) : null;
            const end = change.end ? new Date(change.end).toISOString().substr(0, 10) : null;
            console.log(start, end, change.id);
        },
    });

    calendar.render();
}

async function registerSchedule() {
    const formData = document.getElementById("calendarModalForm");

    const param = {
        title: formData.title.value,
        start: formData.start.value,
    };

    if (!param.title) {
        alert("Please, fill title field!");
        return false;
    }

    // create schedule
    await fetch("/calendar", {
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

    // close modal
    document.querySelector("#calendarModal button.btn-close").dispatchEvent(new Event("click"));

    // refresh calendar
    setCalendar();
}

// get calendarScheme list
function findSchedule(param) {
    return fetch(`/calendar/${param}`, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                new Error(response.status);
            }
            return response.json();
        })
        .catch(e => {
            console.log(e);
        });
}
