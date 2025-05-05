import React, { useState, useEffect } from 'react';
import './App.css';
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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [create, setCreate] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [newMovie, setNewMovie] = useState<NewMovie>({
    title: '',
    releaseYear: '',
    imdbID: '',
  });
  const [token, setToken] = useState<string | null>(null); // State to store the token
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to load the token from local storage
    const loadToken = async () => {
      const storedToken = localStorage.getItem('userToken'); // Use localStorage in web
      setToken(storedToken);
    };

    loadToken();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/movies', {
            headers: {
              'x-auth-token': token,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setMovies(data);
          } else {
            setError(
              'Failed to fetch movies. Please ensure you are logged in.'
            );
          }
        } catch (err: any) {
          setError('Error fetching movies: ' + err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError('No authentication token found. Please log in.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, [token]);

  const handleAddMovie = async () => {
    if (!token) {
      setError('Not authenticated.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        const addedMovie = await response.json();
        setMovies([addedMovie, ...movies]);
        setNewMovie({ title: '', releaseYear: '', imdbID: '' });
        setCreate(false);
      } else {
        setError('Failed to add movie.');
      }
    } catch (err: any) {
      setError('Error adding movie: ' + err.message);
    }
  };

  const handleMovieInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { name, value } = e.target;
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie._id === id
          ? {
              ...movie,
              [name]: name === 'releaseYear' ? parseInt(value, 10) : value,
            }
          : movie
      )
    );
  };

  const handleEditClick = (id: string) => {
    setEditingMovieId(id);
  };

  const handleSaveClick = async () => {
    setEditingMovieId(null);
  };

  const handleRemoveMovie = async (id: string) => {
    if (!token) {
      setError('Not authenticated.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        setMovies(movies.filter((movie) => movie._id !== id));
      } else {
        setError('Failed to remove movie.');
      }
    } catch (err: any) {
      setError('Error removing movie: ' + err.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };
  if (loading) {
    return <div>Loading movies...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1>Movie Viewer App</h1>

      <div>
        <table>
          <thead>
            <tr>
              <th>
                Title
                <Icon icon="eva:plus-circle-fill" onClick={() => setCreate(!create)} />
              </th>
              <th>Release Year</th>
              <th>IMDB ID</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>

            {create && (
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
                    type="text"
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
                  <button onClick={handleAddMovie} id="create_button">
                    <Icon icon="eva:plus-circle-fill" /> Add
                  </button>
                </td>
              </tr>
            )}
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td>
                  {editingMovieId === movie._id ? (
                    <input
                      type="text"
                      name="title"
                      value={movie.title}
                      onChange={(e) => handleMovieInputChange(e, movie._id)}
                    />
                  ) : (
                    <div onClick={() => handleEditClick(movie._id)}>{movie.title}</div>
                  )}
                </td>
                <td>
                  {editingMovieId === movie._id ? (
                    <input
                      type="text"
                      name="releaseYear"
                      value={String(movie.releaseYear)}
                      onChange={(e) => handleMovieInputChange(e, movie._id)}
                    />
                  ) : (
                    <div onClick={() => handleEditClick(movie._id)}>
                      {movie.releaseYear}
                    </div>
                  )}
                </td>
                <td>
                  {editingMovieId === movie._id ? (
                    <input
                      type="text"
                      name="imdbID"
                      value={movie.imdbID}
                      onChange={(e) => handleMovieInputChange(e, movie._id)}
                    />
                  ) : (
                    <div onClick={() => handleEditClick(movie._id)}>{movie.imdbID}</div>
                  )}
                </td>
                <td data-label="Created At">{movie.created_at}</td>
                <td>
                  {editingMovieId === movie._id ? (
                    <button onClick={handleSaveClick}>Save</button>
                  ) : (
                    <button onClick={() => handleRemoveMovie(movie._id)}>
                      <Icon icon="mdi:trash-can" />
                    </button>
                  )}
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
