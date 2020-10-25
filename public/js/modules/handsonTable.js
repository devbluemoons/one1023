////////////////////
//                //
//  handsonTable  //
//                //
////////////////////

/* renderer */
export function imageRenderer(_instance, td, _row, _col, _prop, value, _cellProperties) {
    if (value) {
        const img = new Image();

        img.style.height = "200%";
        img.style.width = "100%";
        img.src = "/" + value;

        td.appendChild(img);
    }
}

export function memberDetailRenderer(instance, td, row, _col, _prop, value, _cellProperties) {
    const _id = instance.getDataAtRowProp(row, "_id");
    const link = `<a href="/member/view?id=${_id}" target="_blank">${value}</a>`;

    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    Handsontable.dom.fastInnerHTML(td, link);
}

export function contactRenderer(_instance, td, _row, _col, _prop, value, _cellProperties) {
    if (value) {
        const contact = [value.contact1, value.contact2, value.contact3].join("-");

        Handsontable.renderers.HtmlRenderer.apply(this, arguments);
        Handsontable.dom.fastInnerHTML(td, contact);
    }
}

export function genderRenderer(_instance, td, _row, _col, _prop, value, _cellProperties) {
    const gender = value.toUpperCase() === "M" ? "Men" : "Women";

    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    Handsontable.dom.fastInnerHTML(td, gender);
}

export function birthdayRenderer(_instance, td, _row, _col, _prop, value, _cellProperties) {
    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);

    const birthday = `${year}/${month}/${day}`;
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    Handsontable.dom.fastInnerHTML(td, birthday);
}

export function ageRenderer(_instance, td, _row, _col, _prop, value, _cellProperties) {
    const year = value.substring(0, 4);

    const thisYear = new Date().getFullYear();
    const age = thisYear - Number(year) + 1;

    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    Handsontable.dom.fastInnerHTML(td, age);
}

// set handsonTable properties
export function defaultSettings(data, colHeaders, columns) {
    return {
        data: data,
        columns: columns,
        colHeaders: colHeaders,
        rowHeaders: index => index + 1,
        columnHeaderHeight: 30,
        rowHeights: 30,
        readOnly: true,
        height: "auto",
        stretchH: "all",
        className: "htCenter htMiddle",
        licenseKey: "non-commercial-and-evaluation",
        afterGetRowHeader: function (col, TH) {
            TH.className = "htMiddle";
        },
        afterGetColHeader: function (col, TH) {
            TH.className = "htMiddle";
        },
        afterRenderer: function (TD) {},
        afterOnCellMouseDown: function (event, current, el) {
            // get imagePath
            if (el.querySelector("img")) {
                console.log(el.querySelector("img").src);
            }
        },
        afterInit: function () {
            // const tbody = document.querySelector("#dataTable tbody");
            // tbody.addEventListener("click", e => {
            // const currentRow = e.target.parentElement.querySelector(".rowHeader").textContent;
            // self.selectRows(currentRow);
            // console.log(Handsontable.selectRows(currentRow));
            // });
        },
        // blueboxElem.className += ' expanded'
    };
}
