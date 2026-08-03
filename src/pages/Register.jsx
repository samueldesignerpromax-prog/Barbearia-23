import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { name, email, password });
      alert('✅ Cadastro realizado! Faça login.');
      navigate('/login');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.error || 'Erro ao cadastrar'));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#1a1a1a', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
      <h2 style={{ textAlign: 'center', color: '#d4af37' }}>Crie sua conta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#ccc' }}><FaUser /> Nome</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Seu nome" />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#ccc' }}><FaEnvelope /> Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#ccc' }}><FaLock /> Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="********" />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Cadastrar</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px', color: '#888' }}>
        Já tem conta? <Link to="/login" style={{ color: '#d4af37' }}>Faça login</Link>
      </p>
    </div>
  );
}
