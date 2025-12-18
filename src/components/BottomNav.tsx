import { NavLink, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Book, Paperclip, User } from "lucide-react";

export const BottomNav = () => {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef(null);
  const buttonRefs = useRef({});

  const navItems = [
    {
      to: "/",
      icon: <Book />,
      label: "Exámenes",
    },
    {
      to: "/tules",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
      label: "Tules",
    },
    {
      to: "/theory",
      icon: <Paperclip />,
      label: "Teoría",
    },
    {
      to: "/account",
      icon: <User />,
      label: "Perfil",
    },
  ];

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = buttonRefs.current[location.pathname];
      const nav = navRef.current;

      if (activeButton && nav) {
        const buttonRect = activeButton.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();

        setIndicatorStyle({
          left: buttonRect.left - navRect.left + buttonRect.width / 2 - 16,
          width: 32,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [location.pathname]);

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50"
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Indicador animado */}
      <div
        className="absolute top-0 h-0.5 bg-primary-500 rounded-b-full transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      <ul className="flex items-center justify-around h-16 max-w-2xl p-0 m-0 mx-auto list-none">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <li key={item.to}>
              <NavLink
                ref={(el) => (buttonRefs.current[item.to] = el)}
                to={item.to}
                className={`
                  flex flex-col items-center justify-center gap-1 px-4 py-2 
                  w-24 rounded-lg transition-colors duration-200
                  hover:bg-gray-100 focus:outline-none focus-visible:ring-2 
                  focus-visible:ring-primary-500 focus-visible:ring-offset-2
                  ${isActive ? "text-primary-500" : "text-gray-500"}
                `}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="flex items-center justify-center w-6 h-6">
                  {item.icon}
                </span>
                <span className="text-xs font-medium leading-none">
                  {item.label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
