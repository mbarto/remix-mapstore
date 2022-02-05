import {
    Links,
    LinksFunction,
    LiveReload,
    LoaderFunction,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "remix"
import type { MetaFunction } from "remix"
import Localized from "./MapStore2/web/client/components/I18N/Localized"

export const meta: MetaFunction = () => {
    return { title: "MapStore Remixed" }
}

import mapStoreLinkUrl from "~/styles/mapstore.css"
import { useEffect, useState } from "react"

export let links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: mapStoreLinkUrl }]
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url)

    const [language] = request.headers.get("Accept-Language").split(",")
    const i18n = await (
        await fetch(
            `${url.protocol}://${url.host}/translations/data.${language}.json`
        )
    ).json()

    return {
        i18n,
    }
}

export default function App() {
    const [inited, setInited] = useState(typeof document === "undefined")
    const data = useLoaderData()
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
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body className="ms2" data-ms2-container="ms2">
                <div id="container">
                    <div className="fill">
                        <div className="error-container">
                            {inited ? (
                                <Localized
                                    locale={data.i18n.locale}
                                    messages={data.i18n.messages}
                                >
                                    <Outlet />
                                </Localized>
                            ) : null}
                        </div>
                    </div>
                </div>
                <ScrollRestoration />
                <Scripts />
                {process.env.NODE_ENV === "development" && <LiveReload />}
            </body>
        </html>
    )
}
