export const asyncHandler = (fn) =>{
    return(req, res, next) =>{
        Promise.resolve(fn(req, res, next)).catch(next);
    //     fn(req, res, next).catch((error)=> next(new Error(error.message)));
    };    
};