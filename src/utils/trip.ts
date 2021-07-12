/* eslint-disable prettier/prettier */
const verifyTrip = function (st, en, cst, cen) {
  if (cst[3] > st[3] || cen[3] < st[3]) {
    return false;
  }
  if (cst[3] < st[3] && cen[3] > st[3]) {
    return true;
  }
  if (cst[3] == st[3] && cen[3] > st[3]) {
    if (cst[2] < st[2]) return true;
  }
  if (cst[3] < st[3] && cen[3] == st[3]) {
    if (cen[2] > st[2]) return true;
  }
  if (cst[3] == st[3] && cen[3] > st[3] && cst[2] == st[2] && cen[2] > st[2]) {
    if (cst[1] < st[1]) return true;
  }
  if (cst[3] < st[3] && cen[3] == st[3] && cen[2] == st[2] && cst[2] > st[2]) {
    if (cen[1] > st[1]) return true;
  }
  return false;
};
const verifyTripEnd = function (st, en, cst, cen) {
  if (cst[3] > en[3] || cen[3] < en[3]) {
    return false;
  }
  if (cst[3] < en[3] && cen[3] > en[3]) {
    return true;
  }
  if (cst[3] == en[3] && cen[3] > en[3]) {
    if (cst[2] < st[2]) return true;
  }
  if (cst[3] < en[3] && cen[3] == en[3]) {
    if (cen[2] > en[2]) return true;
  }
  if (cst[3] == en[3] && cen[3] > en[3] && cst[2] == en[2] && cen[2] > en[2]) {
    if (cst[1] < en[1]) return true;
  }
  if (cst[3] < en[3] && cen[3] == en[3] && cen[2] == en[2] && cst[2] > en[2]) {
    if (cen[1] > en[1]) return true;
  }
  return false;
};
export default { verifyTrip, verifyTripEnd };
