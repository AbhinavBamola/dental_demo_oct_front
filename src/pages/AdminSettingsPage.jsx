import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ClinicSettings from '../components/admin/ClinicSettings';

const AdminSettingsPage = () => {
  return (
    <AdminLayout title="Clinic Customization & Settings">
      <ClinicSettings />
    </AdminLayout>
  );
};

export default AdminSettingsPage;
