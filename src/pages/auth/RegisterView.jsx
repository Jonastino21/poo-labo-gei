import React from 'react';

const RegisterView = ({
  email,
  username,
  password,
  confirmPassword,
  handleChange,
  error,
  loading,
  onSubmit,
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Inscription</h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
              minLength="3"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email" 
              value={email}
              onChange={handleChange}
              required
              placeholder="exemple@isstm.mg"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="••••••••"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-150 disabled:opacity-50"
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;