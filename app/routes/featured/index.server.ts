import { LoaderFunction } from "remix"
import { getParam } from "../geostories/index.server"
import castArray from "lodash/castArray"
import head from "lodash/head"
import { getAuthorization } from "../utils/session.server"

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url)
    const page = getParam(url, "featuredPage", 0)
    const pageSize = getParam(url, "featuredPageSize", 4)
    const loadUrl = `https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore/extjs/search/list?includeAttributes=true&start=${
        page * pageSize
    }&limit=${pageSize}`

    const headers = new Headers({
        "Content-Type": "application/xml",
        Accept: "application/json",
    })
    const authorizationHeaders = await getAuthorization(request)
    authorizationHeaders?.forEach((value, key) => {
        if (key && value) headers.append(key, value)
    })
    const resp = await fetch(loadUrl, {
        method: "POST",
        body: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><AND><ATTRIBUTE><name>featured</name><operator>EQUAL_TO</operator><type>STRING</type><value>true</value></ATTRIBUTE></AND>',
        headers,
    })
    const json = await resp.json()

    return {
        featuredCount: json.ExtResourceList.ResourceCount,
        featured: castArray(json.ExtResourceList.Resource).map((map) => ({
            id: map.id,
            title: map.name,
            description: map.description,
            icon: map.category.name.toLowerCase(),
            featured: true,
            canEdit: false,
            details: map.details,
            thumbnail: map.Attributes?.attribute
                ? `https://dev-mapstore.geosolutionsgroup.com/mapstore/${
                      head(
                          castArray(map.Attributes.attribute).filter(
                              (a) => a.name === "thumbnail"
                          )
                      )?.value
                  }`
                : null,
        })),
    }
}
