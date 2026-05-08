const { verifyAccessToken } = require('../utils/tokenUtils');

exports.isAuthenticatedWithSession = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ success: false, message: 'Connectez-vous' });
};

exports.authorizeWithSession = (roles) => (req, res, next) => {
  if (!req.session?.userRole) return res.status(401).json({ success: false, message: 'Non authentifié' });
  if (!roles.includes(req.session.userRole)) return res.status(403).json({ success: false, message: 'Accès interdit' });
  next();
};

exports.isAuthenticatedWithJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new Error();
    const token = authHeader.split(' ')[1];
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

exports.authorizeWithJWT = (roles) => (req, res, next) => {
  if (!req.user?.role) return res.status(401).json({ success: false, message: 'Non authentifié' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Droits insuffisants' });
  next();
};