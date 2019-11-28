//28.11.2019

const Comment = require("../../models/Comment");
const getAuthenticatedUser = require("../middlewares/authenticated");

module.exports = {

    Mutation:{
        createComment: async(_,{postId,body},context) =>{
            const { user } = getAuthenticatedUser(context);
            if (!user) {
              throw new Error("Unauthenticated!");
            }
             
            if(body.trim() ===''){

            }

            //create comment
            const comment= Comment({

            });
              


            //return comment
            
        }
    }

};