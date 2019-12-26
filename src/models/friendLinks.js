import { notification } from 'antd'
import { queryLink, addLink, updateLink, delLink, getLinkDetail } from '@/services/api';

const helper = {
  state: {
    linkListData: {
      list: [],
      total: 10,
    },
    linkState: {
      visible: false, // 添加回来后，二级菜单应该消失
      loading: false,
      changeType: false,
      keyword: '',
      pageNum: 1,
      pageSize: 10,
      state: 1, // 链接是否展示，默认展示
      name: '',
      desc: '',
      type: '', // 1 :其他友情链接 0: 是博主的个人链接 ,'' 代表所有链接
      url: '',
      icon: '',
    },
  },
};
export default {
  namespace: 'friendLinks',
  state: helper.state,
  effects: {
    *queryLink({ payload }, { call, put }) {
      const response = yield call(queryLink, payload);
      if (response.code === 0) {
        yield put({
          type: 'linkListResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *addLink({ payload }, { call, put }) {
      const response = yield call(addLink, payload);
      if (response.code === 0) {
        yield put({
          type: 'addLinkResponse',
          payload: response.data,
        });
        notification.success({
          message: response.message,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *deleteLink({ payload }, { call, put }) {
      const response = yield call(delLink, payload);
      if (response.code === 0) {
        yield put({
          type: 'delLinkResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *updateLink({ payload }, { call, put }) {
      const response = yield call(updateLink, payload);
      if (response.code === 0) {
        yield put({
          type: 'updateLinkResponse',
          payload: response.data,
        });
        notification.success({
          message: response.message,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *getLinkDetail({ payload }, { call, put }) {
      const response = yield call(getLinkDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'getLinkDetailResponse',
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
    linkListResponse(state, { payload }) {
      return {
        ...state,
        linkListData: payload,
      };
    },
    addLinkResponse(state, { payload }) {
      const { linkListData } = state
      const { list } = linkListData
      list.unshift(payload)
      const { linkState } = state
      return {
        ...state,
        linkState: {
          ...linkState,
          visible: false,
        },
        linkListData: {
          ...linkListData,
        },
      };
    },
    getLinkDetailResponse(state, { payload }) {
      return {
        ...state,
        linkState: {
          ...payload,
          visible: true,
          changeType: true,
        },
        loading: false,
      };
    },
    delLinkResponse(state, { payload }) {
      const { linkListData } = state
      const { list } = linkListData
      const dataList = list.filter(item => !(item._id === payload._id))
      const { linkState } = state
      return {
        ...state,
        linkState: {
          ...linkState,
          visible: false,
        },
        linkListData: {
          ...linkListData,
          list: dataList,
        },
      };
    },
    updateLinkResponse(state, { payload }) {
      const { linkListData } = state
      const { list } = linkListData
      const dataList = list.map(item => {
        if (item._id === payload._id) {
          return payload
        }
        return item
      })
      return {
        ...state,
        linkState: {
          ...helper.state.linkState,
        },
        linkListData: {
          ...linkListData,
          list: dataList,
        },
        loading: false,
      };
    },
    // 修改state
    setLinkState(state, { action }) {
      const { linkState } = state
      return {
        ...state,
        linkState: {
          ...linkState,
          ...action,
        },
      };
    },
    resetLinkState(state) {
      return {
        ...state,
        linkState: {
          ...helper.state.linkState,
        },
      };
    },
  },

}
