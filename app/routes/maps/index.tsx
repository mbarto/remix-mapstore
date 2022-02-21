import { LoaderFunction } from "remix"
import { getParam } from "../geostories"
import { getAuthorization } from "../../utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url)
    const page = getParam(url, "mapsPage", 0)
    const pageSize = getParam(url, "mapsSize", 12)
    const loadUrl = `https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore/extjs/search/category/MAP/***/thumbnail,details,featured?start=${
        page * pageSize
    }&limit=${pageSize}&includeAttributes=true`

    const headers = await getAuthorization(request)
    const resp = await fetch(loadUrl, {
        headers,
    })
    const json = await resp.json()
    return {
        mapsCount: json.totalCount,
        maps: json.results.map((map) => ({
            id: map.id,
            title: map.name,
            description: map.description,
            featured: map.featured,
            canEdit: map.canEdit,
            details: map.details,
            thumbnail: map.thumbnail
                ? `https://dev-mapstore.geosolutionsgroup.com/mapstore/${map.thumbnail}`
                : null,
        })),
    }
}
