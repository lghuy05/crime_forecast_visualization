import React from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { dashboardStyles } from '../styling/DashboardStyles';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className={dashboardStyles.container}>
      {/* Navigation */}
      <nav className={dashboardStyles.nav}>
        <div className={dashboardStyles.navContainer}>
          <div className={dashboardStyles.navContent}>
            <div className={dashboardStyles.navLeft}>
              <h1 className={dashboardStyles.title}>
                Crime Forecasting Dashboard
              </h1>
            </div>
            <div className={dashboardStyles.navRight}>
              <span className={dashboardStyles.welcomeText}>
                Welcome, {user?.email}
              </span>
              <button
                onClick={logout}
                className={dashboardStyles.logoutButton}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={dashboardStyles.main}>
        <div className={dashboardStyles.contentContainer}>
          <div className={dashboardStyles.placeholder}>
            <p className={dashboardStyles.placeholderText}>
              Dashboard content coming soon...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
