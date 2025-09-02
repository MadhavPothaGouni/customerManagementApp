import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CustomerList from '../components/CustomerList';
import { useNavigate } from 'react-router-dom';

export default function CustomerListPage(){
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ name:'', city:'', state:'', pin:'' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      const q = new URLSearchParams({ ...filters, page, limit }).toString();
      const res = await api.get(`/customers?${q}`);
      setCustomers(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      alert('Failed to load customers');
    }
  };

  useEffect(()=>{ fetch(); }, [page]); // eslint-disable-line

  const handleDelete = async (id) => {
    if (!window.confirm('Delete customer?')) return;
    try { await api.delete(`/customers/${id}`); fetch(); } catch (e){ alert('Delete failed'); }
  };

  const applyFilters = ()=> { setPage(1); fetch(); };
  const clearFilters = ()=> { setFilters({name:'',city:'',state:'',pin:''}); setPage(1); fetch(); };

  return (
    <>
      <div className="card">
        <div className="controls">
          <input placeholder="Name" value={filters.name} onChange={e=>setFilters({...filters, name:e.target.value})} />
          <input placeholder="City" value={filters.city} onChange={e=>setFilters({...filters, city:e.target.value})} />
          <input placeholder="State" value={filters.state} onChange={e=>setFilters({...filters, state:e.target.value})} />
          <input placeholder="Pin" value={filters.pin} onChange={e=>setFilters({...filters, pin:e.target.value})} />
          <button onClick={applyFilters}>Apply</button>
          <button className="secondary" onClick={clearFilters}>Clear</button>
          <button className="add-btn" onClick={()=>navigate('/customers/new')}>New Customer</button>
        </div>
      </div>

      <CustomerList customers={customers} onDelete={handleDelete} />

      <div style={{display:'flex', gap:8, justifyContent:'flex-end', alignItems:'center'}}>
        <button className="secondary" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <span className="badge">Page {page}</span>
        <button disabled={customers.length < limit} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </>
  );
}
