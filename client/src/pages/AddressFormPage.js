import React, { useEffect, useState } from 'react';
import AddressForm from '../components/AddressForm';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function AddressFormPage(){
  const { customerId, addressId } = useParams();
  const isEdit = Boolean(addressId);
  const nav = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(()=> {
    if (!isEdit) return;
    api.get(`/customers/${customerId}/addresses`).then(res=>{
      const found = (res.data.data || []).find(a => String(a.id) === String(addressId));
      if (found) setInitial(found);
    }).catch(()=> alert('Failed to load address'));
  }, [customerId, addressId, isEdit]);

  const submit = async (form) => {
    try {
      if (isEdit) await api.put(`/addresses/${addressId}`, form);
      else await api.post(`/customers/${customerId}/addresses`, form);
      alert('Saved');
      nav(`/customers/${customerId}`);
    } catch (e) { alert('Save failed'); }
  };

  return <AddressForm initial={initial} onSubmit={submit} submitLabel={isEdit ? 'Update' : 'Create'} />;
}
