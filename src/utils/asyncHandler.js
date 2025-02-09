//method1
// const asyncHandler = (fn) => async(req, res, next) => {
    //     try {
        //         await fn(req, res, next)
        //     } catch (error) {
            //         res.status(error.status || 500).json({ message: error.message || 'Something went wrong' })
            //     }
            
            // }
            
//method2
const asyncHandler = (func) =>{
    return (req,res,next) =>{
        Promise.resolve(func(req,res,next)).catch((err)=>next(err))
    
    }
}

export {asyncHandler}