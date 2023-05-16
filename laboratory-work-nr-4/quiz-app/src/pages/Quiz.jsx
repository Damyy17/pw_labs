import {useState, useEffect} from 'react'
import Question from '../components/Question'
import api from '../api/axios'
import '../assets/styles/quiz.scss'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';


function Quiz() {

    const {quizId} = useParams();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [quiz, setQuiz] = useState({});
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [modalOpen, setModalOpen] = useState(false);
    const userId = storedUser.id;
    const token = 'cb7603afc4e975b9a1b84af4efecd0f81b1dfc3794a4e76e222f64dda9fb88e4';

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await api.get(`/quizzes/${quizId}`, {
                    headers:{
                        'X-Access-Token': token
                    }
                });
                setQuiz(response.data);
                setAnswers(Array(response.data.questions.length).fill(''));
            } catch (error) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        }

        fetchQuiz();
    }, [quizId])
    
    const handleAnswerChange = (answer) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestion] = answer;
        setAnswers(updatedAnswers);
    };
    
    const handleNextQuestion = () => {
        if (currentQuestion + 1 < quiz.questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleOpenModal();
            console.log("Quiz ended" + modalOpen);
        }
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
        navigate("/quizzes");
    };
    

    const handleSubmitAnswer = async () => {
        try {
            const response = await api.post(
                `/quizzes/${quiz.id}/submit`,
                {
                    data: {
                        question_id: quiz.questions[currentQuestion].id,
                        answer: answers[currentQuestion],
                        user_id: userId
                    },
                },
                {
                    headers:{
                        'X-Access-Token': token
                    }
                }
            );
            const correct = response.data.correct;   
            if (correct === true) {
                setScore(score => score + 1);
            }
            handleNextQuestion();
        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
        }
    }

    const getMessageByScore = (score, totalQuestions) => {
        const percentage = (score / totalQuestions) * 100;
      
        switch (true) {
          case percentage >= 90:
            return "Congratulations! You did an excellent job!";
          case percentage >= 70:
            return "Great job! You performed well.";
          case percentage >= 40:
            return "Nice try! I know you can do better.";
          default:
            return "Keep practicing. You'll improve!";
        }
      };

    if (!quiz || !quiz.questions) {
        return <div>Loading quiz...</div>;
    } else {
        return (
            <div>
                <div className="quiz-container">
                    <div className="quiz-title-question-answers">
                        <div className="question-container">
                            <Question
                                question={quiz.questions[currentQuestion]}
                                onAnswerChange={handleAnswerChange}
                                />
                            <div className="question-counter">
                                {currentQuestion + 1} / {quiz.questions.length}
                            </div>
                        </div>
    
                        <div className="buttons">
                            <button className="next-question" onClick={handleSubmitAnswer}>
                                Next Question
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.3 11.275C9.1 11.075 9.004 10.8334 9.012 10.55C9.02 10.2667 9.12434 10.025 9.325 9.82505L12.15 7.00005H1C0.71667 7.00005 0.479004 6.90405 0.287004 6.71205C0.0950036 6.52005 -0.000663206 6.28272 3.4602e-06 6.00005C3.4602e-06 5.71672 0.0960036 5.47905 0.288004 5.28705C0.480004 5.09505 0.717337 4.99938 1 5.00005H12.15L9.3 2.15005C9.1 1.95005 9 1.71238 9 1.43705C9 1.16172 9.1 0.924382 9.3 0.725049C9.5 0.525049 9.73767 0.425049 10.013 0.425049C10.2883 0.425049 10.5257 0.525049 10.725 0.725049L15.3 5.30005C15.4 5.40005 15.471 5.50838 15.513 5.62505C15.555 5.74172 15.5757 5.86672 15.575 6.00005C15.575 6.13338 15.554 6.25838 15.512 6.37505C15.47 6.49172 15.3993 6.60005 15.3 6.70005L10.7 11.3C10.5167 11.4834 10.2877 11.575 10.013 11.575C9.73834 11.575 9.50067 11.475 9.3 11.275Z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
    
                    </div>
                </div>


                <Popup
                    open={modalOpen}
                    closeOnDocumentClick 
                    onClose={handleCloseModal}
                >
                    <div className="modal">
                        <button className="close" onClick={handleCloseModal}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2L12 12M2 12L12 2" stroke="#FDFDFD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                        </button>
                        <div className="content">
                            <p>{getMessageByScore(score, quiz.questions.length)}</p>
                            <p className='score'>Your Score: {score} / {quiz.questions.length}</p>
                        </div>
                    </div>
                </Popup>
            </div>
        )
    }
}
  

export default Quiz