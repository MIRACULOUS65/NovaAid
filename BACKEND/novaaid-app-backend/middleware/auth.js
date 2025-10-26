import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const clerkFrontendApi = process.env.CLERK_FRONTEND_API || 'firm-monkfish-14.clerk.accounts.dev';
const jwksUri = `https://${clerkFrontendApi}/.well-known/jwks.json`;

console.log('Clerk JWKS URI:', jwksUri);

const client = jwksClient({
  jwksUri: jwksUri,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksTimeout: 30000
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export async function verifyClerkToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Auth error: No authorization header or invalid format');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.error('Auth error: Token is empty');
      return res.status(401).json({ error: 'Token is empty' });
    }

    console.log('Verifying token...');
    const decoded = await verifyClerkToken(token);
    console.log('Token verified successfully for user:', decoded.sub);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(401).json({ 
      error: 'Invalid token',
      details: error.message 
    });
  }
}
