import flash from 'connect-flash';

export const flashActivate = flash();

export const useErrorMessages = (req, res, next) => {
    res.locals.error_messages = req.flash('error');
    next();
}