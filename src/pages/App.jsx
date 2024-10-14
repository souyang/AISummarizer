import Hero from "../components/Hero";
import Demo from "../components/Demo";
import { Helmet } from 'react-helmet';
import "./App.css";

const App = () => {
  const title = "Suzi AI Article Summarizer";
  const description = "Suzi AI is an open-source article summarizer that turns lengthy articles into clear and concise summaries. Summarize any kind of online article with just input URL.";
  return (
    <main className="max-w-full overflow-x-hidden">
            <Helmet>‍
        <title>{title}</title>‍
        <meta name="description" content={description} />  
        <meta
          name="keywords"
          content="Suzi AI, AI, Article Summarizer, AI Article Summarizer, Summarize article, Summarize online article"
        />      
        <meta name="twitter:card" content="summary_large_image" />        
        <meta name="twitter:site" content="@souyang" />        
        <meta name="twitter:creator" content="@souyang" />        
        <meta name="twitter:title" content={title} />        
        <meta name="twitter:description" content={description} />        
        <meta name="twitter:image" content="../assets/logo.svg"/>
      </Helmet>
      <div className='main'>
        <div className='gradient' />
      </div>
      <div className='app'>
        <Hero />
        <Demo />
      </div>
    </main>
  );
};

export default App;
