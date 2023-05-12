import {React, useEffect} from "react";
import "../assets/styles/nav.scss"
import logo from '../assets/icons/logo.png'
import {   
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    NavLink, } from "react-router-dom";

function Nav() {
    const setActive = ({isActive}) => isActive ? "active" : "";
    
    return(
        <>
            <div className="navbar-container">
                <div className="logo-name">
                <img src={logo} alt="" /> 
                <p className="logo-title">
                    Quizzario
                </p>
                </div>
                <ul>
                    <li>
                        <NavLink to={"home"}
                        className={`link ${setActive}`}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"quiz-creation"}
                        className={`link ${setActive}`}
                        > 
                            Create a Quiz
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={"quizzes"}
                        className={`link ${setActive}`}
                        >
                            Quizzes
                        </NavLink>
                    </li>
                </ul>
                <button className="login-account">
                    <NavLink to={"login"}>
                        Log Out
                    </NavLink>
                </button>
            </div>
        </>
    )
}

export default Nav