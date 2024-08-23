import React, { useState } from 'react';
import axios from 'axios';
import image from './Equipment Sign.png'; // Replace with your designated image path

const email = localStorage.getItem('email');

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/';

const CreateCategory = ({ onCategoryCreated, categories, handleDeleteCategory }) => {  // Accept handleDeleteCategory as a prop
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateCategory = async () => {
        if (!categoryName.trim()) {
            alert('Please enter a category name.');
            return;
        }

        if (!email) {
            alert('User email is missing. Please log in again.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}api/workout/createCategory`, {
                name: categoryName.trim(),
                description: description.trim(),
                imageUrl: image,
                email,
            });
            alert('Category created successfully');
            onCategoryCreated();
            setCategoryName('');
            setDescription('');
        } catch (error) {
            alert('Error creating category: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h3>Create New Workout Category</h3>
            <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreateCategory}>Create Category</button>
            <div>
                <h3>Your Categories</h3>
                {categories.map((category) => (
                    <div key={category._id} style={{ marginBottom: '20px' }}>
                        <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="delete-button"
                            style={{
                                display: 'block',
                                margin: '5px auto',
                                padding: '3px 6px',
                                fontSize: '0.8em'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreateCategory;
