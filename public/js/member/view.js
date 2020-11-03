window.addEventListener("DOMContentLoaded", e => {
    setEvent();
    findOneMember();
});

// get member list
function findOneMember() {
    // get parameter
    const id = getId();

    // find one member information
    fetch(`/member/${id}`, {
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
                setMemberValue(data);
            }
        })
        .catch(error => {
            new Error(error);
        });
}

function getId() {
    const searchValue = location.search;
    const params = new URLSearchParams(searchValue);
    const id = params.get("id");

    return id;
}

function setMemberValue(data) {
    console.log(data);
    if (data.imagePath) {
        document.getElementById("imagePath").src = "/".concat(data.imagePath);
    }
    document.getElementById("title").innerHTML = titleFormater(data);
    document.getElementById("birthday").innerHTML = birthdayFormatter(data.birthday);
    document.getElementById("contact").innerHTML = contactFormatter(data.contact);
    document.getElementById("address").innerHTML = addressFormatter(data);
    document.getElementById("job").innerHTML = data.job;
    document.getElementById("email").innerHTML = data.email;
    document.getElementById("joinDate").innerHTML = joinDateFormatter(data.joinDate);
    document.getElementById("gender").innerHTML = genderFormatter(data.gender);
    document.getElementById("married").innerHTML = marriedFormatter(data.married);
    document.getElementById("faithState").innerHTML = faithStateFormatter(data.faithState);
    document.getElementById("baptism").innerHTML = baptismFormatter(data.baptismFormatter);
}

/* formatter */
function titleFormater(value) {
    return `
        <h3> ${value.name} <span>(${ageFormatter(value.birthday)})</span> </h3>
    `;
}

function ageFormatter(value) {
    const year = value.substring(0, 4);
    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    return age;
}

function birthdayFormatter(value) {
    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);

    return `${year}/${month}/${day}`;
}

function contactFormatter(value) {
    const contact1 = value.contact1;
    const contact2 = value.contact2;
    const contact3 = value.contact3;

    return `${contact1}-${contact2}-${contact3}`;
}

function joinDateFormatter(value) {
    const year = value.substring(0, 4);
    const month = value.substring(4, 6);

    return `${year}/${month}`;
}

function addressFormatter(value) {
    return `
        ${value.address1}
        ${value.address2} (${value.zipCode})
    `;
}

function genderFormatter(value) {
    return value === "M" ? "Man" : "Woman";
}

function marriedFormatter(value) {
    return value === "Y" ? "Together" : "Single";
}

/* set event */
function setEvent() {
    document.getElementById("btnEdit").addEventListener("click", e => {
        location.href = `/member/register?id=${getId()}`;
    });
}
