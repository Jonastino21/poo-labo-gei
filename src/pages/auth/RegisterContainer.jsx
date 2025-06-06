import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegisterView from './RegisterView';

const RegisterContainer = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation client
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      // Redirection gérée dans AuthContext après auto-login
      // ou directement ici si pas d'auto-login
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterView
      {...formData}
      handleChange={handleChange}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
};

export default RegisterContainer;