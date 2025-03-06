import React from "react";

import { logo } from "../assets";

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col sm:px-16 px-6 pt-5 sm:pt-15'>
      <nav className='flex justify-between items-center w-full mb-10 sticky top-0'>
        <a href="/">
          <div className="flex justify-center items-center">
          <img src={logo} alt='sumz_logo' className='w-10 h-10 object-contain' />
          <span className="light_blue_gradient pl-2 text-3xl">Suzi AI</span>
          </div>
        </a>
      </nav>

      <h1 className='head_text'>
      Summarize Online Articles with <br className='max-md:hidden' />
        <span className='light_blue_gradient'>Suzi AI</span>
      </h1>
      <h2 className='desc'>
      Enhance your reading experience with Suzi AI, an open-source article summarizer that turns lengthy articles into clear and concise summaries.
      </h2>
    </header>
  );
};

export default Hero;
