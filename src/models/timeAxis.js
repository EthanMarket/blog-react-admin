import { notification } from 'antd'
import { queryTimeAxis, delTimeAxis, updateTimeAxis, addTimeAxis, getTimeAxisDetail } from '@/services/api';

const helper = {
  state: {
    timeListData: {
      list: [],
      total: 10,
    },
    timeState: {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      state: '', // 状态 1 是已经完成 ，2 是正在进行，3 是没完成 ,'' 代表所有时间轴
      keyword: '',
    },
    detailState: {
      changeType: false,
      visible: false, // 添加回来后，二级菜单应该消失
      title: '',
      content: '',
      state: '', // 状态 1 是已经完成 ，2 是正在进行，3 是没完成 ,'' 代表所有时间轴
      start_time: new Date(),
      end_time: new Date(),
      defaultStateValue: '未完成',
    },
  },
  getArticleDefault: data => {
    const {
      state,
    } = data
    const defaultStateValue = state === 1 ? '已完成' : (state === 2 ? '正在进行中' : '未完成')
    return {
      defaultStateValue,
    }
  },
};
export default {
  namespace: 'timeAxis',
  state: helper.state,
  effects: {
    *queryTimeAxis({ payload }, { call, put }) {
      const response = yield call(queryTimeAxis, payload);
      if (response.code === 0) {
        yield put({
          type: 'timeAxisListResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *addTimeAxis({ payload }, { call, put }) {
      const response = yield call(addTimeAxis, payload);
      if (response.code === 0) {
        yield put({
          type: 'addTimeAxisResponse',
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
    *deleteTimeAxis({ payload }, { call, put }) {
      const response = yield call(delTimeAxis, payload);
      if (response.code === 0) {
        yield put({
          type: 'deleteTimeAxisResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *getTimeAxisDetail({ payload }, { call, put }) {
      const response = yield call(getTimeAxisDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'timeAxisDetailResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *updateTimeAxis({ payload }, { call, put }) {
      const response = yield call(updateTimeAxis, payload);
      if (response.code === 0) {
        yield put({
          type: 'updateTimeAxisResponse',
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
  },

  reducers: {
    timeAxisListResponse(state, { payload }) {
      return {
        ...state,
        timeListData: payload,
      };
    },
    addTimeAxisResponse(state, { payload }) {
      const { timeListData } = state
      const { list } = timeListData
      list.unshift(payload)
      const { detailState } = state
      return {
        ...state,
        detailState: {
          ...detailState,
          visible: false,
        },
        timeListData: {
          ...timeListData,
        },
      };
    },
    deleteTimeAxisResponse(state, { payload }) {
      const { timeListData } = state
      const { list } = timeListData
      const dataList = list.filter(item => !(item._id === payload._id))
      const { detailState } = state
      return {
        ...state,
        detailState: {
          ...detailState,
          visible: false,
        },
        timeListData: {
          ...timeListData,
          list: dataList,
        },
      };
    },
    timeAxisDetailResponse(state, { payload }) {
     const defaultValues = helper.getArticleDefault(payload)
      return {
        ...state,
        detailState: {
          ...payload,
          visible: true,
          changeType: true,
          ...defaultValues,
        },
        loading: false,
      };
    },
    updateTimeAxisResponse(state, { payload }) {
      const { timeListData } = state
      const { list } = timeListData
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
        timeListData: {
          ...timeListData,
          list: dataList,
        },
        loading: false,
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
    // 修改state
    setTimeAxisState(state, { action }) {
      const { timeState } = state
      return {
        ...state,
        timeState: {
          ...timeState,
          ...action,
        },
      };
    },
  },
}
