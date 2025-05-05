import { Request, Response, NextFunction } from 'express';
import Movie from '../models/Movie';
import auth from '../middleware/authMiddleware';

interface AuthRequest extends Request {
  userId?: string;
}

export const getMovies = async (req: AuthRequest, res: Response) => {
  try {
    const movies = await Movie.find().sort({ created_at: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const addMovie = async (req: AuthRequest, res: Response) => {
  const { title, releaseYear, imdbID } = req.body;
  const newMovie = new Movie({ title, releaseYear, imdbID });
  try {
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const deleteMovie = async (req: AuthRequest, res: Response) => {
  try {
    const removedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!removedMovie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
