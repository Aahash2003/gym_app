import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CreateCategory from './CreateCategory';
import CategoryCard from './CategoryCard';
import './Workout.css'; // Import the CSS file for styling
import { Stack } from '@mui/material';

const WorkoutLogger = () => {
  const email = localStorage.getItem('email'); // Local storage set in the login

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [workoutsByCategory, setWorkoutsByCategory] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null); // New state for selected workout
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weight: '', restTime: '', currentRepMax: '', oneRepMax: '' }
  ]);
  const [workouts, setWorkouts] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchCategories();
  }, [email]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/workout/workoutCategories');
      setCategories(response.data);
    } catch (error) {
      alert('Error fetching workout categories: ' + error.message);
    }
  };

  useEffect(() => {
    if (email && date) {
      fetchWorkouts();
    }
  }, [email, date]);

  const fetchWorkouts = async () => {
    try {
        // Send the UTC date string (YYYY-MM-DD)
        const utcDate = date.toISOString().split('T')[0];

        const response = await axios.get(`http://localhost:8080/api/workout/user/${email}/workouts`, {
            params: {
                date: utcDate // Send the UTC date
            }
        });

        // Set the workouts directly
        setWorkouts(response.data);
        console.log(response.data)
    } catch (error) {
        alert('Error fetching workouts: ' + error.message);
    }
};




  const fetchWorkoutsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/workout/category/${categoryId}/workouts`);
      setWorkoutsByCategory(response.data);

      // Filter out duplicate workouts by comparing exercise names
      const uniqueWorkouts = response.data.reduce((acc, workout) => {
        const existingWorkout = acc.find(w => w.exercises.map(e => e.name).sort().join(', ') === workout.exercises.map(e => e.name).sort().join(', '));
        if (!existingWorkout) {
          acc.push(workout);
        }
        return acc;
      }, []);

      setWorkoutsByCategory(uniqueWorkouts);
    } catch (error) {
      alert('Error fetching workouts by category: ' + error.message);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedWorkout(null); // Reset selected workout
    if (categoryId) {
        fetchWorkoutsByCategory(categoryId); // Fetch workouts for the selected category
    } else {
        setWorkoutsByCategory([]); // Clear workouts if no category is selected
    }
};



  const handleWorkoutSelect = (workoutId) => {
    const workout = workoutsByCategory.find(w => w._id === workoutId);
    setSelectedWorkout(workout);
    if (workout) {
      setExercises(workout.exercises); // Populate form with existing workout data
    }
  };

 /* const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '', restTime: '', currentRepMax: '', oneRepMax: '' }]);
  };
  */

  const handleRemoveExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = exercises.map((exercise, i) => {
      if (i === index) {
        const updatedExercise = { ...exercise, [field]: value };

        // Automatically calculate the one rep max when weight or reps change
        if (field === 'weight' || field === 'reps') {
          const weightValue = parseFloat(updatedExercise.weight);
          const repsValue = parseInt(updatedExercise.reps, 10);

          if (!isNaN(weightValue) && !isNaN(repsValue) && repsValue > 0) {
            const calculatedOneRepMax = (weightValue / (1.0278 - 0.0278 * repsValue)).toFixed(2);
            updatedExercise.oneRepMax = calculatedOneRepMax;
          } else {
            updatedExercise.oneRepMax = '';
          }
        }

        return updatedExercise;
      }
      return exercise;
    });
    setExercises(newExercises);
  };

  const handleLogWorkout = async () => {
    if (!selectedCategory) {
        alert('Please select a workout category.');
        return;
    }

    if (exercises.length === 0 || !exercises[0].name.trim()) {
        alert('Please add at least one exercise with a valid name.');
        return;
    }
console.log("Date: "+date.toISOString())
    try {
        const payload = {
            exercises,
            email,
            date: date.toISOString(),  // Send the selected date in ISO format
            categoryId: selectedCategory,
        };

        if (selectedWorkout) {
            payload.workoutId = selectedWorkout._id; // Pass the workoutId if editing an existing workout
        }

        const response = await axios.post('http://localhost:8080/api/workout/logWorkout', payload);
        alert('Workout logged successfully');
        fetchWorkouts();  // Refresh the workouts list
    } catch (error) {
        console.error("Error logging workout:", error.response?.data || error.message);
        alert('Error logging workout: ' + (error.response?.data.message || error.message));
    }
};

  const onDateChange = (newDate) => {
    setDate(newDate);
    fetchWorkouts();
};

const filteredWorkouts = workoutsByCategory.filter(workout => {
    const workoutDate = new Date(workout.date).toDateString();
    const selectedDate = date.toDateString();
    return workoutDate === selectedDate;
});


return (
  <div className="container">
    <h2>{date.toDateString()}</h2>
    <Calendar onChange={onDateChange} value={date} />

    <CreateCategory onCategoryCreated={fetchCategories} />

    <div className="category-selection">

    <Stack
  direction="row" // Set the direction to 'row' for horizontal alignment
  spacing={2} // Add spacing between each CategoryCard
  className="category-selection"
  sx={{
    overflowX: 'auto', // Enable horizontal scrolling if content overflows
    whiteSpace: 'nowrap', // Prevent line breaks inside the container
    padding: '10px', // Optional: Add padding inside the container
  }}
>
  {categories.map(category => (
    <CategoryCard
      key={category._id}
      category={category}
      setSelectedCategory={(categoryId) => {
        handleCategoryChange(categoryId);
        // Add the scroll effect when a category is selected
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // Adjust 'top' and 'left' as needed
      }}
      selectedCategory={selectedCategory}
    />
  ))}
</Stack>


    </div>

    {workoutsByCategory.length > 0 && (
      <div>
        <h3>Workouts in Selected Category</h3>
        <ul className="workout-list">
          {workoutsByCategory.map((workout) => (
            <li key={workout._id}>
              <strong>{workout.exercises.map(e => e.name).join(', ')}</strong>
              <button onClick={() => handleWorkoutSelect(workout._id)}>Edit Workout</button>
              <ul>
                {workout.exercises.map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight} LBS, Rest Time: {exercise.restTime}s, Current Rep Max: {exercise.currentRepMax} LBS, One Rep Max: {exercise.oneRepMax} LBS
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )}

    <h3>Exercises</h3>
    {exercises.map((exercise, index) => (
      <div key={index} className="exercise-container">
        <input
          type="text"
          placeholder="Exercise Name"
          value={exercise.name}
          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
        />
        <input
          type="number"
          placeholder="Sets"
          value={exercise.sets}
          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
        />
        <input
          type="number"
          placeholder="Reps"
          value={exercise.reps}
          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight"
          value={exercise.weight}
          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
        />
        <input
          type="number"
          placeholder="Rest Time"
          value={exercise.restTime}
          onChange={(e) => handleExerciseChange(index, 'restTime', e.target.value)}
        />
        <input
          type="number"
          placeholder="Current Rep Max"
          value={exercise.currentRepMax}
          onChange={(e) => handleExerciseChange(index, 'currentRepMax', e.target.value)}
        />
        <div className="one-rep-max-container">
          <input
            type="text"
            placeholder="One Rep Max"
            value={exercise.oneRepMax}
            readOnly
          />
          <span className="one-rep-max-label">LBS</span>
        </div>
        {exercises.length > 1 && (
          <button onClick={() => handleRemoveExercise(index)}>Remove Exercise</button>
        )}
      </div>
    ))}

<button onClick={handleLogWorkout}>
  {selectedWorkout ? 'Update Workout' : 'Log Workout'} for {date.toDateString()}
</button>
<h2>
  
</h2>

    <h2>Your Workouts for {date.toDateString()}</h2>
    {workouts.length > 0 ? (
      <ul className="workout-list">
        {workouts.map((workout) => {
          // Convert the workout date to local time and compare
          const workoutDate = new Date(workout.date).toLocaleDateString();
          const selectedDate = date.toLocaleDateString();

          if (workoutDate === selectedDate) {
            return (
              <li key={workout._id}>
                <ul>
                  {workout.exercises.map((exercise, index) => (
                    <li key={index}>
                      {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight} LBS, Rest Time: {exercise.restTime}s, Current Rep Max: {exercise.currentRepMax} LBS, One Rep Max: {exercise.oneRepMax} LBS
                    </li>
                  ))}
                </ul>
              </li>
            );
          } else {
            return null;
          }
        })}
      </ul>
    ) : (
      <p>No workouts logged for this date.</p>
    )}
  </div>
);



};

export default WorkoutLogger;
