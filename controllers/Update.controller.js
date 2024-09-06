const User = require('../models/User.models');

const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        const userId = req.userId;
        const userID = req.userId;
        console.log(userID);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
};

module.exports = {
    updateProfile,
};
