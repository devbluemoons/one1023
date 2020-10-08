import * as daum from "./lib/daumPostCode.js";

window.onload = function () {

    // set daum post code
    const addressLayer = document.querySelector(".addressLayer");
    document.querySelector("#btnSearch").addEventListener("click", function () {
        daum.getAddress(addressLayer);
    });

    setBirthDate();
    setJoinDate();

};

function setBirthDate(){
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
        option.value = i;
        option.text = i;

        document.querySelector("[name=birthMonth]").appendChild(option);
    }
    //birth day
    for (let i = 1; i <= 31; i++) {
        
        const option = document.createElement("option");
        option.value = i;
        option.text = i;

        document.querySelector("[name=birthDay]").appendChild(option);
    }
}

function setJoinDate(){
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
        option.value = i;
        option.text = i;

        document.querySelector("[name=joinMonth]").appendChild(option);
    }
}