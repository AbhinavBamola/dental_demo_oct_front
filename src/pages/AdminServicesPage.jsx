import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ServicesManagement from '../components/admin/ServicesManagement';

const AdminServicesPage = () => {
  return (
    <AdminLayout title="Services & Treatments Catalog">
      <ServicesManagement />
    </AdminLayout>
  );
};

export default AdminServicesPage;
