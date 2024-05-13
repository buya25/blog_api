const jwt = require('jsonwebtoken');

const generateToken =  (user) => {
    return jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '7d' });
}

module.exports = generateToken;
// {

//     Query :{
//         me(parent , args , { db , currentUser }) {
//             if (!currentUser ) throw new Error ('Not authenticated') ;
//             return db.users.findOne ({ where : { id : currentUser.id }});
//         }
//     },
//     Mutation:{
//         login( parent , { username , password } , { db } ){
//              // check the user from the database
//              const user = db.users.find((u)=> u.username === username);
             
//              if(!user){
//                  throw new Error("Username not found");
//              }
//              // compare the password with hashed one in the database
//              const valid = db.bcrypt.compareSync(password , user.hashedPassword);
//              if(!valid){
//                  throw new Error ("Invalid Password")
//              }
//              //generate a token and send it back to the client side
//              return {
//                 token : generateToken(user),
//                 user
//              };
//          },
//          addUser(parent , args , {db}){
//              // hash the password before saving into the database
//              const hashedPassword= db.bcrypt.hashSync(args.password ,  10);
//              args.hashedPassword = hashedPassword;
//              return db.users.create(args);
//          }
//      },
//      User: {
//          posts(user) {
//            return user.posts;
//          },
//          tokens(user) {
//            return user.tokens;
//          }
//      },
//      Token: {
//        user(token, _, {db}) {
//           return db.users.find({  
//             where: {  
//                tokens: { id: token.id}  
//             }   
//           }) 
//         }
//      }
// };