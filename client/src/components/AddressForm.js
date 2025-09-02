import React, { useState, useEffect } from 'react';

export default function AddressForm({ initial, onSubmit, submitLabel='Save' }) {
  const [form, setForm] = useState({ address_details:'', city:'', state:'', pin_code:'' });

  useEffect(()=>{ if(initial) setForm({...form, ...initial}); }, [initial]);

  const change = (k) => (e) => setForm({...form, [k]: e.target.value});

  const submit = (e) => {
    e.preventDefault();
    if (!form.address_details || !form.city || !form.state || !form.pin_code) {
      alert('All fields are required');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="card">
      <div className="controls">
        <input placeholder="Address details" value={form.address_details} onChange={change('address_details')} />
        <input placeholder="City" value={form.city} onChange={change('city')} />
        <input placeholder="State" value={form.state} onChange={change('state')} />
        <input placeholder="Pin code" value={form.pin_code} onChange={change('pin_code')} />
      </div>
      <div style={{display:'flex',gap:8}}>
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}
