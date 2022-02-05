import { LoaderFunction, redirect, useFetcher, useLoaderData } from "remix"
import HomeDescription from "../MapStore2/web/client/product/plugins/HomeDescription"
import Message from "../MapStore2/web/client/components/I18N/Message"
import PaginationToolbar from "../MapStore2/web/client/components/misc/PaginationToolbar"
import ResourceGrid from "../home/ResourceGrid"
import ContentTabs from "../home/ContentTabs"
import { useEffect, useState } from "react"

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("mapsPage")) ?? 0
    const loadUrl = `https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore/extjs/search/category/MAP/***/thumbnail,details,featured?start=${
        page * 12
    }&limit=12&includeAttributes=true`
    const resp = await fetch(loadUrl)
    const json = await resp.json()
    return {
        mapsCount: json.totalCount,
        maps: json.results.map((map) => ({
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

export default function Index() {
    const data = useLoaderData()
    const [selectedTab, setSelectedTab] = useState(0)
    const [mapsPage, setMapsPage] = useState(0)
    const [maps, setMaps] = useState(data.maps)
    const paginationProps = {
        page: mapsPage,
        pageSize: 12,
        items: data.maps,
        total: data.mapsCount,
        searchText: "",
        loading: false,
    }
    const onSelectMaps = (page: string) => {
        setMapsPage(Number(page))
    }
    const fetcher = useFetcher()
    useEffect(() => {
        fetcher.load(`/?mapsPage=${mapsPage}`)
    }, [mapsPage])
    useEffect(() => {
        if (fetcher.data) {
            setMaps(fetcher.data.maps)
        }
    }, [fetcher.data])
    const items = [
        {
            id: "maps",
            title: "resources.maps.title",
            tool: true,
            total: data.mapsCount,
            plugin: () => (
                <ResourceGrid
                    title={
                        <h3>
                            <span>
                                <Message msgId="maps.title" />
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
                    resources={maps}
                    bottom={
                        <PaginationToolbar
                            {...paginationProps}
                            onSelect={onSelectMaps}
                        />
                    }
                />
            ),
        },
        {
            id: "dashboards",
            title: "Dashboard",
            tool: true,
            plugin: () => <span>Dashboard</span>,
        },
        {
            id: "geostories",
            title: "GeoStory",
            tool: true,
            plugin: () => <span>GeoStory</span>,
        },
    ]
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
            <ContentTabs
                items={items}
                selected={selectedTab}
                onSelect={setSelectedTab}
            />
        </div>
    )
}
