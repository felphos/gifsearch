import React, {useState, useRef} from 'react';
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif';

const Header = (props) => {
  return (
    <div className="header grid">
      {props.hasResults ? (
        <button onClick={props.clearSearch}>
          <img src={clearButton} alt="Clear search" />
        </button>
      ) : (
        <h1 className="title">Gif search</h1>
      )}
    </div>
  );
};

const UserHint = (props) => {
  return (
    <div className="user-hint">
      {props.loading ? (
        <img className="block mx-auto" alt="loader" src={loader} />
      ) : (
        props.hintText
      )}
    </div>
  );
};

const randomChoice = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

function App() {
  const searchInput = useRef(null);
  const [searchTerm, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gifs, setGifs] = useState([]);
  const hasResults = gifs.length;
  const hintText = error
    ? error
    : hasResults
    ? `Hit enter to see more ${searchTerm}`
    : searchTerm.length > 2
    ? `Hit enter to search ${searchTerm}`
    : '';

  const searchGiphy = async (searchTerm) => {
    setLoading(true);
    //first we try our fetch
    try {
      // here we use the await keyword to wait for our response to come back
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=y20Qd9fM8qRRjnBxmf60VN9WAd8ZJYEk&q=${searchTerm}&limit=25&offset=0&rating=r&lang=en`
      );
      // here we convert our raw response into jason data
      // const {data} gets the .data part of our response
      const {data} = await response.json();

      // here we check if the array of results is empty and we throw and error and handle on the catch
      if (!data.length) {
        setError(`Nothing found for ${searchTerm}`);
        setLoading(false);
        return;
      }

      // here we grab a random result from our images
      const randomGif = randomChoice(data);
      // add the random gif to an array of gifs
      setGifs((gifs) => [...gifs, randomGif]);
      setLoading(false);
      // setHint(`Hit enter to see more ${searchTerm}`);
      // if our fetch fails, we catch it here
    } catch (error) {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    // Same as const value = event.target.value
    const {value} = event.target;
    setSearch(value);
  };

  const handleKeyPress = (event) => {
    const {value} = event.target;
    if (value.length > 2 && event.key === 'Enter') {
      searchGiphy(value);
    }
  };
  const handleKeyUp = (event) => {
    if (event.key === 'Escape') {
      clearSearch();
    }
  };

  // Clears our search and make everything default again
  const clearSearch = () => {
    setSearch('');
    setError('');
    setGifs([]);
    searchInput.current.focus();
  };

  return (
    <div className="page">
      <Header clearSearch={clearSearch} hasResults={hasResults} />
      <div className="search grid">
        {gifs.map((gif) => (
          <Gif {...gif} />
        ))}
        <input
          className="input grid-item"
          placeholder="Type something"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onKeyUp={handleKeyUp}
          value={searchTerm}
          ref={searchInput}
        />
      </div>
      <UserHint loading={loading} hintText={hintText} />
    </div>
  );
}

export default App;
