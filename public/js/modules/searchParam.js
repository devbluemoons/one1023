export class SearchParam {
    constructor(currentPage, limit) {
        this.params = new URL(document.URL);
        this.params.searchParams.append("page", currentPage || 1);
        this.params.searchParams.append("limit", limit || 25);
    }
}
