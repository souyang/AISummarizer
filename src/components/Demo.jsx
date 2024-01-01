import React, { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick, deleteIcon } from "../assets";
import { useFetchSummaryMutation } from "../services/article";

const SentenceRenderer = ({ stringArray, gap }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {stringArray.map((word, index) => (
        <span key={index}>{word}</span>
      ))}
    </div>
  );
};


const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  // RTK lazy query
  const [fetchSummary, { error, isLoading }] = useFetchSummaryMutation();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!article.url) return;
    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await fetchSummary({ url: article.url, text: "", sentnum: 5});
    if (data?.sentences) {
      const newArticle = { ...article, summary: data.sentences };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
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
    <section className='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt='link-icon'
            className='absolute left-0 my-2 ml-3 w-5'
          />

          <input
            type='url'
            placeholder='Paste the article online link'
            value={article?.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className='url_input peer' // When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers to style the target element
          />
          <button
            type='submit'
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 '
          >
            <p>↵</p>
          </button>
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
              onClick={() => setArticle(item)}
              className='link_card'
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
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Well, that wasn't supposed to happen...
            <br />
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && Array.isArray(article.summary) && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                <span className='blue_gradient'>Article Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                   <SentenceRenderer stringArray={article.summary} gap={10} />
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
