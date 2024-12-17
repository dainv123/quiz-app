import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="container mt-5">
      <nav>
        <ul>
          <li>
            <Link to="/">User Quiz</Link>
          </li>
          <li>
            <Link to="/quiz/admin">Admin Quiz</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
};

export default Layout;
