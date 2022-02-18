import React, { useState } from "react"
import OmniBar from "./OmniBar"
import UserMenu from "../MapStore2/web/client/components/security/UserMenu"
import LoginModal from "../MapStore2/web/client/components/security/modals/LoginModal"
import { useSubmit } from "remix"
import { User } from "~/routes/utils/session.server"

type HeaderProps = {
    user?: User
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const [showLogin, setShowLogin] = useState(false)
    const submit = useSubmit()
    const login = (username: string, password: string) => {
        setShowLogin(false)
        submit(
            new URLSearchParams([
                ["action", "login"],
                ["username", username],
                ["password", password],
            ]),
            { method: "post", action: "/?index" }
        )
    }
    const logout = () => {
        submit(new URLSearchParams([["action", "logout"]]), {
            method: "post",
            action: "/?index",
        })
    }
    const items = [
        {
            id: "login",
            tool: () => (
                <UserMenu
                    user={user?.User}
                    nav={false}
                    renderButtonText={false}
                    bsStyle="primary"
                    className="square-button"
                    onShowLogin={() => setShowLogin(true)}
                    onLogout={logout}
                    renderUnsavedMapChangesDialog={false}
                    onCloseUnsavedDialog={() => {}}
                />
            ),
        },
    ]
    return (
        <>
            <OmniBar className="navbar shadow navbar-home" items={items} />
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    show
                    onSubmit={login}
                />
            )}
        </>
    )
}

export default Header
