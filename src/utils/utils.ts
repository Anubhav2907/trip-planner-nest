/* eslint-disable prettier/prettier */
const verifyUser = function (user, loggedin) {
  if (
    loggedin.email === user.Email ||
    (user.Role === 'User' && loggedin.role === 'Manager') ||
    (user.Role === 'User' && loggedin.role === 'Admin') ||
    (user.Role === 'Manager' && loggedin.role === 'Admin')
  ) {
    return true;
  }
  return false;
};
const verifyRole = function (user) {
  if (user.role === 'Admin' || user.role === 'Manager') {
    return true;
  }
  return false;
};
export default { verifyUser, verifyRole };
