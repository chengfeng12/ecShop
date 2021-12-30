const state = {
  routermsg: []
};

const getters = {
  getroutermsg(state) {
    return state.routermsg
  }
};

const mutations = {
  
  routermutations(state, arr) {
    state.routermsg = arr
  },

};

const actions = {

  routeractions(context, arr) {
    context.commit('routermutations', arr);
  },  

};

export default {
  state,
  getters,
  mutations,
  actions
}
