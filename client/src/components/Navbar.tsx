import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/topics" className="navbar-brand">QuizApp</Link>
        {isAuthenticated && (
          <div className="navbar-right">
            <span className="navbar-user">{user?.username}</span>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;