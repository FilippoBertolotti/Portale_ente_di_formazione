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
    if (req.user.livello > minLevel) {
      return res.status(403).json({
        status: 'error',
        message: 'Accesso negato. Livello insufficiente.'
      });
    }
    next();
  };
};

// Livelli:
// 0 = Amministratore
// 1 = Studente
// 2 = Docente  
// 3 = Coordinatore
export const isAdmin = checkLevel(0);
export const isStudente = checkLevel(1);
export const isDocente = checkLevel(2);
export const isCoordinatore = checkLevel(3);
export const isAdminOrCoordinatore = (req, res, next) => {
  if (checkLevel(0) || checkLevel(3)) {
    return next();
  }
  return res.status(403).json({
    status: 'error',
    message: 'Accesso negato. Solo amministratori e coordinatori.'
  });
};
