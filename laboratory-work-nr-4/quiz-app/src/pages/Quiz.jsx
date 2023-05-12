import {useState, useEffect} from 'react'
import Question from '../components/Question'
import api from '../api/axios'
import '../assets/styles/quiz.scss'
import { useParams } from 'react-router-dom';


function Quiz() {

    const {quizId} = useParams();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [quiz, setQuiz] = useState({});


    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = 'cb7603afc4e975b9a1b84af4efecd0f81b1dfc3794a4e76e222f64dda9fb88e4';
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

    useEffect(() => {
        console.log(`Answers: ${answers}`);
        if (quiz.questions && quiz.questions.length > 0) {
            console.log(quiz.questions[0]);
        }
        console.log(quizId);
    })
    
    const handleAnswerChange = (answer) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestion] = answer;
        setAnswers(updatedAnswers);
    };
    
    const handleNextQuestion = () => {
        if (currentQuestion + 1 < quiz.questions.length) {
          setCurrentQuestion(currentQuestion + 1);
        }
    };
    
    const handlePreviousQuestion = () => {
        if (currentQuestion - 1 >= 0) {
          setCurrentQuestion(currentQuestion - 1);
        }
    };
    
    const handleSubmitQuiz = () => {
        let quizScore = 0;
        
        setScore(quizScore);
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
                                />
                            <div className="question-counter">
                                {currentQuestion + 1} / {quiz.questions.length}
                            </div>
                        </div>
    
                        <div className="buttons">
                            <button className="previous-question" onClick={handlePreviousQuestion}>
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.27519 0.725074C6.47519 0.925074 6.57119 1.16674 6.56319 1.45007C6.55519 1.73341 6.45086 1.97507 6.25019 2.17507L3.42519 5.00007L14.5752 5.00007C14.8585 5.00007 15.0962 5.09607 15.2882 5.28807C15.4802 5.48007 15.5759 5.71741 15.5752 6.00007C15.5752 6.28341 15.4792 6.52107 15.2872 6.71307C15.0952 6.90507 14.8579 7.00074 14.5752 7.00007L3.42519 7.00007L6.27519 9.85007C6.47519 10.0501 6.57519 10.2877 6.57519 10.5631C6.57519 10.8384 6.47519 11.0757 6.27519 11.2751C6.07519 11.4751 5.83753 11.5751 5.56219 11.5751C5.28686 11.5751 5.04952 11.4751 4.85019 11.2751L0.275192 6.70007C0.175192 6.60007 0.104191 6.49174 0.062191 6.37507C0.020191 6.25841 -0.000475932 6.13341 0.000190735 6.00007C0.000190735 5.86674 0.0211924 5.74174 0.0631924 5.62507C0.105192 5.50841 0.175859 5.40007 0.275192 5.30007L4.87519 0.700074C5.05853 0.516741 5.28753 0.425073 5.56219 0.425073C5.83686 0.425073 6.07452 0.525074 6.27519 0.725074Z" fill="currentColor"/>
                                </svg>
                                Previous
                            </button>
    
                            <button className="next-question" onClick={handleNextQuestion}>
                                Next
                                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.3 11.275C9.1 11.075 9.004 10.8334 9.012 10.55C9.02 10.2667 9.12434 10.025 9.325 9.82505L12.15 7.00005H1C0.71667 7.00005 0.479004 6.90405 0.287004 6.71205C0.0950036 6.52005 -0.000663206 6.28272 3.4602e-06 6.00005C3.4602e-06 5.71672 0.0960036 5.47905 0.288004 5.28705C0.480004 5.09505 0.717337 4.99938 1 5.00005H12.15L9.3 2.15005C9.1 1.95005 9 1.71238 9 1.43705C9 1.16172 9.1 0.924382 9.3 0.725049C9.5 0.525049 9.73767 0.425049 10.013 0.425049C10.2883 0.425049 10.5257 0.525049 10.725 0.725049L15.3 5.30005C15.4 5.40005 15.471 5.50838 15.513 5.62505C15.555 5.74172 15.5757 5.86672 15.575 6.00005C15.575 6.13338 15.554 6.25838 15.512 6.37505C15.47 6.49172 15.3993 6.60005 15.3 6.70005L10.7 11.3C10.5167 11.4834 10.2877 11.575 10.013 11.575C9.73834 11.575 9.50067 11.475 9.3 11.275Z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
    
                    </div>
                </div>
            </div>
        )
      }
}
  

export default Quiz