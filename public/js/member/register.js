import * as daum from "../modules/daumPostCode.js";

window.onload = function () {
    setDaumPostCode();
    setBirthDay();
    setJoinDate();
    setImagePreview();
    setValue();
    setEvent();
};

// set value
async function setValue() {
    // check memberId
    const id = getId();

    if (id) {
        const member = await findMemberOne(id);
        setMemberValue(member);
    }

    setGroupList();
}

async function setGroupList() {
    const url = new URL(document.URL);
    url.searchParams.append("division", "group");
    url.searchParams.append("valid", "01");

    const groupList = await findGroupList(url);

    if (!groupList) {
        return false;
    }
    const select = document.querySelector("[name=group]");

    groupList.forEach(item => {
        const option = document.createElement("option");
        option.value = item._id;
        option.textContent = item.name;

        select.appendChild(option);
    });
}

// set event
function setEvent() {
    // create member
    document.getElementById("btnSave").addEventListener("click", registerMember);
    document.getElementById("btnEdit").addEventListener("click", updateMember);
    // number regular expression
    document.querySelectorAll("[name^=contact]").forEach(item => {
        item.addEventListener("keyup", numberRegExp);
    });
}

// set Daum Post Code Api
function setDaumPostCode() {
    const layer = document.querySelector(".address-layer");
    document.querySelector("#btnSearch").addEventListener("click", function () {
        daum.getAddress(layer);
    });
}

// get member list
function findMemberOne(id) {
    // find one member information
    return fetch(`/member/${id}`, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
        })
        .catch(error => {
            new Error(error);
        });
}

function setMemberValue(data) {
    // can not modify fields
    document.querySelector("[name=_id]").value = getId();

    // set id (hidden value)
    document.querySelector("[name=name]").value = data.name;

    // set name
    document.querySelector("[name=name]").value = data.name;
    document.querySelector("[name=name]").setAttribute("readonly", true);

    // set gender
    document.querySelector("[name=gender]").checked = data.gender;
    document.querySelector("#divGender").classList.add("hide");

    document.querySelector("#viewGender input").value = data.gender === "M" ? "Male" : "Female";
    document.querySelector("#viewGender").classList.remove("hide");

    // set birthday
    document.querySelector("[name=birthYear]").value = data.birthday.substring(0, 4);
    document.querySelector("[name=birthMonth]").value = data.birthday.substring(4, 6);
    document.querySelector("[name=birthDay]").value = data.birthday.substring(6, 8);
    document.querySelector("#divBirthday").classList.add("hide");

    const birthday = `${data.birthday.substring(0, 4)}/${data.birthday.substring(4, 6)}/${data.birthday.substring(6, 8)}`;
    document.querySelector("#viewBirthday input").value = birthday;
    document.querySelector("#viewBirthday").classList.remove("hide");

    // set join date
    document.querySelector("[name=joinYear]").value = data.joinDate.substring(0, 4);
    document.querySelector("[name=joinMonth]").value = data.joinDate.substring(4, 6);
    document.querySelector("#divJoinDate").classList.add("hide");

    const joinDate = `${data.joinDate.substring(0, 4)}/${data.joinDate.substring(4, 6)}`;
    document.querySelector("#viewJoinDate input").value = joinDate;
    document.querySelector("#viewJoinDate").classList.remove("hide");

    // must field
    document.querySelector("[name=contact1]").value = data.contact1;
    document.querySelector("[name=contact2]").value = data.contact2;
    document.querySelector("[name=contact3]").value = data.contact3;
    document.querySelector("[name=address1]").value = data.address1;
    document.querySelector("[name=address2]").value = data.address2;
    document.querySelector("[name=zipCode]").value = data.zipCode;
    document.querySelector("[name=married]").checked = data.married;

    // option field
    document.querySelector("[name=email]").value = data.email;
    document.querySelector("[name=job]").value = data.job;
    document.querySelector("[name=baptism]").checked = data.baptism;
    document.querySelector("[name=group]").value = data.group;
    document.querySelector("[name=role]").value = data.role;
    document.querySelector("[name=service]").value = data.service;
    document.querySelector("[name=attendance]").checked = data.attendance;

    if (data.imagePath) {
        document.querySelector("#imagePreview img").src = "/" + data.imagePath;
        document.querySelector(".image-preview__real").style.display = "block";
        document.querySelector(".image-preview__text").style.display = "none";
    }

    // set button state
    document.querySelector("#btnSave").classList.add("hide");
    document.querySelector("#btnEdit").classList.remove("hide");
}

// set birthday select box
function setBirthDay() {
    // birth year
    const date = new Date();
    const thisYear = date.getFullYear();

    date.setFullYear(thisYear - 120);
    const minimumYear = date.getFullYear();

    for (let i = minimumYear; i <= thisYear; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.text = i;

        document.querySelector("[name=birthYear]").appendChild(option);
    }
    // birth month
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? "0" + i : i;
        option.text = i < 10 ? "0" + i : i;

        document.querySelector("[name=birthMonth]").appendChild(option);
    }
    // birth day
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? "0" + i : i;
        option.text = i < 10 ? "0" + i : i;

        document.querySelector("[name=birthDay]").appendChild(option);
    }
}

