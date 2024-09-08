import React from 'react'

export const Modal = ({title, message}) => {
  return (
  //   <div className="modal" tabindex="-1">
  //   <div className="modal-dialog">
  //     <div className="modal-content">
  //       <div className="modal-header">
  //         <h5 className="modal-title">{title}</h5>
  //         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  //       </div>
  //       <div className="modal-body">
  //         <p>{message}</p>
  //       </div>
  //       <div className="modal-footer">
  //         <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  <section
   
  style = {{height:200}}
  className='alert alert-info  text-center p-0 m-0 d-flex align-items-center justify-content-center'
 >
  <h1>{title}</h1>
  <br/>
  <p>{message}</p>

 </section>
  )
}
