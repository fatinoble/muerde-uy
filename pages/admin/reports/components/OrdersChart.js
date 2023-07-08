import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';


const orderStatusData = [
  { status: 'TODO', name: 'Por hacer', value: 50, color: '#FF8042' },
  { status: 'WIP', name: 'En proceso', value: 20, color: '#FFBB28' },
  { status: 'DONE_PICK_UP', name: 'Listo para recoger', value: 20, color: '#00C49F' },
  { status: 'DONE_DELIVERY', name: 'Listo para enviar', value: 10, color: '#0088FE' },
];

const RADIAN = Math.PI / 180;

const OrdersChart = () => {
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
            dataKey="value"
          >
            {orderStatusData.map((orderStatus, index) => (
              <Cell key={`cell-${index}`} fill={orderStatus.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box ml={2}>
        {orderStatusData.map((orderStatus, index) => (
          <Box key={`legend-${index}`} display="flex" alignItems="center" mb={1}>
            <Box width={16} height={16} bgcolor={orderStatus.color} mr={1} />
            <Typography variant="body2">{orderStatus.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrdersChart;
