// make pagination
export function makePagination(data) {
    // calculated variables from [ mongoose-paginate-v2 ]
    const { hasNextPage, hasPrevPage, limit, nextPage, page, pagingCounter, prevPage, totalDocs, totalPages } = data;

    // make paging variables
    const currentPage = page;
    const rangeSize = 10;
    const currentRange = Math.ceil(currentPage / rangeSize);
    const rangeCount = Math.ceil(totalPages / rangeSize);
    const startPage = (currentRange - 1) * rangeSize + 1;
    const endPage = currentRange * rangeSize > totalPages ? totalPages : currentRange * rangeSize;

    // make url path
    const url = new URL(document.URL);
    const pathname = url.pathname;
    const urlPath = pathname + "?page=";

    console.log(url);

    // paging blocks
    let previous = null;
    let next = null;
    let pages = "";

    // make previous
    if (currentRange > 1) {
        previous = `<li class="page-item">
                        <a class="page-link" href="${urlPath}${startPage - rangeSize}" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>`;
    }

    // make next
    if (currentRange < rangeCount) {
        next = `<li class="page-item">
                    <a class="page-link" href="${urlPath}${startPage - rangeSize}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>`;
    }

    // pages
    for (let i = startPage; i <= endPage; i++) {
        pages += `<li class="page-item"><a class="page-link" href="${urlPath}${i}">${i}</a></li>`;
    }

    return `<nav>
                <ul class="pagination justify-content-center">
                    ${previous || ""}
                    ${pages || ""}
                    ${next || ""}
                </ul>
            </nav>`;
}
