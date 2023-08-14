import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import { Button, Paper, Switch } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../../src/utils/modals/service_modal/DetailsModal';
import EditModal from '../../../src/utils/modals/service_modal/EditModal';
import CreateModal from '../../../src/utils/modals/service_modal/CreateModal';
import { getAllServices, modifyService, createService, deleteService } from '../../../services/serviceService';

const Services = () => {
  const [services, setServices] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newServiceData, setNewServiceData] = useState({});
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    getAllServices()
      .then(services => {
        setServices(services);
        setLoading(false);
      });
  }, []);

  const editService = (editedService) => {
    modifyService(editedService)
      .then((updatedService) => {
        setServices(services.map(service => service.id_service === updatedService.id_service
          ? { ...service, ...updatedService }
          : service));
        setEditModalOpen(false);
      })
  }

  const newService = (newServiceData) => {
    createService(newServiceData)
      .then(() => {
        setNewServiceData(newServiceData);
        handleCloseCreateModal();
        getAllServices()
          .then(services => {
            setServices(services);
            setLoading(false);
          });
      })
  }

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleInputChange = (event) => {
    setServiceToEdit({
      ...serviceToEdit,
      [event.target.name]: event.target.value
    });
  };

  const handleOpen = (service) => {
    setSelectedService(service);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleServiceStatus = async (targetService) => {
    const newStatus = targetService.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    const editedService = { ...targetService, status: newStatus };
    modifyService(editedService).then(() => {
      setServices(prevServices => prevServices.map(service => service.id_service === editedService.id_service ? editedService : service));
    });
  };

  if (loading) {
    return <p>Cargando servicios...</p>;
  }

  const ServicePaper = styled(Paper)(({ theme, status }) => ({
    borderRadius: '10px',
    borderColor: status === 'ENABLED' ? 'brown' : 'lightgrey',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    background: status === 'ENABLED' ? 'white' : 'lightgrey',
    color: status === 'ENABLED' ? '#black' : 'grey'
  }));

  const StyledButton = styled(Button)(({ theme, status }) => ({
    borderRadius: '10px',
    borderColor: status === 'ENABLED' ? 'beige' : 'lightgrey',
    backgroundColor: status === 'ENABLED' ? '#f1e5d5' : 'lightgrey',
    color: status === 'ENABLED' ? 'black' : 'grey',
    '&:hover': {
      borderColor: status === 'ENABLED' ? 'brown' : 'grey',
      backgroundColor: status === 'ENABLED' ? 'fff' : 'lightgrey',
    },
  }));

  const InvertedButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    backgroundColor: 'beige',
    backgroundColor: '#ffff',
    color: 'black',
    borderColor: 'black',
    '&:hover': {
      backgroundColor: 'f1e5d5',
    },
  }));

  return (
    <Layout>
      <Box display="flex" justifyContent="center" alignItems="center">
        <InvertedButton variant="outlined" onClick={handleOpenCreateModal}>Nuevo servicio</InvertedButton>
      </Box>
      {services.map((service) => (
        <ServicePaper elevation={3} key={service.id_service} status={service.status}>
          <div className="small-image-container">
            <img
              className="service-image-small"
              src={service.image ? service.image : '/images/unavailable.png'} alt={service.title}
              style={{ width: '300px' }}
            ></img>
          </div>
          <div className="price-name-container">
            <h1 className="service-name"> {service.title} </h1>
            <span className="service-price">${service.price}</span>
          </div>
          <div className="service-admin-actions-container">
            <StyledButton status={service.status} variant="outlined" onClick={() => handleOpen(service)}>
              Ver detalles
            </StyledButton>
            {selectedService ? (
              <DetailsModal open={open} handleClose={handleClose} data={selectedService} />
            ) : null}
            <StyledButton status={service.status} variant="outlined" onClick={() => { setServiceToEdit(service); setEditModalOpen(true); }}>
              Editar servicio
            </StyledButton>
            <Switch checked={service.status === 'ENABLED'} onChange={() => toggleServiceStatus(service)} />
          </div>
        </ServicePaper>
      ))}
      {editModalOpen ? (
        <EditModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          data={serviceToEdit}
          handleInputChange={handleInputChange}
          handleUpdate={editService}
        />
      ) : null}
      {isCreateModalOpen ? (
        <CreateModal
          open={isCreateModalOpen}
          handleClose={handleCloseCreateModal}
          handleAdd={newService}
        />
      ) : null}
    </Layout>
  );
};

export default Services;
