import { notification } from 'antd'
import { queryUser, addUser, updateUser, delUser, getUserDetail } from '@/services/api';

const helper = {
  state: {
    userListData: {
      list: [],
      total: 10,
    },
    userState: {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      type: '', // 状态 0 是超级用户，1 是普通用户
      keyword: '',
    },
    detailState: {
      changeType: false,
      visible: false, // 添加回来后，二级菜单应该消失
      password: '',
      email: '',
      phone: '',
      type: '', // 状态 0 是超级用户，1 是普通用户
    },
  },
}
export default {
  namespace: 'otherUser',
  state: helper.state,
  effects: {
    *queryUser({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      if (response.code === 0) {
        yield put({
          type: 'userListResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *addUser({ payload }, { call, put }) {
      const response = yield call(addUser, payload);
      if (response.code === 0) {
        yield put({
          type: 'addUserResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *updateUser({ payload }, { call, put }) {
      const response = yield call(updateUser, payload);
      if (response.code === 0) {
        yield put({
          type: 'updateUserResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *deleteUser({ payload }, { call, put }) {
      const response = yield call(delUser, payload);
      if (response.code === 0) {
        yield put({
          type: 'delUserResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },

    *getUserDetail({ payload }, { call, put }) {
      const response = yield call(getUserDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'getUserDetailResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
  },

  reducers: {
    userListResponse(state, { payload }) {
      return {
        ...state,
        userListData: payload,
      };
    },
    addUserResponse(state, { payload }) {
      const { userListData } = state
      const { list } = userListData
      list.unshift(payload)
      const { detailState } = state
      return {
        ...state,
        detailState: {
          ...detailState,
          visible: false,
        },
        userListData: {
          ...userListData,
        },
      };
    },
    getUserDetailResponse(state, { payload }) {
      return {
        ...state,
        detailState: {
          ...payload,
          visible: true,
          changeType: true,
        },
        loading: false,
      };
    },
    updateUserResponse(state, { payload }) {
      const { userListData } = state
      const { list } = userListData
      const dataList = list.map(item => {
        if (item._id === payload._id) {
          return payload
        }
        return item
      })
      return {
        ...state,
        detailState: {
          ...helper.state.detailState,
        },
        userListData: {
          ...userListData,
          list: dataList,
        },
        loading: false,
      };
    },
    delUserResponse(state, { payload }) {
      const { userListData } = state
      const { list } = userListData
      const dataList = list.filter(item => !(item._id === payload._id))
      const { detailState } = state
      return {
        ...state,
        detailState: {
          ...detailState,
          visible: false,
        },
        userListData: {
          ...userListData,
          list: dataList,
        },
      };
    },
    resetDetailState(state) {
      return {
        ...state,
        detailState: {
          ...helper.state.detailState,
        },
      };
    },
    // 修改state
    setUserState(state, { action }) {
      const { userState } = state
      return {
        ...state,
        userState: {
          ...userState,
          ...action,
        },
      };
    },
    setDetailState(state, { action }) {
      const { detailState } = state
      return {
        ...state,
        detailState: {
          ...detailState,
          ...action,
        },
      };
    },
  },
};
