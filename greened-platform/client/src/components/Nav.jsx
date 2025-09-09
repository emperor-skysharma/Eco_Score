import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Nav() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/learn", label: "Learn" },
    { to: "/challenges", label: "Challenges" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/portfolio", label: "Portfolio" }
  ];
  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">GreenED</Link>
        <div className="space-x-4 hidden md:block">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:underline">
              {l.label}
            </Link>
          ))}
        </div>
        {/* mobile */}
        <motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
          <details className="cursor-pointer">
            <summary>Menu</summary>
            <div className="flex flex-col mt-2 space-y-2">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="hover:underline">
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </motion.div>
      </div>
    </nav>
  );
}