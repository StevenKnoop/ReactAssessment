import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const TVShow = (props) => (
  <div className="item">
    <a href="#1">
      <img
        src={props.tvShow.image}
        alt={props.tvShow.fullTitle} />
      <h1 className="heading">{props.tvShow.fullTitle}</h1>
        <FontAwesomeIcon  icon={faStar}
                          style={props.tvShow.onUserList ? {color: 'yellow'} : {color: 'gray'}}  
                          data-onuserlist={props.onUserList}  
                          onClick={() => {
                            props.addTVShow(props.tvShow);
                          }}/>
    </a>
  </div>
);

export default function Dashboard() {
  const [tvShows, setTVShows] = useState([]);

  useEffect(() => {
    async function getTVShows() {

      let url = 'http://localhost:5000/tvshow/'+localStorage.getItem('token');
      const userTVShowsResponse = await fetch(url);
      const userTVShows = await userTVShowsResponse.json();
      // TODO: If a TVShow from TVShow MongoDB exists then make favicon light up
      // Plus: if favicon already light and user clicks it then it must be deleted from TVShows MongoDB 

      //const response = await fetch('https://imdb-api.com/en/API/Top250TVs/k_rii7731a');
      //if (!response.ok) {
      //  const message = `An error occurred: ${response.statusText}`;
      //  window.alert(message);
      //  return;
      //}
      //const tvShows = await response.json();

      // TODO: Remove these two bottom lines to use the API
      let tvShows = {};
      tvShows.errorMessage = "error";

      // Incase the Free IMBM api limit is reached
      if (tvShows?.errorMessage) {
        const response = await fetch('k_rii7731a.json',
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        tvShows = await response.json();
      }

      tvShows.items.forEach(data => {
        data.onUserList = false;
        //we search in the data for a matching element that corresponds to the related_event id
        const targetElement = userTVShows.find(element => {return element.id === data.id});
        
        //check if that element actually exists, just to be sure
        if (!!targetElement) {
          data.onUserList = true;
        }
      });

      setTVShows(tvShows.items);
    }

    getTVShows();

    return;
  }, [tvShows.length]);

  async function addRemoveTVShow(tvShowId, onUserList) {
    let userTVShow = {
      id: tvShowId,
      user_id: localStorage.getItem('token')
    }
    await fetch('http://localhost:5000/tvshow/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userTVShow)
    })
      .then(data => data.json())
  }

  // This method will map out the tvShows
  function tvShowsList(i) {
    let counter = (i - 1) * 5;
    return tvShows.slice(counter, counter + 5).map((tvShow) => {
      return (
        <TVShow
          tvShow={tvShow}
          addTVShow={() => addRemoveTVShow(tvShow.id, tvShow.onUserList)}
          key={tvShow.id}
        />
      );
    });
  }

  // TODO: Bug Fix
  // Logic or nesting is incorrect, need to load 50 sections not only 1

  // Each section has 5 shows, generate 50 sections because there are 250 shows
  function sectionList() {
    if (tvShows.length > 0) {
      for (var i = 1; i < tvShows.length; i + 5) {
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

  return (
    <div className="wrapper">
      {sectionList()}
    </div>
  );
}