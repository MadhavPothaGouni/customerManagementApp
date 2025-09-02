import React, { useEffect, useState } from 'react';
import CustomerForm from '../components/CustomerForm';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function CustomerFormPage(){
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nav = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/customers/${id}`).then(res=> setInitial(res.data.data)).catch(()=> alert('Failed'));
  }, [id, isEdit]);

  const submit = async (form) => {
    try {
      if (isEdit) await api.put(`/customers/${id}`, form);
      else await api.post('/customers', form);
      alert('Saved succesfully');
      nav('/');
    } catch (e) {
      alert(e?.response?.data?.error || 'Save failed');
    }
  };

  return <CustomerForm initial={initial} onSubmit={submit} submitLabel={isEdit ? 'Update' : 'Create'} />;
}
