import React from 'react';
const AdminCreate = React.lazy(() => import('./admin-create'));
const UserCreate = React.lazy(() => import('./user-create'));

const Create = () => {
  const userRole = localStorage.getItem('Role');
  const isSuperAdmin = localStorage.getItem('isSuperAdmin');
  return (
    <>
      {userRole === 'user' && isSuperAdmin === 'false' ? (
        <UserCreate />
      ) : userRole === 'admin' || isSuperAdmin === 'true' ? (
        <AdminCreate />
      ) : (
        ''
      )}
    </>
  );
};

export default Create;
