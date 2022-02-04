import { useEffect, useState } from "react"
import { LoaderFunction, useLoaderData } from "remix"
import ResourceGrid from "../home/ResourceGrid"
import Localized from "../MapStore2/web/client/components/I18N/Localized"

export const loader: LoaderFunction = async ({ request }) => {
    const [language] = request.headers.get("Accept-Language").split(",")
    const i18n = await (
        await fetch(`http://localhost:3000/translations/data.${language}.json`)
    ).json()
    const loadUrl = `https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore/extjs/search/category/MAP/***/thumbnail,details,featured?start=0&limit=12&includeAttributes=true`
    const resp = await fetch(loadUrl)
    const json = await resp.json()
    return {
        i18n,
        resources: json.results.map((map) => ({
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
    const [inited, setInited] = useState(typeof document === "undefined")
    useEffect(() => {
        const { addLocaleData } = require("react-intl")

        const en = require("react-intl/locale-data/en")
        const it = require("react-intl/locale-data/it")
        const fr = require("react-intl/locale-data/fr")
        const de = require("react-intl/locale-data/de")
        const es = require("react-intl/locale-data/es")
        const nl = require("react-intl/locale-data/nl")
        const zh = require("react-intl/locale-data/zh")
        const hr = require("react-intl/locale-data/hr")
        const pt = require("react-intl/locale-data/pt")
        const vi = require("react-intl/locale-data/vi")
        const fi = require("react-intl/locale-data/fi")
        const sv = require("react-intl/locale-data/sv")
        const sk = require("react-intl/locale-data/sk")

        addLocaleData([
            ...en,
            ...it,
            ...fr,
            ...de,
            ...es,
            ...nl,
            ...zh,
            ...hr,
            ...pt,
            ...vi,
            ...fi,
            ...sv,
            ...sk,
        ])
        setInited(true)
    }, [])
    return inited ? (
        <div className="page-maps">
            <Localized locale={data.i18n.locale} messages={data.i18n.messages}>
                <ResourceGrid
                    title={
                        <h3>
                            <span>Mappe</span>
                        </h3>
                    }
                    colProps={{
                        xs: 12,
                        sm: 6,
                        lg: 3,
                        md: 4,
                        className: "ms-map-card-col",
                    }}
                    resources={data.resources}
                />
            </Localized>
        </div>
    ) : (
        <div className="page-maps">
            <ResourceGrid
                title={
                    <h3>
                        <span>Mappe</span>
                    </h3>
                }
                colProps={{
                    xs: 12,
                    sm: 6,
                    lg: 3,
                    md: 4,
                    className: "ms-map-card-col",
                }}
                resources={data.resources}
            />
        </div>
    )
}
