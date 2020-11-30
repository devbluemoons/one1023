module.exports = class Paginator {
    constructor(totalCount, limit, currentPage) {
        // range size
        this.rangeSize = 10;
        // size per a page
        this.pageSize = limit || 25;
        // total document count
        this.totalCount = totalCount;
        // total page count
        this.pageCount = Math.ceil(this.totalCount / this.pageSize);
        // current page
        this.currentPage = currentPage || 1;
        // current range
        this.currentRange = Math.ceil(this.currentPage / this.rangeSize);
        // total range count
        this.rangeCount = Math.ceil(this.totalCount / this.pageSize);
        // start page in current range
        this.startPage = (this.currentRange - 1) * this.rangeSize + 1;
        // end page in current range
        this.endPage = this.startPage + this.rangeSize - 1 > this.pageCount ? this.pageCount : this.startPage + this.rangeSize - 1;
    }
};
