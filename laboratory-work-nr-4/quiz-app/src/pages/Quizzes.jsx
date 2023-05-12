import '../assets/styles/quizzes.scss'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'



function Quizzes() {
    const randomCardColor = ['#73A9AD', '#FF8484', '#8C7284']
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const token = 'cb7603afc4e975b9a1b84af4efecd0f81b1dfc3794a4e76e222f64dda9fb88e4';
                const response = await api.get('/quizzes', {
                    headers:{
                        'X-Access-Token': token
                    }
                });
                setQuizzes(response.data)
            } catch (error) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }

        fetchQuizzes();
    }, [])

    const handleShowQuiz = (quizId) => {
        const selectedQuiz = quizzes.find((quiz) => quiz.id === quizId);
        if (selectedQuiz) {
            navigate(`/quizzes/${quizId}`);
        } else {
            console.log(`Quiz with ID ${quizId} not found`);
        }
    } 

    return(
        <>
            <div className="quizzes-container">
                {quizzes.map((quiz, index) => (
                    <div className="quiz-card"  key={index} style={{
                        backgroundColor:`${randomCardColor[Math.floor(Math.random()*randomCardColor.length)]}`
                    }}>
                        <p className="quiz-card-title">
                        {quiz.title}
                        </p>
                        <span className="quiz-score">
                            Number of Questions: {quiz.questions_count}
                        </span>
                        <button onClick={() => handleShowQuiz(quiz.id)}>
                            Start the Quiz
                        </button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Quizzes