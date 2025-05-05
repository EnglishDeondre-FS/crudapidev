import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons';

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

const HomeScreen = () => {
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

  const [create, setCreate] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [newMovie, setNewMovie] = useState<NewMovie>({
    title: '',
    releaseYear: '',
    imdbID: '',
  });

  const handleAddMovie = useCallback(() => {
    const newMovieToAdd: Movie = {
      _id: String(Date.now()),
      title: newMovie.title,
      releaseYear: parseInt(newMovie.releaseYear, 10),
      imdbID: newMovie.imdbID,
      created_at: new Date().toISOString(),
    };

    setMovies((prevMovies) => [newMovieToAdd, ...prevMovies]);
    setNewMovie({ title: '', releaseYear: '', imdbID: '' });
    setCreate(false);
  }, [newMovie]);

  const handleMovieInputChange = useCallback(
    (id: string, name: string, value: string) => {
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
    },
    []
  );

  const handleEditClick = useCallback((id: string) => {
    setEditingMovieId(id);
  }, []);

  const handleSaveClick = useCallback(() => {
    setEditingMovieId(null);
  }, []);

  const handleRemoveMovie = useCallback((id: string) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
  }, []);

  const handleInputChange = useCallback((name: string, value: string) => {
    setNewMovie((prevNewMovie) => ({ ...prevNewMovie, [name]: value }));
  }, []);

  const renderMovieRow = useCallback(
    (movie: Movie) => (
      <View key={movie._id} style={styles.row}>
        {editingMovieId === movie._id ? (
          <TextInput
            style={styles.input}
            value={movie.title}
            onChangeText={(text) =>
              handleMovieInputChange(movie._id, 'title', text)
            }
          />
        ) : (
          <Pressable onPress={() => handleEditClick(movie._id)}>
            <Text style={styles.cell}>{movie.title}</Text>
          </Pressable>
        )}

        {editingMovieId === movie._id ? (
          <TextInput
            style={styles.input}
            value={String(movie.releaseYear)}
            onChangeText={(text) =>
              handleMovieInputChange(movie._id, 'releaseYear', text)
            }
            keyboardType="number-pad"
          />
        ) : (
          <Pressable onPress={() => handleEditClick(movie._id)}>
            <Text style={styles.cell}>{movie.releaseYear}</Text>
          </Pressable>
        )}

        {editingMovieId === movie._id ? (
          <TextInput
            style={styles.input}
            value={movie.imdbID}
            onChangeText={(text) =>
              handleMovieInputChange(movie._id, 'imdbID', text)
            }
          />
        ) : (
          <Pressable onPress={() => handleEditClick(movie._id)}>
            <Text style={styles.cell}>{movie.imdbID}</Text>
          </Pressable>
        )}

        <Text style={styles.cell}>{movie.created_at}</Text>

        {editingMovieId === movie._id ? (
          <Button title="Save" onPress={handleSaveClick} />
        ) : (
          <Pressable onPress={() => handleRemoveMovie(movie._id)}>
            {/* <Icon name="trash-can" size={20} color="red" /> */}
          </Pressable>
        )}
      </View>
    ),
    [editingMovieId, handleEditClick, handleMovieInputChange, handleRemoveMovie, handleSaveClick]
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Movie Viewer App</Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>
            Title
            {/* <Icon name="plus-circle" size={20} onPress={() => setCreate(!create)} /> */}
          </Text>
          <Text style={styles.headerCell}>Release Year</Text>
          <Text style={styles.headerCell}>IMDB ID</Text>
          <Text style={styles.headerCell}>Created At</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>

        {create && (
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newMovie.title}
              onChangeText={(text) => handleInputChange('title', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Release Year"
              value={newMovie.releaseYear}
              onChangeText={(text) => handleInputChange('releaseYear', text)}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="IMDB ID"
              value={newMovie.imdbID}
              onChangeText={(text) => handleInputChange('imdbID', text)}
            />
            <View style={styles.cell} />
            <Button title="Add" onPress={handleAddMovie} />
          </View>
        )}

        {movies.map(renderMovieRow)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  headerCell: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;
