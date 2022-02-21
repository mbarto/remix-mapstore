import { LoaderFunction } from "remix"
import { getAuthorization } from "../../utils/session.server"

export function getParam(url: URL, name: string, defaultValue: number): number {
    return url.searchParams.get(name)
        ? Number(url.searchParams.get(name))
        : defaultValue
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url)
    const page = getParam(url, "geostoriesPage", 0)
    const pageSize = getParam(url, "geostoriesPageSize", 12)
    const loadUrl = `https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore/extjs/search/category/GEOSTORY/***/thumbnail,details,featured?start=${
        page * pageSize
    }&limit=${pageSize}&includeAttributes=true`

    const headers = await getAuthorization(request)
    const resp = await fetch(loadUrl, {
        headers,
    })
    const json = await resp.json()
    return {
        geostoriesCount: json.totalCount,
        geostories: json.results.map((map) => ({
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
