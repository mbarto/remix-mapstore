import React, { useRef, useState } from "react"
import OmniBar from "./OmniBar"
import UserMenu from "../MapStore2/web/client/components/security/UserMenu"
import LoginModal from "../MapStore2/web/client/components/security/modals/LoginModal"
import { Form, useSubmit } from "remix"
import { User } from "~/utils/session.server"

type HeaderProps = {
    user?: User
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const [showLogin, setShowLogin] = useState(false)
    const loginFormRef = useRef<HTMLFormElement>(null)
    const logoutFormRef = useRef<HTMLFormElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const login = (username: string, password: string) => {
        setShowLogin(false)
        if (
            usernameRef.current &&
            passwordRef.current &&
            loginFormRef.current
        ) {
            usernameRef.current.value = username
            passwordRef.current.value = password
            loginFormRef.current.submit()
        }
    }
    const logout = () => {
        if (logoutFormRef.current) {
            logoutFormRef.current.submit()
        }
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
                <>
                    <Form
                        action="/security/login"
                        reloadDocument
                        ref={loginFormRef}
                        method="post"
                    >
                        <input
                            type="hidden"
                            name="username"
                            ref={usernameRef}
                        />
                        <input
                            type="hidden"
                            name="password"
                            ref={passwordRef}
                        />
                    </Form>

                    <LoginModal
                        onClose={() => setShowLogin(false)}
                        show
                        onSubmit={login}
                    />
                </>
            )}
            <Form
                action="/security/logout"
                reloadDocument
                ref={logoutFormRef}
                method="post"
            ></Form>
        </>
    )
}

export default Header
