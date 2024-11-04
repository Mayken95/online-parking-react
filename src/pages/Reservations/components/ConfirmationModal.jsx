
export const ConfirmationModal = ({handleCloseModal,handleDelete}) => {
  return (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Confirmación</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                <p>¿Estás seguro de que deseas cancelar esta reserva?</p>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cerrar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Cancelar Reserva
                </button>
                </div>
            </div>
            </div>
        </div>
  )
}
