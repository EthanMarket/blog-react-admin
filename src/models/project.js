import { notification } from 'antd'
import {
  getProjectList,
  addProject,
  deleteProject,
  getProjectDetail,
  updateProject,
} from '@/services/api';

const helper = {
  state: {
    projectListData: {
      list: [],
      total: 10,
    },
    projectState: {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      state: '', // 状态 1 是已经完成 ，2 是正在进行，3 是没完成 ,'' 代表所有项目
      keyword: '',
    },
    detailState: {
      changeType: false,
      visible: false, // 添加回来后，二级菜单应该消失
      title: '',
      img: '',
      url: '',
      content: '',
      keyword: '',
      state: '', // 状态 1 是已经完成 ，2 是正在进行，3 是没完成 ,'' 代表所有项目
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
  namespace: 'project',
  state: helper.state,
  effects: {
    *getProjectList({ payload }, { call, put }) {
      const response = yield call(getProjectList, payload);
      if (response.code === 0) {
        yield put({
          type: 'getProjectListResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *addProject({ payload }, { call, put }) {
      const response = yield call(addProject, payload);
      if (response.code === 0) {
        yield put({
          type: 'addProjectResponse',
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
    *deleteProject({ payload }, { call, put }) {
      const response = yield call(deleteProject, payload);
      if (response.code === 0) {
        yield put({
          type: 'deleteProjectResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *getProjectDetail({ payload }, { call, put }) {
      const response = yield call(getProjectDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'getProjectDetailResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *updateProject({ payload }, { call, put }) {
      const response = yield call(updateProject, payload);
      if (response.code === 0) {
        yield put({
          type: 'updateProjectResponse',
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
    getProjectListResponse(state, { payload }) {
      return {
        ...state,
        projectListData: payload,
      };
    },
    addProjectResponse(state, { payload }) {
      const { projectListData } = state
      const { list } = projectListData
      list.unshift(payload)
      const { detailState } = state
      return {
        ...state,
        detailState: {
          ...detailState,
          visible: false,
        },
        projectListData: {
          ...projectListData,
        },
      };
    },
    deleteProjectResponse(state, { payload }) {
      const { projectListData } = state
      const { list } = projectListData
      const dataList = list.filter(item => !(item._id === payload._id))
      const { detailState } = state
      return {
        ...state,
        detailState: {
          ...detailState,
          visible: false,
        },
        projectListData: {
          ...projectListData,
          list: dataList,
        },
      };
    },
    getProjectDetailResponse(state, { payload }) {
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
    updateProjectResponse(state, { payload }) {
      const { projectListData } = state
      const { list } = projectListData
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
        projectListData: {
          ...projectListData,
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
    setProjectState(state, { action }) {
      const { projectState } = state
      return {
        ...state,
        projectState: {
          ...projectState,
          ...action,
        },
      };
    },
  },
}
