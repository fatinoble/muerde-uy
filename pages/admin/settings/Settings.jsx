import Layout from '../../../src/components/AdminLayout';
import axios from 'axios';
import Head from 'next/head';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { TextField, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import Switch from '@mui/material/Switch';
import React, { useState, useRef, useEffect } from 'react';
import { getApiUrl } from '../../../services/utils';

const Settings = () => {
  const [prefix, setPrefix] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberError, setNumberError] = useState('');
  const [enablePhoneEdit, setEnablePhoneEdit] = useState(false);
  const [enableBankEdit, setEnableBankEdit] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneLastModify, setPhoneLastModify] = useState('');
  const [bankLastModify, setBankLastModify] = useState('');
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [mailLastEnabled, setMailLastEnabled] = useState('');
  const [mailSwitchMessage, setMailSwitchMessage] = useState("El envío de correo está habilitado");
  const numberRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (prefix.length === 3) {
      numberRef.current.focus();
    }
  }, [prefix]);

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (/^[1-9]\d{7}$/.test(value)) {
      setNumberError('');
    } else {
      setNumberError('Debe ser válido y omitir el 0 del comienzo.');
    }
  };

  const handleSubmitNumber = async () => {
    try {
      await axios.put(`${getApiUrl()}/setting?key=phone`, {
        value: prefix + phoneNumber,
      });
      setEnablePhoneEdit(false);
      fetchSettings();
    } catch (error) {
      console.error('Error updating wpp phone number:', error);
    }
  }

  const handleSubmitBankAccount = async () => {
    try {
      await axios.put(`${getApiUrl()}/setting?key=account_number`, {
        value: accountNumber,
      });
      setEnableBankEdit(false);
      fetchSettings();
    } catch (error) {
      console.error('Error updating account number:', error);
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/setting`);
      const { settings } = response.data;
      const wpp_phone = settings.find(setting => setting.key === 'phone');
      const account_number = settings.find(setting => setting.key === 'account_number');
      const prefixFromWppPhone = wpp_phone?.value?.substring(0, 3) || '';
      const actualPhoneNumber = wpp_phone?.value?.substring(3) || '';
      setPrefix(prefixFromWppPhone);
      setPhoneNumber(actualPhoneNumber);
      setAccountNumber(account_number?.value || '');
      setPhoneLastModify(wpp_phone?.last_modified || '');
      setBankLastModify(account_number?.last_modified || '');
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const formatDate = (lastModified = '') => {
    const date = new Date(lastModified);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleToggle = () => {
    setIsEmailEnabled(!isEmailEnabled);
    axios.post(`${getApiUrl()}/toggleEmail`)
      .then(response => {
        console.log('Respuesta del servidor:', response.data);
        setMailLastEnabled(response.data.lastModified);
        setMailSwitchMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error en la petición:', error);
      });
  };

  return (
    <Layout>
      <Head style={{ marginBottom: '10px' }}>
        <title>Configuración</title>
      </Head>
      <div className="title-container">
        <h1><SettingsApplicationsIcon className="icon-title" />Configuración</h1>
      </div>
      <div className="setting-container">
        <div className='setting-title'>
          <WhatsAppIcon className="wpp-icon" />
          Configurar celular de contacto de Whatsapp
        </div>
        {phoneLastModify &&
          <span className="setting-last-modify">Última modificación: {formatDate(phoneLastModify)}</span>
        }
        <div className='setting-content'>
          <TextField
            label="Prefijo"
            value={prefix}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,3}$/.test(value)) {
                setPrefix(value);
              }
            }}
            margin="normal"
            variant="outlined"
            inputProps={{ maxLength: 3 }}
            type="number"
            className="prefix"
            disabled={!enablePhoneEdit}
          />
          <TextField
            label="Número de celular"
            value={phoneNumber}
            onChange={handleNumberChange}
            margin="normal"
            variant="outlined"
            inputProps={{ ref: numberRef, maxLength: 8 }}
            error={!!numberError}
            helperText={numberError}
            type="number"
            className="phone-number"
            disabled={!enablePhoneEdit}
          />
          {enablePhoneEdit ?
            <Button
              className="submit-number" disabled={!prefix || !phoneNumber || numberError}
              onClick={handleSubmitNumber}
            >
              <DoneIcon
                className={!prefix || !phoneNumber || numberError ? "done-icon-disabled" : "done-icon"}
              />
              Guardar
            </Button>
            :
            <Button onClick={() => setEnablePhoneEdit(true)} className="edit-number">
              <EditIcon
                className="edit-icon"
              />
              Editar
            </Button>
          }
        </div>

        <WhatsAppIcon className="icon-background" />
      </div>


      <div className="setting-container">
        <div className='setting-title'>
          <AccountBalanceIcon className="bank-icon" />
          Configurar número de cuenta bancaria para transferencias de usuarios
        </div>
        {bankLastModify &&
          <span className="setting-last-modify">Última modificación: {formatDate(bankLastModify)}</span>
        }
        <div className='setting-content'>
          <TextField
            label="Número de cuenta bancaria"
            value={accountNumber}
            onChange={(e) => {
              const value = e.target.value;
              setAccountNumber(value);
            }}
            margin="normal"
            variant="outlined"
            type="number"
            className="account-number-input"
            disabled={!enableBankEdit}
          />

          {enableBankEdit ?
            <Button
              className="submit-number" disabled={!accountNumber}
              onClick={handleSubmitBankAccount}
            >
              <DoneIcon
                className={!accountNumber ? "done-icon-disabled" : "done-icon"}
              />
              Guardar
            </Button>
            :
            <Button onClick={() => setEnableBankEdit(true)} className="edit-number">
              <EditIcon
                className="edit-icon"
              />
              Editar
            </Button>
          }
        </div>
        <AccountBalanceIcon className="icon-background" />
      </div>

      <div className="setting-container">
        <div className='setting-title'>
          <EmailIcon className="mail-icon" />
          Activar envío de mails
        </div>
        <div className='setting-content content-mail mail-flex-container'>
          {mailSwitchMessage &&
            <span className="setting-text mail-text setting-last-modify mail-margin-right">{mailSwitchMessage}</span>
          }
          {mailLastEnabled &&
            <span className="setting-text mail-text setting-last-modify mail-margin-right">Última modificación: {formatDate(mailLastEnabled)}</span>
          }
          <Switch
            checked={isEmailEnabled}
            onChange={handleToggle}
            name="emailEnabled"
            inputProps={{ 'aria-label': 'Activar envío de mails' }}
          />
        </div>
        <EmailIcon className="icon-background" />
      </div>

    </Layout >
  );
};

export default Settings;
