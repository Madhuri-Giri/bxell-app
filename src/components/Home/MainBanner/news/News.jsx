import React, { useEffect, useState } from "react";
import { fetchNewsRes } from "../../../../API/apiServices";
import "./News.css"; // Import the CSS file for styling

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
      {/* Static "News" label */}
      <div className="news_label">News</div>

      {/* Scrolling ticker */}
      <div className="news_ticker">
        {newsData.length > 0 ? (
          newsData.map((newsItem) => (
            <span
              key={newsItem.id}
              dangerouslySetInnerHTML={{ __html: newsItem.news }}
            />
          ))
        ) : (
          <span>No news available.</span>
        )}
      </div>
    </div>
  );
};

export default News;
