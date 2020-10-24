module.exports = class Paginator {
    constructor(totalCount, limit, currentPage) {
        // make paging variables
        this.rangeSize = 10;
        this.pageLimit = limit || 25;
        this.totalCount = totalCount;
        this.currentPage = currentPage || 1;
        this.currentRange = Math.ceil(this.currentPage / this.rangeSize);
        this.rangeCount = Math.ceil(this.totalCount / this.rangeSize);
        this.startPage = (this.currentRange - 1) * this.rangeSize + 1;
        this.endPage = this.currentRange * this.rangeSize > this.totalCount ? this.totalCount : this.currentRange * this.rangeSize;
    }
};
