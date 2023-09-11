import React from 'react';
import Link from 'next/link';

const TopNavbar: React.FC = () => {
  return (

<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container">
    <Link className="navbar-brand" href="/">Start Bootstrap</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      {/* Move Home and About to the left side */}
      <ul className="navbar-nav">
        <li className="nav-item"><Link className="nav-link" href="/">Home</Link></li>
        <li className="nav-item"><Link className="nav-link" href="/about">About</Link></li>
      </ul>

      {/* Add Login and Signup buttons to the right side */}
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="btn btn-primary mx-2" href="/login">Login</Link>
        </li>
        <li className="nav-item">
          <Link className="btn btn-success" href="/register">Signup</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
  );
};

export default TopNavbar;