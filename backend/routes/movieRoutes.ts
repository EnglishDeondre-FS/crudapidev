import express from 'express';
import { getMovies, addMovie, deleteMovie } from '../controllers/movieController';

const router = express.Router();

router.get('/movies', getMovies);
router.post('/movies', addMovie);
router.delete('/movies/:id', deleteMovie);

export default router;
