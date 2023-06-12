import UserMenu from "../UserMenu";

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout-container">
      <UserMenu />
      {children}
    </div>
  );
};

export default UserLayout;
