import jwt from 'jsonwebtoken';

// Middleware per verificare il token JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Token di autenticazione mancante'
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Token non valido o scaduto'
    });
  }
};

// Middleware per verificare livello utente
export const checkLevel = (minLevel) => {
  return (req, res, next) => {
    if (req.user.livello < minLevel) {
      return res.status(403).json({
        status: 'error',
        message: 'Accesso negato. Livello insufficiente.'
      });
    }
    next();
  };
};

// Livelli:
// 0 = Studente
// 1 = Docente  
// 2 = Coordinatore
// 3 = Amministratore
export const isStudente = checkLevel(0);
export const isDocente = checkLevel(1);
export const isCoordinatore = checkLevel(2);
export const isAdmin = checkLevel(3);