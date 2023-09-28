import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const state = {
    planetSize: 2,
}
export default {
    namespaced:true,
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
  };