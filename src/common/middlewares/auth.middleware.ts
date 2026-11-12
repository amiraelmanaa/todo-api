
import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

// Clé utilisée pour vérifier la signature des JWT.
// Pour ce TP, nous utilisons une clé de test
const JWT_SECRET = 'tp1-secret-key';

export interface AuthenticatedRequest extends Request {
  userId: number;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
//la méthode principale
  use(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    // 1 Récupérer le token envoyé dans le header
    const token = req.headers['auth-user'];

    // 2 Vérifier l'existence du token
    // 401: n'a pas fourni de preuve d'auth acceptable
    if (!token || Array.isArray(token)) {    //notre JWT doit être une seule chaîne 
      return res.status(401).json({
        message: 'Accès refusé : token manquant',
      });
    }

    try {
      // 3 Vérifier la signature et extraire le payload
      const decoded = jsonwebtoken.verify(token, JWT_SECRET);

      // 4 Vérifier que le payload contient un userId numérique
      if (
        typeof decoded === 'string' ||
        typeof decoded.userId !== 'number'
      ) {
        return res.status(401).json({
          message: 'Accès refusé : userId absent ou invalide',
        });
      }

      // 5 Injecter userId dans la requête HTTP
      //Le middleware récupère l'id  du JWT et le place dans la req HTTP
      req.userId = decoded.userId;
      //Le contrôleur pourra ensuite récupérer cette valeur avec @Req()

      // 6 Autoriser la poursuite de la requête
      next();

    } catch (error) {
      return res.status(401).json({
        message: 'Accès refusé : token JWT invalide ou expiré',
      });
    }
  }
}
