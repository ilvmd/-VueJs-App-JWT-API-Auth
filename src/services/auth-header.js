// In the case we access protected resources, the HTTP request needs Authorization header.
// It checks Local Storage for user item.

// export default function authHeader() {
//   let user = JSON.parse(localStorage.getItem('user'));

//   if (user && user.token) {
//     return { Authorization: 'Bearer ' + user.token };
//   } else {
//     return {};
//   }
// }





// If there is a logged in user with token (JWT), return HTTP Authorization header.
// Otherwise, return an empty object.

export function authHeader() {
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    // for Node.js Express back-end
    return { 'x-access-token': user.token };
  } else {
    return {};
  }
}



export function authHeader2() {
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
}
