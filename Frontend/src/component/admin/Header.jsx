import "./Header.css";

import {
  Menu,
  Bell,
  UserCircle
} from "lucide-react";

const Header = ({ onMenuClick }) => {

  return (

    <header className="admin-header">

      <div className="header-left">

        <button
          className="header-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <div>
          <h1>Jeevan Sanjivani</h1>
          <p>Admin Panel</p>
        </div>

      </div>


      <div className="header-right">

        <button className="header-icon-btn">
          <Bell size={20} />
        </button>


        <div className="header-profile">

          <UserCircle size={32} />

          <div className="header-profile-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

        </div>

      </div>

    </header>

  );
};

export default Header;