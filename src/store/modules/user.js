import { login, logout, getInfo } from '@/api/login';
import { getSessionId, setSessionId, removeSessionId } from '@/utils/auth';
import defaultAvatar from '@/assets/defaultAvatar.png'

const user = {
  state: {
    sessionId: getSessionId(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_SESSIONID: (state, sessionId) => {
      state.sessionId = sessionId;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      const rolesMap = {
        '1': 'admin',
        '99': 'service',
        '0': 'global'
      }
      state.roles = rolesMap[roles.toString()] || 'global';
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const mobile = userInfo.mobile.trim();
      return new Promise((resolve, reject) => {
        // login(mobile, userInfo.password).then(response => {
        //   const data = response.data;
        //   setSessionId(data.sessionId);
        //   commit('SET_SESSIONID', data.sessionId);
        //   resolve();
        // }).catch(error => {
        //   reject(error);
        // });
        localStorage.setItem('userId', mobile);//存储手机号为ID
        // 查询当前号码是否注册过账号 有的话将accountName存储起来
        let financeUser = JSON.parse(localStorage.getItem('financeUser')) || [];
        let accountName = null;
        financeUser.map(val => {
          if (val.userId == mobile) {
            accountName = val.accountName;
          }
        })
        localStorage.setItem('accountName', mobile);
        resolve();
      });
    },


    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', 'admin');
        commit('SET_NAME', '测试用户');
        commit('SET_AVATAR', defaultAvatar);
        resolve();
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout({ sessionId: state.sessionId }).then(() => {
          removeSessionId();
          commit('SET_SESSIONID', '');
          commit('SET_ROLES', []);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeSessionId();
        commit('SET_SESSIONID', '');
        resolve();
      });
    }
  }
};

export default user;
