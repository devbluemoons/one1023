import * as common from "./../common.js";

window.addEventListener("DOMContentLoaded", e => {
    setValue();
    setEvent();
});

async function setValue() {
    // get parameter
    const memberId = getMemberId();

    if (!memberId) {
        return false;
    }
    const member = await findMemberDetailById(memberId);

    if (!member) {
        return false;
    }
    setMemberValue(member);
}

/* set event */
function setEvent() {
    const memberId = getMemberId();

    document.getElementById("btnEdit").addEventListener("click", e => {
        location.href = `/member/register?id=${memberId}`;
    });
}

// get member by member id
function findMemberDetailById(id) {
    return fetch(`/member/view/${id}`, {
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

function getMemberId() {
    const searchValue = location.search;
    const params = new URLSearchParams(searchValue);
    const id = params.get("id");

    return id;
}

async function setMemberValue(data) {
    if (data.imagePath) {
        document.getElementById("imagePath").src = "/".concat(data.imagePath);
    }
    document.getElementById("title").innerHTML = titleFormater(data);
    document.getElementById("birthday").innerHTML = birthdayFormatter(data.birthday);
    document.getElementById("contact").innerHTML = contactFormatter(data);
    document.getElementById("address").innerHTML = addressFormatter(data);

    document.getElementById("joinDate").innerHTML = joinDateFormatter(data.joinDate);
    document.getElementById("faithState").innerHTML = data.faithState;
    document.getElementById("baptism").innerHTML = data.baptism || "";

    if (data.group) {
        document.getElementById("group").innerHTML = data.group.name;
    }
    if (data.position) {
        document.getElementById("position").innerHTML = data.position.name;
    }
    if (data.service) {
        document.getElementById("service").innerHTML = data.service.name;
    }

    document.getElementById("gender").innerHTML = genderFormatter(data.gender);
    document.getElementById("married").innerHTML = marriedFormatter(data.married);
    document.getElementById("job").innerHTML = data.job;
    document.getElementById("email").innerHTML = data.email;

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
            // "a" must be equal to "b"
            return 0;
        });

        // set simple member info in family group
        const defaultImage = "uploads/blank_profile.png";
        const family = document.getElementById("family");
        family.innerHTML = "";

        familyGroup.forEach(member => {
            family.innerHTML += `
                <div class="col-2 pt-3">
                    <div class="card text-center">
                        <div class="frame">
                            <img src="/${member.imagePath || defaultImage}" class="card-img-top" id="imagePath" />
                        </div>
                        <div class="border-top pTB-10">
                            ${member.name} (${ageFormatter(member.birthday)})
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // set to same height and width
    // set vertical-align : middle
    common.setVerticalImage();
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
    return value === "Y" ? "Married" : "Single";
}
