window.addEventListener("DOMContentLoaded", e => {
    findOneMember();
});

// get member list
function findOneMember() {
    // get parameter
    const id = getParam();

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

function getParam() {
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
    document.getElementById("married").innerHTML = data.married;
    document.getElementById("joinDate").innerHTML = joinDateFormatter(data.joinDate);
}

/* formatter */
function titleFormater(value) {
    return `
        <h3>${value.name}</h3>
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
        <span>${value.address1}</span><br>
        <span>${value.address2} ( ${value.zipCode})</span>
    `;
}
