import AdminNavigation from "../AdminNavigation/AdminNavigation";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminNavigation />
      <div className="admin-layout-container">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
