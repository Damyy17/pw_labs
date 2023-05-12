import { useState } from 'react';
import '../assets/styles/question.scss';
import PropTypes from 'prop-types';

function Question({ question}) {
  const [active, setActive] = useState(false);

  const handleSetActive = (index) => {
    setActive(index);
  };

  return (
    <div className='question-container'>
      <p className='question-title'>{question.question}</p>

      <div className="line"></div>

      <div className="grid-answers">
        {question.answers.map((option, index) => (
          <div className={`question-label ${index === active ? 'active' : ''}`} onClick={() => handleSetActive(index)} key={index}>
            <p className="answer">{option}</p>
            <div className={`circle-check ${index === active ? 'active' : ''}`} onClick={() => handleSetActive(index)}></div>
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
    }).isRequired
};

export default Question;
