"use strict";

export class SearchParam {
    constructor(currentPage, formData, limit) {
        this.params = new URL(document.URL);
        this.params.searchParams.append("page", currentPage || 1);
        this.params.searchParams.append("limit", limit || 25);

        // check formData is exist
        if (!formData) {
            return false;
        }
        // set formData
        for (const pair of formData.entries()) {
            this.params.searchParams.append(pair[0], pair[1]);
        }
    }
}
