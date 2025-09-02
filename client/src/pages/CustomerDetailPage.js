import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AddressList from '../components/AddressList';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

export default function CustomerDetailPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const fetch = async ()=>{
    try {
      const cust = await api.get(`/customers/${id}`);
      setCustomer(cust.data.data);
      const add = await api.get(`/customers/${id}/addresses`);
      setAddresses(add.data.data || []);
    } catch (e) { alert('Load failed'); }
  };

  useEffect(()=>{ fetch(); }, [id]);

  const deleteAddress = async (addrId) => {
    if (!window.confirm('Delete address?')) return;
    try { await api.delete(`/addresses/${addrId}`); fetch(); } catch(e){ alert('Delete failed'); }
  };

  if (!customer) return <div className="card">Loading...</div>;

  return (
    <div>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <div>
            <h2>{customer.first_name} {customer.last_name}</h2>
            <div>Phone: {customer.phone_number}</div>
            <div>City: {customer.city || '-'}</div>
          </div>
          <div>
            <button className="secondary" onClick={()=>nav(`/customers/${id}/edit`)}><FaEdit/> Edit</button>
          </div>
        </div>
      </div>

      <AddressList addresses={addresses} customerId={id} onDelete={deleteAddress} />
    </div>
  );
}
