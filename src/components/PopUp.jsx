import React from 'react'
import '../assets/styles/Modal.css';
export const PopUp = ({message, closeModal}) => {
  return (
    <div className="modal-overlay">
    <div className="modal-content">
      <h3>{message}</h3>
      <button className="btn btn-secondary" onClick={closeModal}>
        Cerrar
      </button>
    </div>
    </div>
  )
}
