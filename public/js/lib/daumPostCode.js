export function getAddress(layer) {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            if (data) {
                document.querySelector("[name=zipCode]").value = data.zonecode;
                document.querySelector("[name=address1]").value = data.address;
            }
            closeDaumPostCode(layer);
        },
        width: "100%",
        height: "100%",
        maxSuggestItems: 5,
    }).embed(layer);

    displayDaumPostCode(layer);
    initLayerPosition(layer);
}

// iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
export function initLayerPosition(layer) {
    const width = 480; //우편번호서비스가 들어갈 element의 width
    const height = 640; //우편번호서비스가 들어갈 element의 height
    const borderWidth = 2; //샘플에서 사용하는 border의 두께

    // 위에서 선언한 값들을 실제 element에 넣는다.
    layer.style.width = width + "px";
    layer.style.height = height + "px";
    layer.style.border = borderWidth + "px solid #595959";
    // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
    layer.style.left = ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth + "px";
    layer.style.top = ((window.innerHeight || document.documentElement.clientHeight) - height) / 2 - borderWidth + "px";
}

export function displayDaumPostCode(layer) {
    // iframe을 넣은 element를 보이게 한다.
    layer.style.display = "block";
}

export function closeDaumPostCode(layer) {
    // iframe을 넣은 element를 안보이게 한다.
    layer.style.display = "none";
}
