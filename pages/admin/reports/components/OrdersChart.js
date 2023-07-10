import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const RADIAN = Math.PI / 180;

const OrdersChart = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    if (!orderStatusData.length) {
      fetchOrderStatusData();
    }
  }, []);

  const fetchOrderStatusData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale/total_progress_status`);
      const data = response.data;
      setOrderStatusData(data.total_progress_status);
    } catch (error) {
      console.error('Error fetching orderStatusData:', error);
    }
  };


  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getInfoFromOrderStatus = (status) => {
    switch (status) {
      case 'TODO':
        return { name: 'Por hacer', color: '#FF8042' };
      case 'WIP':
        return { name: 'En proceso', color: '#FFBB28' };
      case 'DONE_PICK_UP':
        return { name: 'Listo para recoger', color: '#00C49F' };
      case 'DONE_DELIVERY':
        return { name: 'Listo para enviar', color: '#0088FE' };
      default:
        return {};
    }
  }

  return (
    <Box width="100%" height={400}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={orderStatusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="total_count"
          >
            {orderStatusData.map((orderStatus, index) => (
              <Cell key={`cell-${index}`} fill={getInfoFromOrderStatus(orderStatus.status)?.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box ml={2}>
        {orderStatusData.map((orderStatus, index) => (
          <Box key={`legend-${index}`} display="flex" alignItems="center" mb={1}>
            <Box width={16} height={16} bgcolor={getInfoFromOrderStatus(orderStatus.status)?.color} mr={1} />
            <Typography variant="body2">{getInfoFromOrderStatus(orderStatus.status)?.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrdersChart;
