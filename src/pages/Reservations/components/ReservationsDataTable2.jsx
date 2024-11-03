import  { useState, useEffect, useRef } from 'react';
import React from 'react';
import DataTable from 'react-data-table-component';
import '../../../assets/styles/global.css';

export const ReservationsDataTable2 =  ({ data, onDelete, handleOpenModal }) => {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState(data);
  
    // Columnas de la tabla
    const columns = [
      { name: 'Placa', selector: row => row.vehicle.plate , sortable: true},
      { name: 'Parqueo', selector: row => row.parking?.name , sortable: true},
      { name: 'Fecha', selector: row => row.schedule_time?.date , sortable: true },
      { name: 'Hora de inicio', selector: row => row.schedule_time?.start_time , sortable: true},
      { name: 'Hora de finalización', selector: row => row.schedule_time?.end_time , sortable: true},
      {
        name: 'Estado',
        selector: row => row.state === "A" ? "Activa" : (row.state === "P" ? "Pagada" : "Cancelada"),
      },
      {
        name: 'Acciones',
        cell: row => (row.state !== "C" && row.state !== "P") && (
          <button 
            className="btn btn-danger" 
            onClick={() => handleOpenModal(row.id)}
          >
            Cancelar Reserva
          </button>
        ),
      },
    ];
  
    // Función para manejar el cambio en el campo de búsqueda
    const handleSearch = (event) => {
      const searchTerm = event.target.value.toLowerCase();
      setSearch(searchTerm);
  
      const filtered = data.filter(item => 
        item.vehicle?.plate.toLowerCase().includes(searchTerm) ||
        item.parking?.name.toLowerCase().includes(searchTerm) ||
        item.schedule_time?.date.includes(searchTerm)
      );
      
      setFilteredData(filtered);
    };
  
    return (
      <div className='row'>

        <input 
          className='col-12'
          type="text" 
          placeholder="Buscar..." 
          value={search} 
          onChange={handleSearch}
        />
  
        <DataTable className='my-table col-12'
          columns={columns}
          data={filteredData}
          pagination
          noDataComponent="No hay reservaciones para mostrar"
          highlightOnHover
          striped
        />
      </div>
    );
  };
