const express = require('express');
const { User } = require('../models/user');
const Workout = require('../models/calorielog');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const router = express.Router();

const envPath = path.resolve(__dirname,'../utils/.env');
console.log("dotenv")
dotenv.config({ path: envPath });
// Log a new workout
router.post('/logcalories', async (req, res) => {
    const { email, calories, protein, carbohydrates, fats } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newlog = new Workout({
            calories,
            protein,
            carbohydrates,
            fats,
            user: user._id
        });
        
        await newlog.save();
        user.calories.push(newlog._id);
        await user.save();

        res.status(201).send('Calories logged');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

console.log("USDA Key" + process.env.USDA_API_KEY)
// Get workouts for a specific user
router.get('/user/:email/calories', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email }).populate('calories');
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user.calories);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/macros', async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    try {
      // Log the start of the request
      console.log(`Received request for item: ${query}`);
  
      // Search for the food item
      const searchResponse = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${process.env.USDA_API_KEY}`
      );
  
      // Log the search response
      console.log('Search response:', searchResponse.data);
  
      if (searchResponse.data.foods.length === 0) {
        return res.status(404).json({ error: 'No food item found' });
      }
  
      // Get the food ID of the first search result
      const foodId = searchResponse.data.foods[0].fdcId;
  
      // Get detailed information about the food item
      const foodResponse = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/food/${foodId}?api_key=${process.env.USDA_API_KEY}`
      );
  
      // Log the food response
      console.log('Food response:', foodResponse.data);
  
      const nutrients = foodResponse.data.foodNutrients;
  
      // Extract macronutrients and calories
      const macros = {
        item: foodResponse.data.description,
        carbohydrates: nutrients.find(nutrient => nutrient.nutrient.name === 'Carbohydrate, by difference')?.amount || 0,
        fats: nutrients.find(nutrient => nutrient.nutrient.name === 'Total lipid (fat)')?.amount || 0,
        proteins: nutrients.find(nutrient => nutrient.nutrient.name === 'Protein')?.amount || 0,
        calories: nutrients.find(nutrient => nutrient.nutrient.name === 'Energy')?.amount || 0,
      };
  
      res.json(macros);
    } catch (error) {
      // Log the error
      console.error('Error occurred:', error);
  
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request data:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
  
      res.status(500).json({ error: 'An error occurred while fetching macro information' });
    }
  });
module.exports = router;
