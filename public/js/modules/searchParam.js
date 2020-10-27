export class SearchParam {
    constructor(currentPage, formData, limit) {
        this.params = new URL(document.URL);
        this.params.searchParams.append("page", currentPage || 1);
        this.params.searchParams.append("limit", limit || 25);

        // set formData
        for (var pair of formData.entries()) {
            this.params.searchParams.append(pair[0], pair[1]);
        }
    }
}
