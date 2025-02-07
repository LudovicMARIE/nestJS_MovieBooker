import { useEffect, useState } from "react";
import MovieReservation from "./MovieReservation";

const Movies = ({ token }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const fetchMovies = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/movies?page=${page}&query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setMovies(data.results);
  };

  useEffect(() => {
    fetchMovies();
  }, [page, query]);

  return (
    <div>
      <div className="space-x-4 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="p-2 border rounded"
        />
        <button onClick={fetchMovies} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {movies.map((movie) => (
          <div key={movie.id} className="border p-4 rounded max-w-[280px] w-full mx-auto">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-56 object-cover"/>
            <h3 className="font-semibold">{movie.title}</h3>
            <div className="font-semibold">Movie ID : {movie.id}</div>
            <p>{movie.overview}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="bg-blue-500 text-white py-2 px-4 rounded">
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} className="bg-blue-500 text-white py-2 px-4 rounded">
          Next
        </button>
      </div>
      <MovieReservation />
    </div>
  );
};

export default Movies;
