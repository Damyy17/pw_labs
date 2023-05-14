import { useState } from 'react';
import '../assets/styles/question.scss';
import PropTypes from 'prop-types';

function Question({ question, onAnswerChange}) {
  const [activeAnswer, setActiveAnswer] = useState('');
  const handleSetActive = (answer) => {
    setActiveAnswer(answer);
    onAnswerChange(answer)
  };

  return (
    <div className='question-container'>
      <p className='question-title'>{question.question}</p>

      <div className="line"></div>

      <div className="grid-answers">
        {question.answers.map((option) => (
          <div className={`question-label ${option === activeAnswer ? 'active' : ''}`} onClick={() => handleSetActive(option)} key={option}>
            <p className="answer">{option}</p>
            <div className={`circle-check ${option === activeAnswer ? 'active' : ''}`} onClick={() => handleSetActive(option)}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

Question.propTypes = {
    question: PropTypes.shape({
        id: PropTypes.number.isRequired,
        question: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    onAnswerChange: PropTypes.func.isRequired
};

export default Question;
