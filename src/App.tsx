import React, { useState } from 'react';
import '../App.css';
import { Icon } from '@iconify/react';

interface Movie {
 _id: string;
 title: string;
 releaseYear: number;
 imdbID: string;
 created_at: string;
}

interface NewMovie {
 title: string;
 releaseYear: string;
 imdbID: string;
}

function App() {
 const [movies, setMovies] = useState<Movie[]>([
  {
   _id: '1',
   title: 'The Shawshank Redemption',
   releaseYear: 1994,
   imdbID: 'tt0111161',
   created_at: '2024-01-01T00:00:00.000Z',
  },
  {
   _id: '2',
   title: 'The Godfather',
   releaseYear: 1972,
   imdbID: 'tt0068646',
   created_at: '2024-01-02T00:00:00.000Z',
  },
  {
   _id: '3',
   title: 'The Dark Knight',
   releaseYear: 2008,
   imdbID: 'tt0468569',
   created_at: '2024-01-03T00:00:00.000Z',
  },
 ]);

 const [newMovie, setNewMovie] = useState<NewMovie>({
  title: '',
  releaseYear: '',
  imdbID: '',
 });

 const handleAddMovie = () => {
  const newMovieToAdd: Movie = {
   _id: String(Date.now()),
   title: newMovie.title,
   releaseYear: parseInt(newMovie.releaseYear, 10), // Ensure it's a number
   imdbID: newMovie.imdbID,
   created_at: new Date().toISOString(),
  };

  setMovies([newMovieToAdd, ...movies]); // Add to the beginning
  setNewMovie({ title: '', releaseYear: '', imdbID: '' }); // Reset
 };

 const handleRemoveMovie = (id: string) => {
  setMovies(movies.filter((movie) => movie._id !== id));
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
 };

 return (
  <>
   <h1>Movie Viewer App</h1>

   {/* Movie Table */}
   <div>
    <table>
     <thead>
      <tr>
       <th>
        Title <Icon icon="eva:plus-circle-fill" onClick={() => {}} />
       </th>
       <th>Release Year</th>
       <th>IMDB ID</th>
       <th>Created At</th>
       <th>Actions</th>
      </tr>

      {/* New Movie Input Row */}
      <tr>
       <td>
        <input
         type="text"
         name="title"
         placeholder="Title"
         value={newMovie.title}
         onChange={handleInputChange}
        />
       </td>
       <td>
        <input
         type="date"
         name="releaseYear"
         placeholder="Release Year"
         value={newMovie.releaseYear}
         onChange={handleInputChange}
        />
       </td>
       <td>
        <input
         type="text"
         name="imdbID"
         placeholder="IMDB ID"
         value={newMovie.imdbID}
         onChange={handleInputChange}
        />
       </td>
       <td></td> {/* Empty cell for Created At */}
       <td>
        <button onClick={handleAddMovie}>
         <Icon icon="eva:plus-circle-fill" /> Add
        </button>
       </td>
      </tr>
     </thead>
     <tbody>
      {movies.map((movie) => (
       <tr key={movie._id}>
        <td data-label="Title">{movie.title}</td>
        <td data-label="Release Year">{movie.releaseYear}</td>
        <td data-label="IMDB ID">{movie.imdbID}</td>
        <td data-label="Created At">{movie.created_at}</td>
        <td>
         <button onClick={() => handleRemoveMovie(movie._id)}>
          <Icon icon="mdi:trash-can" />
         </button>
        </td>
       </tr>
      ))}
     </tbody>
    </table>
   </div>
  </>
 );
}

export default App;
