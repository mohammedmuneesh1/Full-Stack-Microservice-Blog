import jwt, { type SignOptions } from 'jsonwebtoken';

const generateToken = (data: object, expiresIn: string | number): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    const options: SignOptions = { 
        //eslint-disable-next-line
        expiresIn: expiresIn as any
    };

    return jwt.sign(data, secret, options);
};

export default generateToken;