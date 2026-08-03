import React, { useEffect, useState } from 'react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaTrash, FaEdit, FaPlus, FaUser, FaScissors, FaCalendarAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBarber, setNewBarber] = useState({ name: '', description: '', workingHours: [] });
  const [newService, setNewService] = useState({ name: '', price: '', duration: '', description: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadData = async () => {
    try {
      const [bRes, sRes, aRes] = await Promise.all([
        api.get('/api/barbers'),
        api.get('/api/services'),
        api.get('/api/admin/appointments')
      ]);
      setBarbers(bRes.data);
      setServices(sRes.data);
      setAppointments(aRes.data);
      setLoading(false);
    } catch (err) {
      alert('Erro ao carregar dados admin');
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ---- BARBEIROS ----
  const handleAddBarber = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/barbers', newBarber);
      setNewBarber({ name: '', description: '', workingHours: [] });
      loadData();
      alert('✅ Barbeiro adicionado!');
    } catch (err) {
      alert('❌ Erro ao adicionar barbeiro');
    }
  };

  const handleDeleteBarber = async (id) => {
    if (!window.confirm('Remover este barbeiro?')) return;
    try {
      await api.delete(`/api/admin/barbers/${id}`);
      loadData();
      alert('✅ Removido!');
    } catch (err) {
      alert('❌ Erro ao remover');
    }
  };

  // ---- SERVIÇOS ----
  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/services', {
        ...newService,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
      });
      setNewService({ name: '', price: '', duration: '', description: '' });
      loadData();
      alert('✅ Serviço criado!');
    } catch (err) {
      alert('❌ Erro ao criar serviço');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Remover este serviço?')) return;
    try {
      await api.delete(`/api/admin/services/${id}`);
      loadData();
      alert('✅ Removido!');
    } catch (err) {
      alert('❌ Erro ao remover');
    }
  };

  // ---- STATUS ----
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/admin/appointments/${id}/status`, { status: newStatus });
      loadData();
      alert('✅ Status atualizado!');
    } catch (err) {
      alert('❌ Erro ao atualizar status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 style={{ color: '#d4af37' }}>👑 Painel Administrativo</h2>
      <p>Bem-vindo, {user.name}</p>

      {/* ---------- BARBEIROS ---------- */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3><FaUser /> Gerenciar Barbeiros</h3>
        <form onSubmit={handleAddBarber} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'end' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label>Nome</label>
            <input type="text" value={newBarber.name} onChange={e => setNewBarber({...newBarber, name: e.target.value})} required />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label>Descrição</label>
            <input type="text" value={newBarber.description} onChange={e => setNewBarber({...newBarber, description: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary"><FaPlus /> Adicionar</button>
        </form>
        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {barbers.map(b => (
            <span key={b._id} style={{ background: '#2a2a2a', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {b.name}
              <button onClick={() => handleDeleteBarber(b._id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}><FaTrash /></button>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- SERVIÇOS ---------- */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3><FaScissors /> Gerenciar Serviços</h3>
        <form onSubmit={handleAddService} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'end' }}>
          <div style={{ flex: 1, minWidth: '120px' }}><label>Nome</label><input type="text" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required /></div>
          <div style={{ flex: 1, minWidth: '100px' }}><label>Preço (R$)</label><input type="number" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required /></div>
          <div style={{ flex: 1, minWidth: '100px' }}><label>Duração (min)</label><input type="number" value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} required /></div>
          <div style={{ flex: 1, minWidth: '120px' }}><label>Descrição</label><input type="text" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} /></div>
          <button type="submit" className="btn-primary"><FaPlus /> Adicionar</button>
        </form>
        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {services.map(s => (
            <span key={s._id} style={{ background: '#2a2a2a', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {s.name} (R${s.price})
              <button onClick={() => handleDeleteService(s._id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}><FaTrash /></button>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- AGENDAMENTOS ---------- */}
      <div className="card">
        <h3><FaCalendarAlt /> Todos os Agendamentos</h3>
        {appointments.length === 0 ? <p>Nenhum agendamento.</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Cliente</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Barbeiro</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Data/Hora</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px' }}>{a.client?.name || a.client}</td>
                    <td style={{ padding: '8px' }}>{a.barber?.name || 'N/A'}</td>
                    <td style={{ padding: '8px' }}>{a.date} {a.time}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '20px',
                        background: a.status === 'confirmed' ? '#27ae60' : a.status === 'canceled' ? '#e74c3c' : '#f39c12',
                        color: '#fff',
                        fontSize: '0.8rem'
                      }}>{a.status}</span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <select onChange={e => handleStatusChange(a._id, e.target.value)} defaultValue={a.status} style={{ padding: '4px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmar</option>
                        <option value="completed">Finalizar</option>
                        <option value="canceled">Cancelar</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
