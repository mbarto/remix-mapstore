import { LoaderFunction, useLoaderData } from "remix"
import HomeDescription from "../MapStore2/web/client/product/plugins/HomeDescription"
import Contents from "../home/Contents"
import { loader as mapsLoader } from "./maps"
import { loader as featuredLoader } from "./featured/index.server"
import ResourceGrid from "../home/ResourceGrid"
import Message from "../MapStore2/web/client/components/I18N/Message"
import ShowMore from "../MapStore2/web/client/components/misc/ShowMore"

import Header from "../home/Header"
import { getUser } from "../utils/session.server"

export const loader: LoaderFunction = async ({ request, context, params }) => {
    const user = await getUser(request)
    const maps = await mapsLoader({ request, context, params })
    const featured = await featuredLoader({ request, context, params })
    return {
        ...maps,
        ...featured,
        user: user?.user,
    }
}

export default function Index() {
    const data = useLoaderData()
    if (data?.error) {
        return <span>{data.error}</span>
    }
    return (
        <div id="page-maps" className="page page-maps">
            <Header user={data?.user} />
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
                    <ResourceGrid
                        title={
                            <h3>
                                <span>
                                    <Message msgId="manager.featuredMaps" />
                                </span>
                            </h3>
                        }
                        colProps={{
                            xs: 12,
                            sm: 6,
                            lg: 3,
                            md: 4,
                            className: "ms-map-card-col",
                        }}
                        bottom={
                            <ShowMore
                                total={data.featuredCount}
                                items={data.featured}
                            />
                        }
                        resources={data.featured}
                    />
                </div>
            </div>
            <Contents data={data} />
        </div>
    )
}
