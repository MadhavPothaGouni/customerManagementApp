import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import AddressFormPage from './pages/AddressFormPage';

export default function App(){
  return (
    <Router>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
          <h1>Customer Management</h1>
          <nav>
            <Link to="/" style={{ marginRight: 12 }}>Customers</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<CustomerListPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:customerId/addresses/new" element={<AddressFormPage />} />
          <Route path="/customers/:customerId/addresses/:addressId/edit" element={<AddressFormPage />} />
        </Routes>
      </div>
    </Router>
  );
}
