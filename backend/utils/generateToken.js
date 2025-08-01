import jwt from 'jsonwebtoken';
     const generateToken = (id)=>{
        return jwt.sign({id},process.env.JWT_KEY,{expiresIn:'15m'})
    }

    export default generateToken;