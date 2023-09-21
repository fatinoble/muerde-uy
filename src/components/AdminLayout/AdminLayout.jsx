import AdminNavigation from "../AdminNavigation/AdminNavigation";
import TestSign from "../../../src/components/TestSign"

const AdminLayout = ({ children }) => {
  return (
    <div>
      {TestSign && <TestSign styleClassName="test-sign"></TestSign>}
      <AdminNavigation />
      <div className="admin-layout-container">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
