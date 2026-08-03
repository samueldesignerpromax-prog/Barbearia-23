import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('✅ Login realizado com sucesso!');
      navigate('/');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Erro ao fazer login'));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#1a1a1a', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
      <h2 style={{ textAlign: 'center', color: '#d4af37' }}>Bem-vindo de volta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#ccc' }}><FaEnvelope /> Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', color: '#ccc' }}><FaLock /> Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="********" />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Entrar</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px', color: '#888' }}>
        Não tem conta? <Link to="/register" style={{ color: '#d4af37' }}>Cadastre-se</Link>
      </p>
    </div>
  );
}
