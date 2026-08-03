import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaStar, FaCut } from 'react-icons/fa';

export default function Home() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/barbers')
      .then(res => {
        setBarbers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 0 20px' }}>
        <h1 style={{ color: '#d4af37' }}>✂️ Escolha seu Barbeiro</h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Agende com os melhores profissionais da cidade</p>
      </div>

      <div className="grid-2">
        {barbers.map(barber => (
          <div key={barber._id} className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <img
              src={barber.avatar || 'https://via.placeholder.com/120/1a1a1a/d4af37?text=✂️'}
              alt={barber.name}
              className="avatar"
              style={{ marginBottom: '12px' }}
            />
            <h3>{barber.name}</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '8px' }}>
              {barber.description || 'Profissional especializado'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {barber.services?.slice(0, 3).map(s => (
                <span key={s._id} style={{ background: '#2a2a2a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#d4af37' }}>
                  {s.name}
                </span>
              ))}
              {barber.services?.length > 3 && <span style={{ color: '#888' }}>+{barber.services.length - 3}</span>}
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate(`/cliente?barber=${barber._id}`)}
            >
              Agendar com {barber.name}
            </button>
          </div>
        ))}
      </div>
      {barbers.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          Nenhum barbeiro cadastrado ainda. Aguarde a administração.
        </p>
      )}
    </div>
  );
}
