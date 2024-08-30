const url = require('url');

const storeRedirectToInSession = (req, res, next) => {
  console.log(req.get('Referrer'), req.url);
  const url_parts = url.parse(req.get('referer'));
  const redirectTo = url_parts.pathname;
  req.session.redirectTo = redirectTo;
  next();
};

module.exports = {
  storeRedirectToInSession,
};
