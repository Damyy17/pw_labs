import {useEffect, useState} from "react";
import "../assets/styles/nav.scss"
import logo from '../assets/icons/logo.png'
import api from '../api/axios'
import {
    NavLink,
    useNavigate
 } from "react-router-dom";

function Nav() {
    const setActive = ({ isActive }) => isActive ? "active" : "";
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const playAudio = () => {
          const audio = new Audio('/src/assets/music/quiz_music.mp3');
          audio.loop = true;
          audio.play().catch((error) => {
            console.log('Autoplay prevented:', error);
          });
          return audio;
        };
      
        const audio = playAudio();
        return () => {
          audio.pause();
        };
      }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate('/login'); 
        }
      }, [navigate]);

    const handleLogOut = async () => {
        const token = 'cb7603afc4e975b9a1b84af4efecd0f81b1dfc3794a4e76e222f64dda9fb88e4';
        try {
            const response = await api.delete(
                `/users/${user.id}`,
                {
                    headers: {
                        'X-Access-Token': token,
                    }
                }
            );
            console.log(response.data)
            console.log(response.data.status)
            if (response.status === 200) {
                localStorage.removeItem('user');
                navigate("/login");
            }
        } catch(error){
            console.log(error.response)
        }
    }

    if (!user) {
        return(
            <div>Loading...</div>
        )
    }

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
                <div className="user-button">
                    <p className="name-username">
                        User: {user.name +  ' ' + user.surname}
                    </p>

                    <button className="logout-button" onClick={handleLogOut}>
                        Log Out
                    </button>
                </div>
            </div>
        </>
    )
}

export default Nav