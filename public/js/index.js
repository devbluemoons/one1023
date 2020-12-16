import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");

    const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin],
    });

    calendar.render();
});
