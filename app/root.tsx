import {
    Link,
    Links,
    LinksFunction,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "remix"
import type { MetaFunction } from "remix"

export const meta: MetaFunction = () => {
    return { title: "MapStore Remixed" }
}

import mapStoreLinkUrl from "~/styles/mapstore.css"

export let links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: mapStoreLinkUrl }]
}

export default function App() {
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
            <body className="bg-black text-white ms2" data-ms2-container="ms2">
                <div className="flex m-5 mt-10 text-gray-400 text-lg w-3/4">
                    <div className="p-5 grow hover:text-white">
                        <Link to="/">Home</Link>
                    </div>
                </div>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                {process.env.NODE_ENV === "development" && <LiveReload />}
            </body>
        </html>
    )
}
