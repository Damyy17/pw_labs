import {useState} from "react";
import "../assets/styles/login.scss"
function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
    };

    return (
        <>
            <div className="login-container">
                <div className="login-container-information">
                    <p className="title">
                        Introduce you to make some magic quizzes
                    </p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Name
                            <br />
                            <input
                            placeholder="Place your name here"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Surname
                            <br />
                            <input
                            placeholder="Place your surname here"
                            type="username"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            />
                        </label>
                        <br />
                        <button className="login-button">
                            Log In
                        </button>
                    </form>
                    
                </div>
            </div>
        </>
    )
}

export default Login