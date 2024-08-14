import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Box, Heading, Text, List, ListItem, Button, Alert } from '@chakra-ui/react';

const ViewCalories = ({ calories, selectedDate, onDeleteSuccess }) => {
  const [filteredCalories, setFilteredCalories] = useState([]);
  const email = localStorage.getItem('email');

  useEffect(() => {
    // Filter the calories based on the selected date
    const filtered = calories.filter((log) => {
      const logDate = new Date(log.date); // Assuming each log has a date field
      return logDate.toDateString() === selectedDate.toDateString();
    });
    setFilteredCalories(filtered);
  }, [selectedDate, calories]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/calories/logcalories/${id}`);
      alert('Calorie log deleted');
      onDeleteSuccess(); // Trigger the parent to refresh the logs
    } catch (error) {
      console.error('Error deleting calorie log:', error);
      alert('Error deleting calorie log');
    }
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
      <Heading as="h2" size="lg" mb={4}>
        View Calories
      </Heading>
      <Text fontSize="lg" mb={4}>
        Logs for {selectedDate.toDateString()}
      </Text>
      <List spacing={3}>
        {filteredCalories.map((log) => (
          <ListItem key={log._id} p={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
            <Text><strong>Calories:</strong> {log.calories} kcal</Text>
            <Text><strong>Protein:</strong> {log.protein} g</Text>
            <Text><strong>Carbohydrates:</strong> {log.carbohydrates} g</Text>
            <Text><strong>Fats:</strong> {log.fats} g</Text>
            <Button mt={2} colorScheme="red" size="sm" onClick={() => handleDelete(log._id)}>
              Delete
            </Button>
          </ListItem>
        ))}
        {filteredCalories.length === 0 && (
          <Alert status="info" mt={4}>
            No logs found for this date.
          </Alert>
        )}
      </List>
    </Box>
  );
};

// Define PropTypes for the component to ensure correct prop usage
ViewCalories.propTypes = {
  calories: PropTypes.array.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};

export default ViewCalories;