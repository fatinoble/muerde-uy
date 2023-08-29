import Layout from '../../../src/components/AdminLayout';
import React, { useState, useEffect } from "react";
import { Button, Switch, Card, CardContent, CardMedia, CardActions  } from '@mui/material';
import { styled, Box } from '@mui/system';
import DetailsModal from '../../../src/utils/modals/service_modal/DetailsModal';
import EditModal from '../../../src/utils/modals/service_modal/EditModal';
import CreateModal from '../../../src/utils/modals/service_modal/CreateModal';
import { getAllServices, modifyService, createService } from '../../../services/serviceService';
import CategoryIcon from '@mui/icons-material/Category';
import Head from 'next/head';

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

  const ServiceContainer = styled('div')({
    maxHeight: '100%',
    overflowY: 'auto',
  });

  const StyledCard = styled(Card)(({ theme, status }) => ({
    borderRadius: '10px',
    borderColor: status === 'ENABLED' ? 'brown' : 'lightgrey',
    marginBottom: theme.spacing(2),
    background: status === 'ENABLED' ? 'white' : 'lightgrey',
  }));

  const StyledButton = styled(Button)(({ theme, status }) => ({
    borderRadius: '10px',
    borderColor: status === 'ENABLED' ? 'rgb(216, 130, 130)' : 'lightgrey',
    backgroundColor: status === 'ENABLED' ? 'white' : 'lightgrey',
    color: status === 'ENABLED' ? 'rgb(216, 130, 130)' : 'grey',
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(2),
    '&:hover': {
      borderColor: status === 'ENABLED' ? 'white' : 'grey',
      backgroundColor: status === 'ENABLED' ? 'rgb(216, 130, 130)' : 'lightgrey',
      color: 'white'
    },
  }));

  const InvertedButton = styled(Button)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    backgroundColor: '#ffff',
    color: 'rgb(216, 130, 130)',
    borderColor: 'rgb(216, 130, 130)',
    '&:hover': {
      backgroundColor: 'rgb(216, 130, 130)',
      color: 'white',
      borderColor: 'rgb(216, 130, 130)',
    },
  }));

  return (
    <Layout>
      <Head style={{ marginBottom: '10px' }}>
        <title>Servicios</title>
      </Head>
      <div className="title-container">
        <h1><CategoryIcon className="icon-title" />Servicios</h1>
      </div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <InvertedButton variant="outlined" onClick={handleOpenCreateModal}>Nuevo servicio</InvertedButton>
      </Box>
      <ServiceContainer>
        {services.map((service) => (
          <StyledCard elevation={3} key={service.id_service} status={service.status}>
            <Box display="flex">
              <CardMedia
                component="img"
                image={service.image ? service.image : '/images/unavailable.png'}
                alt={service.title}
                style={{ width: '300px' }}
              />
              <CardContent>
                <h1>{service.title}</h1>
                <span className="product-price">${service.price}</span>
                <CardActions style={{ padding: 0 }}>
                  <StyledButton
                    status={service.status}
                    variant="outlined"
                    onClick={() => handleOpen(service)}
                  >
                    Ver detalles
                  </StyledButton>

                  {selectedService ? (
                    <DetailsModal open={open} handleClose={handleClose} data={selectedService} />
                  ) : null}

                  <StyledButton
                    status={service.status}
                    variant="outlined"
                    onClick={() => { setServiceToEdit(service); setEditModalOpen(true); }}
                    >
                    Editar servicio
                  </StyledButton>
                  <Switch checked={service.status === 'ENABLED'} onChange={() => toggleServiceStatus(service)} />
                  {service.status === 'ENABLED' ? <span>Activo</span> : <span>Inactivo</span>}
                </CardActions>
              </CardContent>
            </Box>
          </StyledCard>
        ))}
          </ServiceContainer>
      {
            editModalOpen?(
        <EditModal
          open = { editModalOpen }
          handleClose = {() => setEditModalOpen(false)}
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
