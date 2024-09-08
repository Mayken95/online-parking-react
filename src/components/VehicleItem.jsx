import React from 'react';

export const VehicleItem = ({ vehicle, onDelete }) => {
  return (
    <tr>
      <td>{vehicle.plate}</td>
      <td>{vehicle.color}</td>
      <td>
        <button 
          className="btn btn-danger" 
          onClick={() => onDelete(vehicle.id)}
        >
          Borrar
        </button>
      </td>
    </tr>
  );
};
