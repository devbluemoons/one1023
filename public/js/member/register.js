import * as daum from "../lib/daumPostCode.js";

window.onload = function () {
    setDaumPostCode();
    setBirthDay();
    setJoinDate();
    setImagePreview();
    setEvent();
};

// set Daum Post Code Api
function setDaumPostCode() {
    const layer = document.querySelector(".address-layer");
    document.querySelector("#btnSearch").addEventListener("click", function () {
        daum.getAddress(layer);
    });
}

// set birthday select box
function setBirthDay() {
    //birth year
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
    //birth month
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? "0" + i : i;
        option.text = i < 10 ? "0" + i : i;

        document.querySelector("[name=birthMonth]").appendChild(option);
    }
    //birth day
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? "0" + i : i;
        option.text = i < 10 ? "0" + i : i;

        document.querySelector("[name=birthDay]").appendChild(option);
    }
}

// set join date select box
function setJoinDate() {
    //join year
    const openYear = 2015;
    const thisYear = Number(new Date().getFullYear());

    for (let i = openYear; i <= thisYear; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.text = i;

        document.querySelector("[name=joinYear]").appendChild(option);
    }
    //join month
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
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            image.setAttribute("src", this.result);
            image.style.width = "100%";
        });
        reader.readAsDataURL(imageFile.files[0]);

        modal.show();
    });
}

// set all event
function setEvent() {
    document.getElementById("btnSave").addEventListener("click", registerMember);
}

// register member information
function registerMember() {
    const formData = makeFormData();
    verifyFormData(formData);
    saveFormData(formData);
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
    formData.append("birthday", [birthYear, birthMonth, birthDay].join(""));

    // make join date
    const joinYear = formData.get("joinYear");
    const joinMonth = formData.get("joinMonth");
    formData.append("joinDate", [joinYear, joinMonth].join(""));

    return formData;
}

// verify form data
// param : member information
function verifyFormData(data) {
    // set post parameter
    const param = {};

    data.forEach((value, key) => {
        param[key] = value;
    });
}

// save form data
// param : member information
function saveFormData(data) {
    // create member information
    fetch("/member/create", {
        method: "POST",
        body: data,
    })
        .then(response => {
            if (!response.ok) {
                new Error(response);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            location.href = "/member/list";
        })
        .catch(error => {
            new Error(error);
        });
}
