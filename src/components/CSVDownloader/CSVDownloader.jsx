import React from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import { getCurrentDateTimeFormatted } from '../../utils';

const JSONToCSV = ({ jsonData, fileName }) => {
  const handleDownload = (currentDateTime) => {
    const csv = Papa.unparse(jsonData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${fileName}_${currentDateTime}.csv`);
  };

  return (
    <DownloadIcon onClick={() =>handleDownload(getCurrentDateTimeFormatted())} style={{ color: 'grey', cursor:'pointer' }}/>
  );
};

export default JSONToCSV;
