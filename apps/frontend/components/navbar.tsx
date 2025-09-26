import React from "react";

type Props = {
  children?: React.ReactNode;
};

function Navbar({ children }: Props) {
  return (
    <header className="w-full h-14 px-4 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 dark:bg-card z-10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-full">
        {children}
      </nav>
    </header>
  );
}

export default Navbar;
