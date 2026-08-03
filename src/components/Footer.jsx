import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      background: '#0a0a0a',
      borderTop: '1px solid #222',
      padding: '30px 20px',
      textAlign: 'center',
      color: '#888',
    }}>
      <div className="container">
        <p style={{ marginBottom: '10px' }}>© 2026 Barbearia – Todos os direitos reservados.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '1.4rem' }}>
          <a href="#" style={{ color: '#d4af37' }}><FaInstagram /></a>
          <a href="#" style={{ color: '#25d366' }}><FaWhatsapp /></a>
        </div>
      </div>
    </footer>
  );
}
