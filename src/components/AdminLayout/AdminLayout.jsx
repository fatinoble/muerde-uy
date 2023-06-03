import AdminNavigation from "../AdminNavigation/AdminNavigation";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout-container">
      <AdminNavigation />
      {children}
    </div>
  );
};

export default AdminLayout;
