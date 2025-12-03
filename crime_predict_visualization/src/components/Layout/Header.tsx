import { Home, BarChart3, MapPin, Users, Mail } from 'lucide-react';
import { NavBar } from '../ui/tubelight-navbar';

const Header = () => {
  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Our Work", url: "/ourwork", icon: BarChart3 },
    { name: "Demo", url: "/demo", icon: MapPin },
    { name: "Team", url: "/team", icon: Users },
    { name: "Contact", url: "/contact", icon: Mail },
  ];

  return <NavBar items={navItems} />;
};

export default Header;
