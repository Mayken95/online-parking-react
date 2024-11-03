export const ErrorModal = ({ handleCloseError, message }) => {
    return (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Error en la Reservación</h5>
              <button type="button" className="btn-close" onClick={handleCloseError}></button>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleCloseError}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  