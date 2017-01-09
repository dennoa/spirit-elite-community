
const state = {
  user: null,
  isAdmin: false
};

const set = (key, value) => { state[key] = value; };

state.onUser = user => set('user', user);
state.onIsAdmin = isAdmin => set('isAdmin', isAdmin);

export default state;
