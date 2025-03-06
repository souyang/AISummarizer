import React from "react";

const Footer= () => {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center w-full">
      © {new Date().getFullYear()} Simon Ouyang. All rights reserved.
    </footer>
  );
};

export default Footer;