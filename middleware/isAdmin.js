const isAdmin= (req,res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    } else {
        res.status(403).json(
            {
                success: false,
                message: "You are not authorized to access this resource."
            }
        )
     
    }
}

export default isAdmin