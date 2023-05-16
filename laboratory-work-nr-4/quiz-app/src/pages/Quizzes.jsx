import '../assets/styles/quizzes.scss'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'



function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const [sortOrderByTitle, setSortOrderByTitle] = useState('asc');
    const [sortOrderByNumber, setSortOrderByNumber] = useState('asc');

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


    const handleSortByTitle = () => {
        const sortedQuizzes = [...quizzes];
        sortedQuizzes.sort((a, b) => {
            if (sortOrderByTitle === 'asc') {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
        setQuizzes(sortedQuizzes);
        setSortOrderByTitle(sortOrderByTitle === 'asc' ? 'desc' : 'asc');
    }

    const handleSortByQuestionsCount = () => {
        const sortedQuizzes = [...quizzes];
        sortedQuizzes.sort((a, b) => {
          if (sortOrderByNumber === 'asc') {
            return a.questions_count - b.questions_count;
          } else {
            return b.questions_count - a.questions_count;
          }
        });
        setQuizzes(sortedQuizzes);
        setSortOrderByNumber(sortOrderByNumber === 'asc' ? 'desc' : 'asc');
      }

    return(
        <>
            <div className="quizzes-container">
                <div className="quizzes-instruments-bar">
                    <p className='quiz-number-title'>
                        Quizzes:
                    </p>
                    <div className='number-quizzes'>
                        {quizzes.length}
                    </div>
                    <p className="sorting-label">Sorting:</p>
                    <button className="sort-button-title" onClick={handleSortByTitle}>
                        ByTitle {sortOrderByTitle === 'asc' ? '▲' : '▼'}
                    </button>

                    <button className="sort-button-number" onClick={handleSortByQuestionsCount}>
                        ByNumberOfQuestions {sortOrderByNumber === 'asc' ? '▲' : '▼'}
                    </button>
                </div>
                <div className="quizzes">
                    {quizzes.map((quiz, index) => (
                            <div className="quiz-card"  key={index} onClick={() => handleShowQuiz(quiz.id)}>
                                <div className="quiz-card-container">
                                    <div className="title-description-logo">
                                        <div className="title-description">
                                            <p className="quiz-card-title">
                                                {quiz.title}
                                            </p>
                                            <p className="description">
                                            Are u ready to make 
                                            this fabulous quiz?
                                            </p>
                                            <p className="number-of-question">
                                                Number of Questions: {quiz.questions_count}
                                            </p>
                                        </div>
                                        <div className="logo-card">
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21.4945 26.4532C20.7586 25.7173 19.6426 25.5586 18.6471 25.8621C17.644 26.168 16.5793 26.3325 15.4761 26.3325C9.48031 26.3325 4.61974 21.4719 4.61974 15.4761C4.61974 9.48031 9.48031 4.61974 15.4761 4.61974C21.4719 4.61974 26.3325 9.48031 26.3325 15.4761C26.3325 16.4849 26.1949 17.4615 25.9375 18.3883C25.6645 19.371 25.8352 20.4584 26.5564 21.1796C27.6819 22.3051 29.5752 22.0634 30.0979 20.5599C30.6514 18.9676 30.9522 17.257 30.9522 15.4761C30.9522 6.9289 24.0233 0 15.4761 0C6.9289 0 0 6.9289 0 15.4761C0 24.0233 6.9289 30.9522 15.4761 30.9522C17.3918 30.9522 19.2262 30.6042 20.9195 29.9678C22.3836 29.4176 22.6005 27.5592 21.4945 26.4532Z" fill="#755E6E"/>
                                                <path d="M21.4945 26.4532C20.7586 25.7173 19.6426 25.5586 18.6471 25.8621C17.644 26.168 16.5793 26.3325 15.4761 26.3325C9.48031 26.3325 4.61974 21.4719 4.61974 15.4761C4.61974 9.48031 9.48031 4.61974 15.4761 4.61974C21.4719 4.61974 26.3325 9.48031 26.3325 15.4761C26.3325 16.4849 26.1949 17.4615 25.9375 18.3883C25.6645 19.371 25.8352 20.4584 26.5564 21.1796C27.6819 22.3051 29.5752 22.0634 30.0979 20.5599C30.6514 18.9676 30.9522 17.257 30.9522 15.4761C30.9522 6.9289 24.0233 0 15.4761 0C6.9289 0 0 6.9289 0 15.4761C0 24.0233 6.9289 30.9522 15.4761 30.9522C17.3918 30.9522 19.2262 30.6042 20.9195 29.9678C22.3836 29.4176 22.6005 27.5592 21.4945 26.4532Z" />
                                                <rect x="19.4933" y="15.4761" width="17.687" height="5.3061" rx="2" transform="rotate(45 19.4933 15.4761)" fill="#755E6E"/>
                                                <rect x="19.4933" y="15.4761" width="17.687" height="5.3061" rx="2" transform="rotate(45 19.4933 15.4761)" />
                                            </svg>
                                        </div>
                                    </div>

                                    <button className='start-quiz' onClick={() => handleShowQuiz(quiz.id)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.3 17.2748C13.1 17.0748 13.004 16.8331 13.012 16.5498C13.02 16.2665 13.1243 16.0248 13.325 15.8248L16.15 12.9998H5C4.71667 12.9998 4.479 12.9038 4.287 12.7118C4.095 12.5198 3.99934 12.2825 4 11.9998C4 11.7165 4.096 11.4788 4.288 11.2868C4.48 11.0948 4.71734 10.9991 5 10.9998H16.15L13.3 8.1498C13.1 7.9498 13 7.71214 13 7.4368C13 7.16147 13.1 6.92414 13.3 6.7248C13.5 6.5248 13.7377 6.4248 14.013 6.4248C14.2883 6.4248 14.5257 6.5248 14.725 6.7248L19.3 11.2998C19.4 11.3998 19.471 11.5081 19.513 11.6248C19.555 11.7415 19.5757 11.8665 19.575 11.9998C19.575 12.1331 19.554 12.2581 19.512 12.3748C19.47 12.4915 19.3993 12.5998 19.3 12.6998L14.7 17.2998C14.5167 17.4831 14.2877 17.5748 14.013 17.5748C13.7383 17.5748 13.5007 17.4748 13.3 17.2748Z" fill="#FDFDFD"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}

export default Quizzes