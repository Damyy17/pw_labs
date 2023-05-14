import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/login.scss"
import api from "../api/axios";
function Login() {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const token = 'cb7603afc4e975b9a1b84af4efecd0f81b1dfc3794a4e76e222f64dda9fb88e4';
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(name, surname);
            const user = response.data; 
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/home");
        } catch (error) {
            console.log(error.response);
        }
      };

      const loginUser = async (name, surname) => {
            const response = await api.post(
                "/users",
                {
                    data: {
                        name: name,
                        surname: surname,
                    },
                },
                {
                    headers: {
                        "X-Access-Token": token,
                    },
                }
            );
            return response;
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
                                type="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>

                        <br />

                        <label>
                            Surname
                            <br />
                            <input
                                placeholder="Place your surname here"
                                type="name"
                                value={surname}
                                onChange={e => setSurname(e.target.value)}
                            />
                        </label>

                        <br />

                        <button type='submit' className="login-button">
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login