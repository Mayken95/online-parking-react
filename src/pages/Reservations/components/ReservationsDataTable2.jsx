import  { useState, useEffect, useRef } from 'react';
import React from 'react';
import DataTable from 'react-data-table-component';
import '../../../assets/styles/global.css';

export const ReservationsDataTable2 =  ({ data, onDelete }) => {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState(data);
  
    // Columnas de la tabla
    const columns = [
      { name: 'Placa', selector: row => row.vehicle.plate },
      { name: 'Parqueo', selector: row => row.parking?.name },
      { name: 'Fecha', selector: row => row.schedule_time?.date },
      { name: 'Hora de inicio', selector: row => row.schedule_time?.start_time },
      { name: 'Hora de finalización', selector: row => row.schedule_time?.end_time },
      {
        name: 'Estado',
        selector: row => row.state === "A" ? "Activa" : (row.state === "P" ? "Pagada" : "Cancelada"),
      },
      {
        name: 'Acciones',
        cell: row => row.state !== "C" && (
          <button 
            className="btn btn-danger" 
            onClick={() => onDelete(row.id)}
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
        item.vehicle.plate.toLowerCase().includes(searchTerm) ||
        item.parking?.name.toLowerCase().includes(searchTerm) ||
        item.schedule_time?.date.includes(searchTerm)
      );
      
      setFilteredData(filtered);
    };
  
    return (
      <div>
        {/* Campo de búsqueda */}
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={search} 
          onChange={handleSearch}
        />
  
        {/* Tabla de datos */}
        <DataTable className='my-table'
          columns={columns}
          data={filteredData}
          pagination
        />
      </div>
    );
  };
