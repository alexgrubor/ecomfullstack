const isUser = (req, res, next) => {
    if (req.params?.id === req.user?._id.toString()) {
        next()
    }
    else {
        res.status(403).json(
            {
                success: false,
                message: "You are not authorized to access this resource."
            }
        )
    }
}

export default isUser