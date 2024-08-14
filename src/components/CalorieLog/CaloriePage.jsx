import React, { Component } from 'react';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import LogCalories from './LogCalories';
import ViewCalories from './ViewCalories';
import FoodSearch from './FoodSearch';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

class CaloriePage extends Component {
  state = {
    calories: [],
    email: localStorage.getItem('email'),
    selectedDate: new Date(), // Initializing the selected date to today's date
    storedCalories: localStorage.getItem('dailyCalories'), // Retrieve stored calories from localStorage
    Macros: JSON.parse(localStorage.getItem('MacroGrams')) // Parse the stored macros from JSON string
  };

  componentDidMount() {
    this.fetchCalories();
    this.fetchRemainingCaloriesAndMacros(); // Fetch remaining calories and macros
  }
  
  // Function to fetch remaining calories and macros
  fetchRemainingCaloriesAndMacros = async () => {
    const { email } = this.state;
    try {
      const response = await axios.get(`http://localhost:8080/api/calc/user/${email}/remaining-calories`);
      this.setState({
        remainingCalories: response.data.remainingCalories,
        remainingProtein: response.data.remainingProtein,
        remainingCarbs: response.data.remainingCarbs,
        remainingFats: response.data.remainingFats
      });
    } catch (error) {
      console.error('Error fetching remaining calories and macros:', error);
      alert('Error fetching remaining calories and macros');
    }
  };
  
  render() {
    const { calories, selectedDate, storedCalories, Macros, remainingCalories, remainingProtein, remainingCarbs, remainingFats } = this.state;
  
    return (
      <Box p={5} maxW="1200px" mx="auto">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Calories Management
        </Heading>
  
        {storedCalories && (
          <Box mb={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="md" textAlign="center">
            <Text fontSize="large">
              <strong> Daily Caloric Intake:</strong> {storedCalories} calories/day
            </Text>
          </Box>
        )}
  
        {Macros && (
          <Box mb={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="md" textAlign="center">
            <Text fontSize="large">
              <strong> Daily Macro Intake:</strong>
              <br />
              Fat: {Macros.fatGrams} g/day
              <br />
              Protein: {Macros.proteinGrams} g/day
              <br />
              Carbohydrates: {Macros.carbGrams} g/day
            </Text>
          </Box>
        )}
  
        {remainingCalories !== undefined && (
          <Box mb={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="md" textAlign="center">
            <Text fontSize="large">
              <strong>Remaining Daily Caloric Intake:</strong> {remainingCalories} calories/day
            </Text>
            <Text fontSize="large">
              <strong>Remaining Protein:</strong> {remainingProtein} g/day
            </Text>
            <Text fontSize="large">
              <strong>Remaining Carbs:</strong> {remainingCarbs} g/day
            </Text>
            <Text fontSize="large">
              <strong>Remaining Fats:</strong> {remainingFats} g/day
            </Text>
          </Box>
        )}
  
        <Box mb={6}>
          <Calendar
            onChange={this.handleDateChange}
            value={selectedDate}
          />
        </Box>
        <VStack spacing={6}>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <FoodSearch selectedDate={selectedDate} onFoodSuccess={this.handleFoodSuccess} />
          </Box>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <LogCalories selectedDate={selectedDate} onLogSuccess={this.handleLogSuccess} />
          </Box>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <ViewCalories calories={calories} selectedDate={selectedDate} onDeleteSuccess={this.handleDeleteSuccess} />
          </Box>
        </VStack>
      </Box>
    );
  
  }
}
export default CaloriePage;
