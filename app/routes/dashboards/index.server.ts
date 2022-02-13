import { LoaderFunction } from "remix"
import castArray from "lodash/castArray"
import { getParam } from "../geostories/index.server"

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url)
    const page = getParam(url, "dashboardsPage", 0)
    const pageSize = getParam(url, "dashboardsPageSize", 5)
    const loadUrl = `https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore/extjs/search/category/DASHBOARD/***/thumbnail,details,featured?start=${
        page * pageSize
    }&limit=${pageSize}&includeAttributes=true`
    const resp = await fetch(loadUrl)
    const json = await resp.json()
    return {
        dashboardsCount: json.totalCount,
        dashboards: castArray(json.results).map((map) => ({
            id: map.id,
            title: map.name,
            description: map.description,
            featured: false,
            canEdit: map.canEdit,
            details: map.details,
            thumbnail: map.thumbnail
                ? `https://dev-mapstore.geosolutionsgroup.com/mapstore/${map.thumbnail}`
                : null,
        })),
    }
}
