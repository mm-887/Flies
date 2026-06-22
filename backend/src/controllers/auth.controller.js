export async function checkAuth(req,res){
    if(!req.user){
        return res.status(401).json({message:"Unauthorized"})
    }
    return res.status(200).json({message:"Authenticated",user:req.user})
}