import React, { useEffect, useState } from "react";

async function addTVShow(tvShowData) {
  return fetch('http://localhost:5000/tvshow/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tvShowData)
  })
  .then(data => data.json())
}

const handleAddNewTVShow = async e => {
  e.preventDefault();
  const data = await addTVShow({
    email,
    password
  });
}

const TVShow = (props) => (
  <div className="item">
        <a href={handleAddNewTVShow}>
        <img
          src={props.tvShow.image}
          alt={props.tvShow.fullTitle}/>
          <h1 class="heading">{props.tvShow.fullTitle}</h1>
      </a>
    </div>
 );

export default function Dashboard() {
  const [tvShows, setTVShows] = useState([]);
  
  useEffect(() => {
    
    async function getTVShows() {
      const response = await fetch('https://imdb-api.com/en/API/Top250TVs/k_rii7731a');
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const tvShows = await response.json();
      // Incase the Free IMBM api limit is reached
      if(tvShows?.errorMessage) {
          const responseJSONFile = await fetch('k_rii7731a.json',
                                    {
                                      headers : { 
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                      }
                                    });
          const tvShowsJSONFile = await responseJSONFile.json();
          setTVShows(tvShowsJSONFile.items);
      } else {
        setTVShows(tvShows.items);
      }
    }
  
    getTVShows();
    
    return;
 }, [tvShows.length]);

   // This method will map out the tvShows
   function tvShowsList(i) {
      let counter = (i - 1) * 5;
      return tvShows.slice(counter, counter + 5).map((tvShow) => {
        return (
          <TVShow
            tvShow={tvShow}
            key={tvShow.id}
          />
        );
      });
  }

  // Each section has 5 shows, generate 50 sections because there are 250 shows
  function sectionList() {
    if(tvShows.length > 0) {
      for (var i = 1; i < tvShows.length; i+5) {
          let sectionName = "section" + i;
          let before = "#section" + (i === 1 ? (tvShows.length / 5) : i - 1) 
          let after = "#section" + (i === (tvShows.length / 5) ? 1 : i + 1) 

          return (
            <section id={sectionName}>
              <a href={before} className="arrow__btn left-arrow">‹</a>
                {tvShowsList(i)}
              <a href={after} className="arrow__btn right-arrow">›</a>
            </section>
          );
         
        }
    }
  }

  return(
    <div className="wrapper">
      {sectionList()}
    </div>
  );
}