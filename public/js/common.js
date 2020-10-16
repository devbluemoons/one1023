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
        const contact = [value.contact1, value.contact2, value.contact3].join("-");
        Handsontable.dom.fastInnerHTML(td, contact);
        Handsontable.renderers.cellDecorator.apply(this, arguments);
    }
}

// set handsonTable properties
export function standardSettings(data, colHeaders, columns, heightPercent) {
    return {
        data: data,
        columns: columns,
        colHeaders: colHeaders,
        height: window.innerHeight * heightPercent,
        readOnly: true,
        rowHeaders: true,
        maxRows: 30,
        rowHeights: 30,
        columnHeaderHeight: 30,
        bindRowsWithHeaders: true,
        autoColumnSize: true,
        manualRowResize: true,
        manualColumnResize: true,
        licenseKey: "non-commercial-and-evaluation",
        className: "htCenter htMiddle",
        stretchH: "all",
        afterGetRowHeader: function (col, TH) {
            TH.className = "htMiddle";
        },
        afterGetColHeader: function (col, TH) {
            TH.className = "htMiddle";
        },
        // blueboxElem.className += ' expanded'
    };
}

// select all row
let lastHighlitedRow = null;
export function selectAllRow(row, col) {
    const hot = document.getElementById("dataTable");

    if (lastHighlitedRow != null) {
        for (let i = 0; i < hot.countCols(); i++) {
            hot.setCellMeta(lastHighlitedRow, i, "className", "");
        }
    }

    for (let i = 0; i < hot.countCols(); i++) {
        hot.setCellMeta(row, i, "className", "area highlight");
    }

    lastHighlitedRow = row;

    hot.render();
}
