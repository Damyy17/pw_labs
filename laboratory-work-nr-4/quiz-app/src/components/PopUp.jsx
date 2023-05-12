import {React, useState} from 'react'
import Popup from 'reactjs-popup';

function PopUp() {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <div>
      <button type="button" className="button" onClick={() => setOpen(o => !o)}>
        Controlled Popup
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <a className="close" onClick={closeModal}>
            &times;
          </a>
          Please select a correct answer! It cant be a questino with no correct answers.
        </div>
      </Popup>
    </div>
  );
}

export default PopUp