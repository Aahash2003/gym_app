const express = require('express');
const Profile = require('../models/profile');
const router = express.Router();

// Route to create or update user profile
router.post('/', async (req, res) => {
    try {
        const { email, age, gender, height, currentWeight, activityLevel } = req.body;

        if (!email || !age || !gender || !height || !currentWeight || !activityLevel) {
            return res.status(400).json({ msg: 'Please provide all required fields.' });
        }

        // Find if profile exists by email, otherwise create a new one
        let profile = await Profile.findOne({ email });

        if (profile) {
            // Update existing profile
            profile.Age = age;
            profile.Gender = gender;
            profile.Height = height;
            profile.CurrentWeight = currentWeight;
            profile.ActivityLevel = activityLevel;
            profile.UpdatedAt = Date.now();
        } else {
            // Create new profile
            profile = new Profile({
                email,
                Age: age,
                Gender: gender,
                Height: height,
                CurrentWeight: currentWeight,
                ActivityLevel: activityLevel,
            });
        }

        await profile.save();
        res.json({ msg: 'Profile saved successfully', profile });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to get user profile by email
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ msg: 'No profile found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
