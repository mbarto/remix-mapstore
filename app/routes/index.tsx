import { LoaderFunction, useLoaderData } from "remix"
import HomeDescription from "../MapStore2/web/client/product/plugins/HomeDescription"
import Contents from "../home/Contents"
import { loader as mapsLoader } from "./maps/index.server"
import { loader as dashboardsLoader } from "./dashboards/index.server"
import { loader as geostoriesLoader } from "./geostories/index.server"

export const loader: LoaderFunction = async ({ request, context, params }) => {
    const url = new URL(request.url)
    if (url.searchParams.get("dashboardsPage") !== null) {
        return await dashboardsLoader({ request, context, params })
    }
    if (url.searchParams.get("geostoriesPage") !== null) {
        return await geostoriesLoader({ request, context, params })
    }
    return await mapsLoader({ request, context, params })
}

export default function Index() {
    const data = useLoaderData()

    return (
        <div id="page-maps" className="page page-maps">
            <span id="mapstore-navbar">Navbar</span>
            <HomeDescription.HomeDescriptionPlugin />
            <div id="map-search-bar" className="MapSearchBar maps-search">
                Search
            </div>
            <div className="create-new-map-container">Create new Map</div>
            <div>
                <div
                    id="ms-featured-maps"
                    className="ms-grid-container  container"
                >
                    Featured Maps
                </div>
            </div>
            <Contents data={data} />
        </div>
    )
}
