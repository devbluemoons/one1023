////////////////////
//                //
//  handsonTable  //
//                //
////////////////////

/* renderer */
export function imageRenderer(instance, td, row, col, prop, value, cellProperties) {
    const img = document.createElement("IMG");
    img.src = "/file/12248147_1653319481612623_7179105678068856634_o.jpg";
    // img.style.width = "100%";
    img.style.height = "200%";

    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.appendChild(img);

    // Handsontable.dom.empty(td);
    // const imagePath = value || "#";
    // Handsontable.dom.fastInnerHTML(td);
    // Handsontable.renderers.HtmlRenderer.apply(this, arguments);
}

export function contactRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value) {
        const contact = { ...value };
        td.innerText = [value, value, value].join("-");

        Handsontable.dom.fastInnerHTML(td, contact);
        Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    }
}

export function memberDetailRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value) {
        const link = `<a href="http://www.apple.com" target="_blank">${value}</a>`;
        Handsontable.renderers.HtmlRenderer.apply(this, arguments);
        Handsontable.dom.fastInnerHTML(td, link);
    }
}

// set handsonTable properties
export function defaultSettings(data, colHeaders, columns, heightPercent) {
    return {
        data: data,
        columns: columns,
        colHeaders: colHeaders,
        height: window.innerHeight * heightPercent,
        rowHeaders: index => index + 1,
        columnHeaderHeight: 30,
        rowHeights: 30,
        maxRows: 25,
        readOnly: true,
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