// set join date select box
function setJoinDate() {
    // join year
    const openYear = 2015;
    const thisYear = Number(new Date().getFullYear());

    for (let i = openYear; i <= thisYear; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.text = i;

        document.querySelector("[name=joinYear]").appendChild(option);
    }
    // join month
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? "0" + i : i;
        option.text = i < 10 ? "0" + i : i;

        document.querySelector("[name=joinMonth]").appendChild(option);
    }
}

// set image preview function
function setImagePreview() {
    const imageFile = document.querySelector("#imageFile");
    const imageContainer = document.querySelector("#imagePreview");
    const imagePreview = imageContainer.querySelector(".image-preview__real");
    const imageText = imageContainer.querySelector(".image-preview__text");

    imageFile.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            imageText.style.display = "none";
            imagePreview.style.display = "block";

            reader.addEventListener("load", function () {
                imagePreview.setAttribute("src", this.result);
            });
            reader.readAsDataURL(file);
        } else {
            imageText.style.display = null;
            imagePreview.style.display = null;
        }
    });

    // delete image File
    document.querySelector("#btnRemove").addEventListener("click", function () {
        imageFile.value = null;
        imageText.style.display = null;
        imagePreview.style.display = null;
    });

    // endlarge image
    imagePreview.addEventListener("click", function () {
        const imageContainer = document.getElementById("enlargeImage");
        const image = imageContainer.querySelector("img");
        const modal = new bootstrap.Modal(imageContainer);

        image.src = this.src;
        image.style.width = "100%";

        modal.show();
    });
}

// register member information
function registerMember() {
    const formData = makeFormData();
    const valid = verifyFormData(formData);

    if (valid) {
        saveFormData(formData);
    }
}

function updateMember() {
    const formData = makeFormData();
    const valid = verifyFormData(formData);

    if (valid) {
        updateFormData(formData);
    }
}

// make form data
// return : member information
function makeFormData() {
    const joinForm = document.getElementById("joinForm");
    const formData = new FormData(joinForm);

    // make birthday
    const birthYear = formData.get("birthYear");
    const birthMonth = formData.get("birthMonth");
    const birthDay = formData.get("birthDay");
    formData.set("birthday", [birthYear, birthMonth, birthDay].join(""));

    // make join date
    const joinYear = formData.get("joinYear");
    const joinMonth = formData.get("joinMonth");
    formData.set("joinDate", [joinYear, joinMonth].join(""));

    return formData;
}

// verify form data
// param : member information
function verifyFormData(data) {
    // check required fields
    // check variable type or specific field rule
    if (!data.get("name")) {
        alert(`Please, fill [Name] field`);
        return false;
    }
    if (!data.get("contact1")) {
        alert(`Please, fill [Contact] field`);
        return false;
    }
    if (!data.get("contact2")) {
        alert(`Please, fill [Contact] field`);
        return false;
    }
    if (!data.get("contact3")) {
        alert(`Please, fill [Contact] field`);
        return false;
    }
    if (!data.get("address1")) {
        alert(`Please, fill [Address] field`);
        return false;
    }
    if (!data.get("address2")) {
        alert(`Please, fill [Address] field`);
        return false;
    }
    if (!data.get("zipCode")) {
        alert(`Please, fill [Zip Code] field`);
        return false;
    }
    if (!data.get("gender")) {
        alert(`Please, fill [Gender] field`);
        return false;
    }
    if (!data.get("birthYear")) {
        alert(`Please, fill [Birthday] field`);
        return false;
    }
    if (!data.get("birthMonth")) {
        alert(`Please, fill [Birthday] field`);
        return false;
    }
    if (!data.get("birthDay")) {
        alert(`Please, fill [Birthday] field`);
        return false;
    }
    if (!data.get("married")) {
        alert(`Please, fill [Marital Status] field`);
        return false;
    }
    if (!data.get("faithState")) {
        alert(`Please, fill [Faith State] field`);
        return false;
    }
    if (!data.get("joinYear")) {
        alert(`Please, fill [Join Date] field`);
        return false;
    }
    if (!data.get("joinMonth")) {
        alert(`Please, fill [Join Date] field`);
        return false;
    }
    return true;
}

// save form data
// param : member information
function saveFormData(data) {
    fetch("/member", {
        method: "POST",
        body: data,
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                location.href = "/member/list";
            }
        })
        .catch(error => {
            new Error(error);
        });
}

// update form data
// param : member information
function updateFormData(data) {
    fetch("/member", {
        method: "PUT",
        body: data,
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                location.href = "/member/list";
            }
        })
        .catch(error => {
            new Error(error);
        });
}

// number regular expression
function numberRegExp(e) {
    e.target.value = e.target.value.replace(/[^0-9]/, "");
    e.target.value = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/, "");
}

// get id parameter
function getId() {
    const searchValue = location.search;
    const params = new URLSearchParams(searchValue);
    const id = params.get("id");

    return id;
}

// get group list
function findGroupList(url) {
    // create member information
    return fetch("/code/division" + url.search, {
        method: "GET",
    })
        .then(response => {
            if (!response.ok) {
                console.error(response);
            }
            return response.json();
        })
        .catch(error => {
            new Error(error);
        });
}
