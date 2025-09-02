import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

export default function CustomerList({ customers, onDelete }) {
  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12}}>
        <h2>Customers</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Phone</th><th>City</th><th>Addresses</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.phone_number}</td>
                <td>{c.city || '-'}</td>
                <td>{c.address_count ?? 0}</td>
                <td>
                  <Link to={`/customers/${c.id}`} style={{marginRight:8}}><button title="View"><FaEye/></button></Link>
                  <Link to={`/customers/${c.id}/edit`} style={{marginRight:8}}><button title="Edit" className="secondary"><FaEdit/></button></Link>
                  <button className="delete-btn" onClick={()=>onDelete(c.id)} title="Delete"><FaTrash/></button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={6} style={{textAlign:'center',padding:24}}>No customers</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
