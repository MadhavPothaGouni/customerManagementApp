import React, { useState, useEffect } from 'react';

export default function CustomerForm({ initial, onSubmit, submitLabel='Save' }) {
  const [form, setForm] = useState({
    first_name: '', last_name:'', phone_number:'', city:'', state:'', pin_code:''
  });

  useEffect(()=> {
    if (initial) setForm({...form, ...initial});
    // eslint-disable-next-line
  }, [initial]);

  const change = (k) => (e) => setForm({...form, [k]: e.target.value});

  const submit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.first_name || !form.last_name || !form.phone_number) {
      alert('First name, last name and phone are required');
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="card">
      <div className="controls">
        <input placeholder="First name" value={form.first_name} onChange={change('first_name')} required />
        <input placeholder="Last name" value={form.last_name} onChange={change('last_name')} required />
        <input placeholder="Phone number" value={form.phone_number} onChange={change('phone_number')} required />
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
