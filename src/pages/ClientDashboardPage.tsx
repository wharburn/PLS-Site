import React from 'react';
import ClientDashboard from './ClientDashboard';

interface ClientDashboardPageProps {
  lang?: string;
}

const ClientDashboardPage: React.FC<ClientDashboardPageProps> = () => {
  return <ClientDashboard />;
};

export default ClientDashboardPage;
