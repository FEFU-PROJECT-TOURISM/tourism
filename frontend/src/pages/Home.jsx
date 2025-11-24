// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import TourCard from '../components/TourCard';
import { getTours } from '../services/api';
import './Home.css';

const Home = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const loadTours = async () => {
      try {
        const data = await getTours();
        setTours(Array.isArray(data) && data.length > 0 ? data : Array(6).fill(null));
      } catch (err) {
        setTours(Array(6).fill(null));
      }
    };

    loadTours();
  }, []);

  return (
    <div className="home">
      <header className="home-header">
        <h1>Туристические экскурсии</h1>
        <p>Откройте для себя удивительные места вместе с нами</p>
      </header>

      <main className="tours-grid">
        {tours.map((tour, index) => (
          <TourCard key={index} tour={tour} />
        ))}
      </main>
    </div>
  );
};

export default Home;
