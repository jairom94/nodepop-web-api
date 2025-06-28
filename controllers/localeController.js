
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export function changeLocale(req, res, next) {
  const locale = req.params.locale
  console.log(locale);
  
  res.cookie('nodepop-locale', locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30
  })

  res.redirect('back')
}