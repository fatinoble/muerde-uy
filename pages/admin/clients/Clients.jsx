import Layout from '../../../src/components/AdminLayout';
import { getUsers } from '../../../services/userService';
import { useEffect } from 'react';
import { Button, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, TablePagination, Select, MenuItem, Box } from '@mui/material';
import React, { useState } from "react";
import EditModal from '../../../src/utils/modals/user_modal/EditModal';
import { modifyUser } from '../../../services/userService';
import Head from 'next/head';
import People from "@mui/icons-material/People";

const Clients = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [role, setRole] = React.useState('all');
  const filteredUsers = role === 'all' ? users : users.filter(user => user.role === role);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUsers()
      .then(users => {
        setUsers(users.data);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const StyledTableContainer = styled(TableContainer)({
    backgroundColor: 'white',
    marginTop: '20px',
  });

  const StyledTableCell = styled(TableCell)({
    color: 'brown',
    fontWeight: 'bold',
  });

  const StyledSelect = styled(Select)({
    backgroundColor: 'rgb(168, 118, 88)',
    '& .MuiSelect-select': {
      color: 'white',
    },
  });

  const SelectContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
  });

  const handleEdit = (user) => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setCurrentUser(null);
  };

  const editUser = (editedUser) => {
    modifyUser(editedUser)
      .then(() => {
        setUsers(users.map(user => user.id === editedUser.id ? editedUser : user));
        setModalOpen(false);
      })
  }

  return (
    <Layout>
      <Head style={{ marginBottom: '10px' }}>
        <title>Clientes</title>
      </Head>
      <div className="title-container">
        <h1><People className="icon-title" />Clientes</h1>
      </div>
      <SelectContainer>
        <StyledSelect value={role} onChange={handleRoleChange}>
          <MenuItem value='all'>Todos</MenuItem>
          <MenuItem value='USER'>Clientes</MenuItem>
          <MenuItem value='ADMIN'>Admins</MenuItem>
        </StyledSelect >
      </SelectContainer>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Nombre</StyledTableCell>
              <StyledTableCell>Mail</StyledTableCell>
              <StyledTableCell>Teléfono</StyledTableCell>
              <StyledTableCell>Dirección</StyledTableCell>
              <StyledTableCell>Fecha de registro</StyledTableCell>
              <StyledTableCell>Rol</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id_user}>
                <TableCell>{user.id_user}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.mail}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.creation_date}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página"
              />
            </TableRow>
          </TableFooter>
        </Table>
      </StyledTableContainer>
      {modalOpen ? (
        <EditModal open={modalOpen} handleClose={handleClose} user={currentUser} handleUpdate={editUser} />
      ) : null}
    </Layout>
  );
};

export default Clients;