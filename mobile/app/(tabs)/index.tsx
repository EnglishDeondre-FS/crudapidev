import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [create, setCreate] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [newMovie, setNewMovie] = useState<NewMovie>({
    title: '',
    releaseYear: '',
    imdbID: '',
  });
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to load token from AsyncStorage:', e);
      }
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
            Alert.alert(
              'Unauthorized',
              'Please login to access movie data.',
              [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
          }
        } catch (err: any) {
          setError('Error fetching movies: ' + err.message);
          Alert.alert(
            'Error',
            'Failed to connect to the server. Please try again later.',
            [{ text: 'OK' }]
          );
        } finally {
          setLoading(false);
        }
      } else {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        Alert.alert(
          'Not Logged In',
          'Please login to view the movies.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    };

    fetchMovies();
  }, [token, navigation]);

  const handleAddMovie = useCallback(async () => {
    if (!token) {
      setError('Not authenticated.');
      Alert.alert('Authentication Required', 'Please login first.');
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
        setMovies((prevMovies) => [addedMovie, ...prevMovies]);
        setNewMovie({ title: '', releaseYear: '', imdbID: '' });
        setCreate(false);
      } else {
        setError('Failed to add movie.');
        Alert.alert('Add Movie Failed', 'Unable to add the movie. Try again.');
      }
    } catch (err: any) {
      setError('Error adding movie: ' + err.message);
      Alert.alert(
        'Error',
        'Failed to connect to the server. Please try again later.'
      );
    }
  }, [token, newMovie, movies]);

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

  const handleSaveClick = useCallback(async () => {
    setEditingMovieId(null);
    Alert.alert('Info', 'Save functionality is not fully implemented.');
  }, []);

  const handleRemoveMovie = useCallback(
    async (id: string) => {
      if (!token) {
        setError('Not authenticated.');
        Alert.alert('Authentication Required', 'Please login first.');
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/movies/${id}`,
          {
            method: 'DELETE',
            headers: {
              'x-auth-token': token,
            },
          }
        );

        if (response.ok) {
          setMovies((prevMovies) =>
            prevMovies.filter((movie) => movie._id !== id)
          );
          Alert.alert('Success', 'Movie deleted successfully.');
        } else {
          setError('Failed to remove movie.');
          Alert.alert('Delete Failed', 'Unable to delete the movie. Try again.');
        }
      } catch (err: any) {
        setError('Error removing movie: ' + err.message);
        Alert.alert(
          'Error',
          'Failed to connect to the server. Please try again later.'
        );
      }
    },
    [token]
  );

  const handleInputChange = useCallback((name: string, value: string) => {
    setNewMovie((prevNewMovie) => ({ ...prevNewMovie, [name]: value }));
  }, []);

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setToken(null);
    setMovies([]);
    setError(null);
    navigation.navigate('Login');
  };

  useEffect(() => {
    if (!token) {
      setMovies([]);
    }
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Movie Viewer App</Text>

      {token ? (
        <Button title="Logout" onPress={handleLogout} />
      ) : (
        <Button title="Go to Login" onPress={goToLogin} />
      )}

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>
            Title
            <Pressable onPress={() => setCreate(!create)}>
              <Icon name="plus-circle" size={20} color="green" />
            </Pressable>
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

        {loading ? (
          <Text>Loading movies...</Text>
        ) : error ? (
          <Text>Error: {error}</Text>
        ) : (
          movies.map(renderMovieRow)
        )}
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
