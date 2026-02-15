import User from '../models/User.js';
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({
            id: user._id.toString(), // ✅ Convert _id to id
            username: user.username,
            email: user.email,
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
            avatar: user.avatar
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } })
            .select('-password')
            .sort({ isOnline: -1, lastSeen: -1 });
        // ✅ Transform _id to id for frontend consistency
        const formattedUsers = users.map(user => ({
            id: user._id.toString(), // ✅ Changed from _id to id
            username: user.username,
            email: user.email,
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
            avatar: user.avatar
        }));
        res.json(formattedUsers);
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const updateOnlineStatus = async (req, res) => {
    try {
        const { isOnline } = req.body;
        await User.findByIdAndUpdate(req.userId, {
            isOnline,
            lastSeen: new Date()
        });
        res.json({ message: 'Status updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
