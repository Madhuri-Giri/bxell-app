import React, { useEffect, useState } from "react";
import { fetchNewsRes } from "../../../../API/apiServices";
import "./News.css"; 

const News = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      const data = await fetchNewsRes();
      if (data && data.news) {
       setNewsData(data.news);
      }
    };
    getNews();
  }, []);

  return (
    <div className="news_box">
      <div className="news_label">News</div>
      <div className="news_ticker">
        {newsData.length > 0 ? (
          newsData.map((newsItem) => (
            <span key={newsItem.id}  dangerouslySetInnerHTML={{ __html: newsItem.news }} />
          ))
        ) : (
          <span>No news available.</span>
        )}
      </div>
    </div>
  );
};

export default News;
