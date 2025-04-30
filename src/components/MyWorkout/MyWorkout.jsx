import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setWorkouts } from "../../redux/userSlice";
import axios from 'axios';
import WorkoutCard from './WorkoutCard';

export default function MyWorkout() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.user.authUser);
  const workouts = useSelector((state) => state.user.workouts) || [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000; 

  useEffect(() => {
    if (authUser && authUser._id) {
      const lastGenerated = localStorage.getItem("workoutsGeneratedAt");
      const now = new Date().getTime();

      if (!lastGenerated || now - parseInt(lastGenerated) > FOUR_DAYS) {
        generateNewWorkouts(authUser._id);
      } else {
        fetchWorkouts(authUser._id);
      }
    }
  }, [authUser]);

  const generateNewWorkouts = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/workouts/user/${userId}?TraningEXP=Beginner`, {
  withCredentials: true
});
      localStorage.setItem("workoutsGeneratedAt", new Date().getTime().toString());
      fetchWorkouts(userId);
    } catch (err) {
      console.error("Failed to generate new workouts", err);
      setError("Failed to generate workouts.");
    } finally {
      setLoading(false);
    }
  };
  

  const fetchWorkouts = async (userId) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/workouts/user/${userId}`, {
        withCredentials: true
      });
  
      if (response.data) {
        let fetchedWorkouts = [];
  
        if (Array.isArray(response.data)) {
          fetchedWorkouts = response.data[0]?.workouts || [];
        } else if (response.data.workouts) {
          fetchedWorkouts = response.data.workouts;
        }
  
        
        const cycleStart = parseInt(localStorage.getItem("workoutsGeneratedAt")) || new Date().getTime();
        const currentDayOffset = Math.floor((new Date().getTime() - cycleStart) / (24 * 60 * 60 * 1000));
        const dayCycleIndex = currentDayOffset % 4;
  
        const updatedWorkouts = fetchedWorkouts.map((workout, idx) => ({
          ...workout,
          day: `Day ${((idx + dayCycleIndex) % 4) + 1}`
        }));
  
        dispatch(setWorkouts(updatedWorkouts));
      } else {
        dispatch(setWorkouts([]));
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to load workouts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">My Workout Plan</h2>

      {loading && <p className="text-center">Loading workouts...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {!loading && !error && workouts.length > 0 ? (
            workouts.slice(0, 4).map((workout, index) => (
              <WorkoutCard
                key={index}
                day={workout.day}
                title={workout.title}
                exercises={workout.exercises}
                note={workout.note}
              />
            ))
          ) : (
            !loading && !error && (
              <p className="text-center text-gray-500 col-span-full">No workouts available.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
