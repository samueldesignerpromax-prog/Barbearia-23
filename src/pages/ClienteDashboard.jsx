import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaCalendarAlt, FaClock, FaUser, FaScissors } from 'react-icons/fa';

export default function ClienteDashboard() {
  const [searchParams] = useSearchParams();
  const barberIdParam = searchParams.get('barber');

  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(barberIdParam || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, barberRes, myApp] = await Promise.all([
          api.get('/api/services'),
          api.get('/api/barbers'),
          api.get('/api/appointments/my')
        ]);
        setServices(servRes.data);
        setBarbers(barberRes.data);
        setAppointments(myApp.data);
        if (barberIdParam) setSelectedBarber(barberIdParam);
        setLoading(false);
      } catch (err) {
        alert('Erro ao carregar dados');
        setLoading(false);
      }
    };
    fetchData();
  }, [barberIdParam]);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      api.get(`/api/appointments/available?barberId=${selectedBarber}&date=${selectedDate}`)
        .then(res => setAvailableTimes(res.data.available || []))
        .catch(() => setAvailableTimes([]));
    }
  }, [selectedBarber, selectedDate]);

  const handleBooking = async () => {
    if (!selectedBarber || !selectedDate || !selectedTime || !selectedServiceId) {
      return alert('Preencha todos os campos.');
    }
    try {
      await api.post('/api/appointments', {
        barberId: selectedBarber,
        date: selectedDate,
        time: selectedTime,
        services: [selectedServiceId],
      });
      alert('✅ Agendamento realizado com sucesso!');
      const myApp = await api.get('/api/appointments/my');
      setAppointments(myApp.data);
      setSelectedTime('');
      setAvailableTimes([]);
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Erro ao agendar'));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 style={{ color: '#d4af37' }}>👋 Olá, {user.name}</h2>

      <div className="card" style={{ marginBottom: '32px' }}>
        <h3><FaCalendarAlt /> Novo Agendamento</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div>
            <label><FaUser /> Barbeiro</label>
            <select value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)}>
              <option value="">Selecione</option>
              {barbers.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label><FaCalendarAlt /> Data</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          </div>
          <div>
            <label><FaScissors /> Serviço</label>
            <select value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)}>
              <option value="">Selecione</option>
              {services.map(s => <option key={s._id} value={s._id}>{s.name} - R${s.price}</option>)}
            </select>
          </div>
          {availableTimes.length > 0 && (
            <div>
              <label><FaClock /> Horário</label>
              <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                <option value="">Selecione</option>
                {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
          {selectedDate && availableTimes.length === 0 && <p style={{ color: '#e74c3c' }}>Nenhum horário disponível.</p>}
        </div>
        <button className="btn-primary" onClick={handleBooking} style={{ marginTop: '16px' }}>Agendar</button>
      </div>

      <h3>📋 Meus Agendamentos</h3>
      {appointments.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <div className="grid-2">
          {appointments.map(a => (
            <div key={a._id} className="card">
              <p><strong>{a.date}</strong> às <strong>{a.time}</strong></p>
              <p><FaUser /> {a.barber?.name || 'Barbeiro'}</p>
              <p><FaScissors /> {a.services.map(s => s.name).join(', ')}</p>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                background: a.status === 'confirmed' ? '#27ae60' : a.status === 'canceled' ? '#e74c3c' : '#f39c12',
                color: '#fff',
                fontSize: '0.8rem',
                marginTop: '8px'
              }}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
