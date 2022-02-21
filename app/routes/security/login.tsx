import { ActionFunction, LoaderFunction, redirect } from "remix"
import { createUserSession, login } from "../../utils/session.server"

export const action: ActionFunction = async ({
    request,
}): Promise<Response | undefined> => {
    const form = await request.formData()

    const username = form.get("username")?.toString() || ""
    const password = form.get("password")?.toString() || ""

    const user = await login({ username, password })
    return createUserSession(user, "/")
}

export let loader: LoaderFunction = async () => {
    return redirect("/")
}
