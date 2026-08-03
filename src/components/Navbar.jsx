import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaScissors, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(13,13,13,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #333',
      padding: '14px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 999,
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.6rem', fontWeight: 'bold', color: '#d4af37' }}>
          <FaScissors /> Barbearia
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          {token ? (
            <>
              <span style={{ color: '#ddd' }}>Olá, {user.name || 'User'}</span>
              {user.role === 'admin' && <Link to="/admin" style={{ color: '#d4af37' }}>Admin</Link>}
              <Link to="/cliente" style={{ color: '#ddd' }}>Meus Agendamentos</Link>
              <button onClick={logout} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaSignOutAlt /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#ddd' }}>Login</Link>
              <Link to="/register" style={{ color: '#ddd' }}>Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
