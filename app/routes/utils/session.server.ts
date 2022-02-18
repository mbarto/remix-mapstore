import { createCookieSessionStorage, redirect } from "remix"
import { base64encode } from "nodejs-base64"

type LoginForm = {
    username: string
    password: string
}

export type Session = {
    sessionToken: {
        access_token: string
        expires: number
        refresh_token: string
        token_type: string
    }
}

type UserAttribute = {
    name: string
    value: string
}

type UserGroup = {
    id: number
    groupName: string
    enabled: boolean
    description: string
}

export type User = {
    User: {
        id: number
        name: string
        role: "GUEST" | "USER" | "ADMIN"
        attribute: UserAttribute[]
        enabled: boolean
        groups: UserGroup[]
    }
}

export type UserData = {
    session?: Session
    user?: User
    error?: string
}

export async function login({ username, password }: LoginForm) {
    const loginUrl =
        "https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore/session/login"

    const sessionResp = await fetch(loginUrl, {
        method: "POST",
        headers: {
            Authorization: "Basic " + base64encode(`${username}:${password}`),
        },
    })
    const session = (await sessionResp.json()) as Session
    const userDetailsUrl =
        "https://dev-mapstore.geosolutionsgroup.com/mapstore/rest/geostore/users/user/details?includeattributes=true"
    const userResp = await fetch(userDetailsUrl, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session.sessionToken.access_token}`,
        },
    })
    const user = (await userResp.json()) as User
    return {
        session,
        user,
    }
}

export async function logout(request: Request) {
    let session = await storage.getSession(request.headers.get("Cookie"))
    return redirect("/", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    })
}

let storage = createCookieSessionStorage({
    cookie: {
        name: "user_session",
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
})

export async function getUser(request: Request): Promise<UserData> {
    let session = await getUserSession(request)
    return session.get("user")
}

export async function getAuthorization(
    request: Request
): Promise<Headers | undefined> {
    const user = await getUser(request)
    if (user?.session?.sessionToken.access_token) {
        return new Headers({
            Authorization: `Bearer ${user?.session?.sessionToken.access_token}`,
        })
    }
    return undefined
}

export function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"))
}

export async function createUserSession(
    user: UserData,
    redirectTo: string = "/"
) {
    let session = await storage.getSession()
    session.set("user", user)
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    })
}
