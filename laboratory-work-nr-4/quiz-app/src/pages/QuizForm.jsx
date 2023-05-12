import {useState} from 'react'
import '../assets/styles/quizform.scss'
import PopUp from '../components/PopUp';

function QuizForm() {
  const [active, setActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState({
    title: '',
    answers: ['', '', '', ''],
    correctAnswer: ''
  });

  const handleQuestionTitleChange = (event) => {
    setCurrentQuestion({
      ...currentQuestion,
      title: event.target.value
    });
  };

  const handleAnswerTitleChange = (event, index) => {
    const newAnswers = [...currentQuestion.answers];
    newAnswers[index] = event.target.value;

    setCurrentQuestion({
      ...currentQuestion,
      answers: newAnswers
    });
  };

  const handleSetActive = (index) => {
    setActive(index);
    setCurrentQuestion({
      ...currentQuestion,
      correctAnswer: currentQuestion.answers[index]
    });
  };

  const handleAddQuestion = () => {
    if (currentQuestion.correctAnswer === '') {
      PopUp
    } else {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        title: '',
        answers: ['', '', '', ''],
        correctAnswer: ''
      });
      setActive(false);
    }
  };

  const handleSaveQuiz = () => {
    // Send data to backend for saving quiz
  };

  return (
    <div className='quizform-container' >
      <div className='title-question-answers'>
        <div className='title-question-answers-absolute'>
          <label className='quiz-title'>
            <input className='quiz-title-input' placeholder='Quiz title' type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          {questions.map((question, index) => (
            <div className='added-question' key={index}>
              <label className='quiz-title-label'>
                <input className='question-title' type="text" value={question.title} disabled />
              </label>
              <div className="grid-answers">
                {question.answers.map((answer, answerIndex) => (
                  <label className='question-label' key={answerIndex}>
                    <input type="text" value={answer} disabled />
                    <div className={`circle-check ${answer === questions[index].correctAnswer ? 'active' : ''}`}></div>
                    {/* {console.log(questions[index].correctAnswer)} */}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='question-answers-buttons-container'>
        <label className='quiz-title-label'>
          <input className='question-title' placeholder='Add the question...' type="text" value={currentQuestion.title} onChange={handleQuestionTitleChange} />
        </label>

        <div className="grid-answers">
          {currentQuestion.answers.map((answer, index) => (
            <div className='question-button-check' key={index}>
              <label className='answer-label'>
                <input className='answer-input' placeholder={'Answer ' + (index + 1) } type="text" value={answer} onChange={(event) => handleAnswerTitleChange(event, index)} />
                <div className={`circle-check ${index === active ? 'active' : ''}`} onClick={() => handleSetActive(index)}>
                </div>
              </label>
            </div>
          ))}
        </div>
        
        <button className='add-question' type="button" onClick={handleAddQuestion}>Add Question</button>
      </div>

      <button className='save-quiz' type="button" onClick={handleSaveQuiz}>Save Quiz</button>
    </div>
  );
}

export default QuizForm