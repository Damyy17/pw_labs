import {useState} from 'react'
import "../assets/styles/register.scss"

export default function Register() {

    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Hello, good to see you again, ${username}`);
    };

    return (
        <div>
            <div className="register-container">
                    <div className="register-container-information">
                        <p className="title">
                            Register for Quizzario
                        </p>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Username
                                <br />
                                <input
                                placeholder="Enter your usename"
                                type="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                            </label>
                            <br />
                            <label>
                                Password
                                <br />
                                <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                />
                            </label>
                            <br />
                            <button className="register-button">
                                Register
                            </button>
                        </form>
                        
                    </div>
                </div>    
        </div>
    )
}
