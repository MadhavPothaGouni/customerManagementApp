import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AddressList({ addresses, customerId, onDelete }) {
  return (
    <div className="table-wrap card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <h3>Addresses</h3>
        <Link to={`/customers/${customerId}/addresses/new`}><button className="add-btn">Add Address</button></Link>
      </div>
      <table>
        <thead>
          <tr><th>ID</th><th>Address</th><th>City</th><th>State</th><th>Pin</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {addresses.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.address_details}</td>
              <td>{a.city}</td>
              <td>{a.state}</td>
              <td>{a.pin_code}</td>
              <td>
                <Link to={`/customers/${customerId}/addresses/${a.id}/edit`}><button className="secondary" style={{marginRight:8}}><FaEdit/></button></Link>
                <button className="delete-btn" onClick={()=>onDelete(a.id)}><FaTrash/></button>
              </td>
            </tr>
          ))}
          {addresses.length===0 && <tr><td colSpan={6} style={{textAlign:'center', padding:24}}>No addresses</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
