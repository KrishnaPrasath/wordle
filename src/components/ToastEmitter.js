import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function ToastEmitter({ show, messages, setToastShow }) {

  return (
    <ToastContainer position='bottom-end' className='p-3'>
      {messages.map((message, idx) => {
        return (
          <Toast
            bg={message.variant.toLowerCase()}
            key={idx}
            show={show}
            delay={3000}
            onClose={() => setToastShow(false)}
            autohide
          >
            <Toast.Header>
              <img
                src='holder.js/20x20?text=%20'
                className='rounded me-2'
                alt='toast image'
              />
              <strong className='me-auto'>{message.title}</strong>
              {/* <small className="text-muted">just now</small> */}
            </Toast.Header>
            <Toast.Body>{message.body}</Toast.Body>
          </Toast>
        );
      })}
    </ToastContainer>
  );
}

export default ToastEmitter;
