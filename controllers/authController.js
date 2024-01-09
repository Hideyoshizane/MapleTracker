const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { searchServersAndCreateMissing } = require('../models/servers');
const { updateCharacters, updateCharactersWeekly, createMissingCharacters } = require('../models/character');
const { updateLastLogin, LASTVERSION, updateUserVersion, User } = require('../models/user');
const { resetBossList } = require('../models/bossingList');

require('dotenv').config();

module.exports = {
  login: async (req, res) => {
    try {
      const username = req.body.username;
      const user = await User.findOne({ username });
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
 
      if (!user || !passwordMatch) {
        req.flash('message', 'Wrong username or password.');
        req.flash('type', 'error');
        return res.redirect('/login');
      } else {
        

        if (user.version < LASTVERSION) {
          await searchServersAndCreateMissing(user, user._id);
          await createMissingCharacters(user._id, user.username);
          await updateCharacters(user._id);
          await updateUserVersion(user._id);
        }

        await updateCharactersWeekly(user._id);
        await resetBossList(user.username);
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 604800000 });
        res.redirect('/home');
      }
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'An error occurred during login' });
    }
  },
};
