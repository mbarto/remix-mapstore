import { useEffect, useState } from "react"
import ContentTabs from "./ContentTabs"
import Message from "../MapStore2/web/client/components/I18N/Message"
import PaginationToolbar from "../MapStore2/web/client/components/misc/PaginationToolbar"
import ResourceGrid from "./ResourceGrid"
import { useFetcher } from "remix"

export type ContentsType = {
    maps: object[]
    mapsCount: number
    dashboardsCount: number
    dashboards: object[]
}

type ContentsProptype = {
    data: ContentsType
}

const Contents: React.FC<ContentsProptype> = ({ data }) => {
    const [selectedTab, setSelectedTab] = useState(0)
    const [firstRender, setFirstRender] = useState(true)

    const [mapsPage, setMapsPage] = useState(0)
    const [dashboardsPage, setDashboardsPage] = useState(0)
    const [geostoriesPage, setGeostoriesPage] = useState(0)

    const [maps, setMaps] = useState({
        count: data.mapsCount,
        items: data.maps,
    })
    const [dashboards, setDashboards] = useState({
        items: [],
        count: undefined,
    })
    const [geostories, setGeostories] = useState({
        items: [],
        count: undefined,
    })
    const fetcher = useFetcher()
    useEffect(() => {
        if (firstRender) {
            setFirstRender(false)
        } else {
            fetcher.load(`/?mapsPage=${mapsPage}`)
        }
    }, [mapsPage])
    useEffect(() => {
        if (fetcher?.data?.maps) {
            setMaps({
                items: fetcher.data.maps,
                count: fetcher.data.mapsCount,
            })
        }
        if (fetcher?.data?.dashboards) {
            setDashboards({
                items: fetcher.data.dashboards,
                count: fetcher.data.dashboardsCount,
            })
        }
        if (fetcher?.data?.geostories) {
            setGeostories({
                items: fetcher.data.geostories,
                count: fetcher.data.geostoriesCount,
            })
        }
    }, [fetcher.data])
    useEffect(() => {
        if (selectedTab === 1) {
            fetcher.load(`/?dashboardsPage=${dashboardsPage}`)
        }
        if (selectedTab === 2) {
            fetcher.load(`/?geostoriesPage=${geostoriesPage}`)
        }
    }, [selectedTab, dashboardsPage, geostoriesPage])
    const mapsPaginationProps = {
        page: mapsPage,
        pageSize: 12,
        items: maps.items,
        total: maps.count,
        searchText: "",
        loading: false,
    }
    const dashboardsPaginationProps = {
        page: dashboardsPage,
        pageSize: 5,
        items: dashboards.items,
        total: dashboards.count,
        searchText: "",
        loading: false,
    }
    const geostoriesPaginationProps = {
        page: geostoriesPage,
        pageSize: 5,
        items: geostories.items,
        total: geostories.count,
        searchText: "",
        loading: false,
    }
    const onSelectMaps = (page: string) => {
        setMapsPage(Number(page))
    }
    const onSelectDashboards = (page: string) => {
        setDashboardsPage(Number(page))
    }
    const onSelectGeostories = (page: string) => {
        setGeostoriesPage(Number(page))
    }
    const items = [
        {
            id: "maps",
            title: "resources.maps.title",
            tool: true,
            total: maps.count,
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
                    resources={maps.items}
                    bottom={
                        <PaginationToolbar
                            {...mapsPaginationProps}
                            onSelect={onSelectMaps}
                        />
                    }
                />
            ),
        },
        {
            id: "dashboards",
            title: "resources.dashboards.title",
            tool: true,
            total: dashboards.count,
            plugin: () => (
                <ResourceGrid
                    title={
                        <h3>
                            <span>
                                <Message msgId="resources.dashboards.titleNoCount" />
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
                    resources={dashboards.items}
                    bottom={
                        <PaginationToolbar
                            {...dashboardsPaginationProps}
                            onSelect={onSelectDashboards}
                        />
                    }
                />
            ),
        },
        {
            id: "geostories",
            title: "resources.geostories.title",
            tool: true,
            total: geostories.count,
            plugin: () => (
                <ResourceGrid
                    title={
                        <h3>
                            <span>
                                <Message msgId="resources.geostories.titleNoCount" />
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
                    resources={geostories.items}
                    bottom={
                        <PaginationToolbar
                            {...geostoriesPaginationProps}
                            onSelect={onSelectGeostories}
                        />
                    }
                />
            ),
        },
    ]
    return (
        <ContentTabs
            items={items}
            selected={selectedTab}
            onSelect={setSelectedTab}
        />
    )
}

export default Contents
