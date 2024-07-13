// import {  FindOptions, Identifier } from "sequelize";
// import User from "../models/user";


// class UserRepository {

//     async getUsers ():Promise<User[]> {
//         const users = await User.findAll();
//         return users;
//     }

//     async createUser (user:{}) : Promise<User> {
//         return new User(user);
//     }

//     async getUserById (userId : Identifier,options?: Omit<FindOptions<any>, "where"> | undefined) : Promise<User | null> {
//         return await User.findByPk(userId,options);
//     }

// }

// export const userRepository = new UserRepository();