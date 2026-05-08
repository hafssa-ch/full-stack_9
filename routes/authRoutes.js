const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  isAuthenticatedWithSession,
  authorizeWithSession,
  isAuthenticatedWithJWT,
  authorizeWithJWT
} = require('../middlewares/auth');

// ==================== Sessions ====================
router.post('/register-session', authController.registerWithSession);
router.post('/login-session', authController.loginWithSession);
router.get('/logout-session', authController.logoutWithSession);
router.get('/profile-session', isAuthenticatedWithSession, authController.getProfileWithSession);
router.get('/admin-only-session', isAuthenticatedWithSession, authorizeWithSession(['admin']), (req, res) => {
  res.json({ message: 'Accès admin (session) autorisé' });
});

// ==================== JWT ====================
router.post('/register-jwt', authController.registerWithJWT);
router.post('/login-jwt', authController.loginWithJWT);
router.get('/logout-jwt', authController.logoutWithJWT);
router.get('/refresh-token', authController.refreshToken);
router.get('/profile-jwt', isAuthenticatedWithJWT, authController.getProfileWithJWT);
router.get('/admin-only-jwt', isAuthenticatedWithJWT, authorizeWithJWT(['admin']), (req, res) => {
  res.json({ message: 'Accès admin (JWT) autorisé' });
});

module.exports = router;