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
                console.log(data);
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
