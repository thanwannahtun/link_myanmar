import {Request,Response} from 'express';
import User from '../models/user';

class AuthController {
  async  signUp (req:Request,res:Response) {

    const { name ,email , password } = req.body;
    if(!name || !email || !password){
        return res.status(401).send({message:"Unauthorized access"});
     } // seperate input validaion logic into middleware

    const isUserExisted = await User.findOne({where:{email:email}});

    if(isUserExisted){
        return res.status(400).send({message:`User with ${email} already existed!`})
    }

    const user = new User({name,email,passwordHash: password});
    res.send({user})
  };

  async  signIn (req:Request,res:Response)  {
    const {name,email,passwordHash} = req.body;
    const user = await User.findOne({where:{email,passwordHash}})
    if(!user){
        return res.status(404).send({message:`user with ${email} not Found!`});
    }
    return res.send({message:"success",user});
  };

  async  signOut (req:Request,res:Response) {};
}

export const authController = new AuthController();