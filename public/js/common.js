////////////////////
//                //
//  handsonTable  //
//                //
////////////////////

/* renderer */
export function imageRenderer(instance, td, row, col, prop, value, cellProperties) {
    const imagePath = value || "#";
    Handsontable.dom.fastInnerHTML(td, `<img class="img" src="${imagePath}">`);
    Handsontable.renderers.cellDecorator.apply(this, arguments);
}

export function contactRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value) {
        const contact = { ...value };

        td.innerText = [value, value, value].join("-");

        // console.log(contact);

        Handsontable.dom.fastInnerHTML(td, contact);
        Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    }
}

// set handsonTable properties
export function defaultSettings(data, colHeaders, columns, heightPercent) {
    return {
        data: data,
        rowHeaders: true,
        colHeaders: colHeaders,
        columns: columns,
        colHeaders: colHeaders,
        height: window.innerHeight * heightPercent,
        readOnly: true,
        rowHeaders: true,
        maxRows: 10,
        rowHeights: 30,
        columnHeaderHeight: 30,
        bindRowsWithHeaders: true,
        autoColumnSize: true,
        manualRowResize: true,
        manualColumnResize: true,
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
        afterInit: function () {
            const tbody = document.querySelector("#dataTable tbody");
            tbody.addEventListener("click", e => {
                const currentRow = e.target.parentElement.querySelector(".rowHeader").textContent;
                // self.selectRows(currentRow);
                // console.log(Handsontable.selectRows(currentRow));
            });
        },
        // blueboxElem.className += ' expanded'
    };
}
