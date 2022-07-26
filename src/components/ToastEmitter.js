import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import wordleImage from './../icons/wordle.svg';

function ToastEmitter({ show, message, setToastShow }) {

  return (
    <ToastContainer position='bottom-end' className='p-3'>
      {message && 
          <Toast
            bg={message.variant.toLowerCase()}
            key={'toast'}
            show={show}
            delay={3000}
            onClose={() => setToastShow(false)}
            autohide
          >
            <Toast.Header>
              <img
                src={wordleImage}
                className='rounded me-2'
                alt='toast identifier'
                width={30}
                height={30}
              />
              <strong className='me-auto'>{message.title}</strong>
              {/* <small className="text-muted">just now</small> */}
            </Toast.Header>
            <Toast.Body>{message.body}</Toast.Body>
          </Toast>
      }
    </ToastContainer>
  );
}

export default ToastEmitter;
