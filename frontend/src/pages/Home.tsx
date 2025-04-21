import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import App from "../App";

function Home() {
    return (
        <div>
            <h1>Welcome to the Movie Viewer App!</h1>
            <p>
                This app allows you to view a list of movies. Each movie is displayed
                with its title, release year, IMDB ID, and creation date.
            </p>
            <p>
                Click the link below to view the movie list:
            </p>
            <Link to="/movies">View Movie List</Link>
        </div>
    );
}

function Root() {
    return (
     <Router>
      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/movies" element={<App />} />
      </Routes>
     </Router>
    );
}
  
export default Root;