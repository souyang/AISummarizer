import React, { useState, useEffect, useMemo } from "react";

import { copy, linkIcon, loader, tick, deleteIcon } from "../assets";
import { useFetchSummaryMutation } from "../services/article";

/**
 * Render a list of strings with a specified gap between them.
 *
 * @param {Object} props - The component props.
 * @param {string[]} props.stringArray - The array of strings to render.
 * @param {number} props.gap - The gap between the rendered strings, in pixels.
 * @returns {JSX.Element} - The rendered component.
 */
const SentenceRenderer = React.memo(({ stringArray, gap }) => {
  return (
    // Use a flex container to display the strings in a column with the specified gap
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {/* Map over the string array and render each string as a <span> element */}
      {stringArray.map((word, index) => (
        <span key={index}>{word}</span>
      ))}
    </div>
  );
});

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const ERROR_MESSAGE = "Unfortunately, we cannot find the article you are looking for."
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const currentYear = useMemo(() => {
    return new Date().getFullYear();
  }, []);
  // RTK lazy query
  const [fetchSummary, { error, isLoading }] = useFetchSummaryMutation();

  // Load data from localStorage on mount
  useEffect(() => {
    const articles = localStorage.getItem("articles");
    if ( articles) {
        const articlesFromLocalStorage = JSON.parse(
          articles
        );

        if (articlesFromLocalStorage) {
          setAllArticles(articlesFromLocalStorage);
        }
    }
  }, []);

  useEffect(() => {
    if (error) {
      setErrorMessage(ERROR_MESSAGE);
    }
  }, [error])

  const handleClear = () => {
    setErrorMessage("");
    setArticle({summary: "", url: ""});
  }

  const handleClearAll = () => {
    setArticle({summary: "", url: ""});
    setAllArticles([]);
    setErrorMessage("");
    localStorage.removeItem("articles");
  }

  /**
   * Handles the submission of a form with a URL as input.
   * - Checks if the URL is empty and returns early if it is.
   * - Checks if the URL already exists in the state and if it does, sets the
   * state to the existing article.
   * - Calls the fetchSummary mutation with the URL and default values.
   * - If the mutation is successful, updates the state and localStorage.
   * - If the mutation fails, returns early.
   * @param {Event} e The React event for the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!article.url || !isValidURL(article.url)) {
      setErrorMessage("Please enter a valid URL");
      return;
    }
    setErrorMessage("");
    const url = article.url;
    const existingArticle = allArticles.find(
      (item) => item.url === url
    );
   
    if (existingArticle) return setArticle(existingArticle);

    const { data } = await fetchSummary({ url, text: "", sentnum: 5});
    
    if (data?.sentences && data.sentences.length > 1) {
      const newArticle = { ...article, summary: data.sentences };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    } else {
      setErrorMessage("Article was blocked or not found by the website.");
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDelete = (deleteUrl) => {
    const updatedAllArticles = allArticles.filter(
      (item) => item.url !== deleteUrl
    );
    setAllArticles(updatedAllArticles);
    localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
  } 

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <section className='mt-16 w-full max-w-xl flex flex-col min-h-screen'>
      {/* Search */}
      <div id="body-container" class="flex-grow p-6">
        <div className='flex flex-col w-full gap-2'>
          <form
          >
            <div className='relative flex justify-center items-center mx-auto w-4/5 md:w-full'>
            <img
              src={linkIcon}
              alt='link-icon'
              className='absolute left-0 my-2 ml-3 w-5'
            />
            <label htmlFor="article-url" className="sr-only">Article URL</label>
            <input
              type='url'
              id="article-url"
              aria-describedby="url-description"
              placeholder='Paste the article online link'
              value={article?.url}
              onChange={(e) => setArticle({ ...article, url: e.target.value })}
              onKeyDown={handleKeyDown}
              required
              className='url_input peer' // When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers to style the target element
            />
            {article?.url.length !== 0 && (<button
              type='button'
              aria-label="Clear the input field" 
              onClick={handleClear}
              className='clear_btn peer-focus:border-gray-700 peer-focus:text-gray-700 '
            >
              <p>x</p>
            </button>)}
            </div>
            <div className="flex justify-center items-center mt-12 md:mt-10">
            <button type="button"  
            aria-label="Get Summary" 
            className={`hover:border-blue-700 border-2 border-blue-500 py-2 px-5 font-satoshi font-medium text-lg text-white bg-blue-500 rounded-xl ml-10 cursor-pointer`} onClick={handleSubmit}>
              Get Summary
            </button>
            <button type="button" 
            aria-label="Clear All History" 
            className="hover:border-gray-300
            active:border-blue-500 py-2 px-5 ml-5 font-satoshi font-medium text-lg  text-blue-500 border-gray-100 border-2 bg-gray-200 rounded-xl cursor-pointer" disabled={article?.url.length === 0} onClick={handleClearAll}>
              Clear History
            </button>
            </div>
          </form>
          {/* Browse History */}
          {allArticles?.length > 0 &&<div className="pt-5">
          <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                  <span className='blue_gradient'>Link History</span>
            </h2>
          </div>}
          <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
            {allArticles.reverse().map((item, index) => (
              <div
                key={`link-${index}`}
                tabIndex="0"
                role="button"
                onClick={() => setArticle(item)}
                onKeyPress={(e) => e.key === "Enter" && setArticle(item)}
                className='link_card cursor-pointer'
              >
                <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                  <img
                    src={copied === item.url ? tick : copy}
                    alt={copied === item.url ? "tick_icon" : "copy_icon"}
                    className='w-[40%] h-[40%] object-contain'
                  />
                </div>
                <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                  {item.url}
                </p>
                <div className='copy_btn' onClick={() => handleDelete(item.url)}>
                <img src={deleteIcon} alt="delete_icon" className='w-[40%] h-[40%] object-contain' />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Display Result */}
        <div className='my-10 max-w-full flex justify-center items-center'>
          {isLoading ? (
            <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
          ) : errorMessage ? (
            <p 
              role="alert"
              className='font-inter font-bold text-red-500 text-center'
            >
            {errorMessage}
            </p>
          ) : (
            article.summary && Array.isArray(article.summary) && (
              <div>
                <h2 className='font-satoshi font-bold text-gray-600 text-xl mb-3'>
                <span className='blue_gradient'>Article Summary</span>
                </h2>
                <div className='flex flex-col gap-3'>
                  <div className='summary_box'>
                    <div className='copy_btn mb-2 ml-auto' onClick={() => handleCopy(article.summary)}>
                    <img
                      src={copied === article.summary ? tick : copy}
                      alt={copied === article.summary ? "tick_icon" : "copy_icon"}
                      className='w-[40%] h-[40%] object-contain'
                    />
                  </div>
                    <p className='font-inter font-medium text-sm text-gray-700'>
                      <SentenceRenderer stringArray={article.summary} gap={10} />
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
