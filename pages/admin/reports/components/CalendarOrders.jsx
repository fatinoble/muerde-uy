import axios from 'axios';
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import Button from '@mui/material/Button';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { es } from 'date-fns/locale';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.css";
import { Modal } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import { formatDate } from '@/utils';
import { getApiUrl } from '../../../../services/utils';

const locales = {
    es
};
const localizer = dateFnsLocalizer({
    format: (date, formatStr, culture) => format(date, formatStr, { locale: es }),
    parse: (dateString, formatStr, culture) => parse(dateString, formatStr, new Date(), { locale: es }),
    startOfWeek: (date, culture) => startOfWeek(date, { locale: es }),
    getDay: (date, culture) => getDay(date, { locale: es }),
    locales,
    defaultLocale: 'es',
    views: {
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        agenda: 'Agenda'
    }
});

const customMessages = {
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
};


const CalendarOrders = () => {

    const [orders, setOrders] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, [selectedStatusFilter])

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/sale`);
            const data = response.data;

            const updatedDates = data.orders.map((order) => {
                return {
                    ...order,
                    title: `Pedido #${order.id_sale}`,
                    user_date: new Date(order.user_date)
                };
            })
            const filteredOrders = selectedStatusFilter
                ? updatedDates.filter((order) => order.status === selectedStatusFilter)
                : updatedDates;

            setOrders(filteredOrders);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    }
    const eventStyleGetter = (event) => {
        let backgroundColor;
        switch (event.status) {
            case 'FINISHED':
                backgroundColor = '#54AF63';
                break;
            case 'TODO':
                backgroundColor = '#5077C4';
                break;
            case 'WIP':
                backgroundColor = '#B0B22F';
                break;
            case 'DONE_PICK_UP':
            case 'DONE_DELIVERY':
                backgroundColor = '#C15050';
                break;
            default:
                backgroundColor = 'gray';
                break;
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                fontSize: '15px',
                alignItems: 'center',
                fontWeight: 'bold',
                borderRadius: '3px',
                color: 'white',
                border: '1px solid black',
                display: 'block',
                padding: '5px',
                cursor: 'pointer',
            },
        };
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleViewDetail = (id) => {
        router.push(`/admin/orders/order/${id}`);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const handleStatusFilterChange = (event) => {
        setSelectedStatusFilter(event.target.value);
        fetchOrders();
    };



    return (
        <>
            <div style={{ backgroundColor: 'white' }}>


                <label className="featuredTitle" id='lbl-filter'>Filtrar por estado</label>
                <Select
                    labelId="lbl-filter"
                    value={selectedStatusFilter || ''}
                    onChange={handleStatusFilterChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Filter by status' }}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="TODO">Pendiente</MenuItem>
                    <MenuItem value="WIP">En proceso</MenuItem>
                    <MenuItem value="DONE_PICK_UP">Listo para retiro</MenuItem>
                    <MenuItem value="DONE_DELIVERY">Listo para delivery</MenuItem>
                    <MenuItem value="FINISHED">Finalizado</MenuItem>
                </Select>
                <Calendar
                    localizer={localizer}
                    events={selectedEvent ? [] : orders}
                    startAccessor="user_date"
                    endAccessor="user_date"
                    style={{ height: 500 }}
                    messages={customMessages}
                    onSelectEvent={handleEventClick}
                    eventPropGetter={eventStyleGetter}
                /></div>

            <Modal
                open={Boolean(selectedEvent)}
                onClose={handleCloseModal}
                aria-labelledby="event-details-modal"
            >
                <div className="modal">
                    <div className="modal-content">
                        <h2 id="event-details-modal">Detalles del pedido</h2>
                        <p>Pedido nro: {selectedEvent?.id_sale}</p>
                        <p>Fecha entrega solicitada: {formatDate(selectedEvent?.user_date)}</p>
                        <p>Productos solicitados:
                            <ul>
                                {selectedEvent?.products?.map((product) =>
                                    <li>{product.product.title} - Cantidad: {product.quantity}</li>
                                )}
                            </ul>
                        </p>
                        <Button variant="outlined" onClick={(e) => {
                            e.preventDefault();
                            handleViewDetail(selectedEvent?.id_sale)
                        }}>Ver detalles</Button>
                        <Button Button variant="outlined" color="error" onClick={handleCloseModal}>Cerrar</Button>
                    </div>
                </div>
            </Modal>

            <style jsx>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          z-index: 2;
        }

        .modal-content {
          max-width: 400px;
        }
      `}</style>
        </>
    );
};

export default CalendarOrders;