export class Pagination {
    constructor(pagination) {
        this.pagination = pagination;
        this.currentPage = 1;
    }
}

// make pagination
Pagination.prototype.makePagination = function (paginator) {
    // make paging variables
    const { rangeSize, pageLimit, totalCount, currentPage, currentRange, rangeCount, startPage, endPage } = paginator;

    // paging blocks
    let previous = null;
    let next = null;
    let pages = "";

    // make previous
    if (currentRange > 1) {
        previous = `<li class="page-item">
                        <a class="page-link" href="#" data-page="${startPage - rangeSize}">&laquo;</a>
                    </li>`;
    }

    // make next
    if (rangeCount > currentRange * rangeSize) {
        next = `<li class="page-item">
                    <a class="page-link" href="#" data-page="${startPage + rangeSize}">&raquo;</a>
                </li>`;
    }

    // pages
    for (let i = startPage; i <= endPage; i++) {
        pages += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }

    return `<nav>
                <ul class="pagination justify-content-center">
                    ${previous || ""}
                    ${pages || ""}
                    ${next || ""}
                </ul>
            </nav>`;
};

// insert pagination to element
Pagination.prototype.setPagination = function (paginator) {
    this.pagination.innerHTML = this.makePagination(paginator);
    return this;
};

// set click event
Pagination.prototype.setEvent = function (callback) {
    this.pagination.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", e => callback(e));
    });
};
