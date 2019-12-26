import { notification } from 'antd'
import {
  queryArticle,
  delArticle,
  updateArticle,
  addArticle,
  getArticleDetail,
  changeComment,
  changeSecondComment,
} from '@/services/api';

const helper = {
  getArticleDefault: data => {
    const {
      origin,
      type,
      state,
    } = data
    // 1: 普通文章，2: 简历，3: 管理员介绍
    const typeDefault = type === 1 ? '普通文章' : (type === 2 ? '简历' : '管理员介绍')
    const originDefault = origin === 0 ? '原创' : '';
    const stateDefault = state ? '已发布' : '草稿';
    return {
      typeDefault,
      originDefault,
      stateDefault,
    }
  },
  state: {
    articleListData: { // 文章列表
      list: [],
      total: 0,
      //
      pageNum: 1,
      pageSize: 10,
      state: '',
      loading: false,
      keyword: '',
      likes: '',
    },
    articleDetailData: { // 单个文章详情页
      commentsVisible: false, // 评论二级弹窗
      detailVisible: false, // 文章详情二级弹窗
      changeType: false, // 是否是更新文章
      _id: '',
      author: 'Ethan',
      category: [],
      comments: [],
      create_time: '',
      desc: '',
      id: 0,
      img_url: '',
      keyword: [],
      like_users: [],
      meta: { views: 0, likes: 0, comments: 0 },
      origin: 0, // 选择文章转载状态 默认->原创
      state: 1, // 选择发布状态 默认->发布
      type: 1, // 文章类型 默认->普通文章
      tags: [],
      title: '',
      update_time: '',
      content: '',
      loading: false,
    },
  },
}
export default {
  namespace: 'article',
  state: helper.state,
  effects: {
    *queryArticle({ payload }, { call, put }) {
      const response = yield call(queryArticle, payload);
      if (response.code === 0) {
        yield put({
          type: 'articleListResponse',
          payload: response.data,
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *delArticle({ payload }, { call, put }) {
      const response = yield call(delArticle, payload);
      if (response.code === 0) {
        yield put({
          type: 'delArticleResponse',
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
    *addArticle({ payload }, { call, put }) {
      const response = yield call(addArticle, payload);
      if (response.code === 0) {
        yield put({
          type: 'addArticleResponse',
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
    *updateArticle({ payload }, { call, put }) {
      const response = yield call(updateArticle, payload);
      if (response.code === 0) {
        yield put({
          type: 'updateArticleResponse',
          payload: response,
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
    *getArticleDetail({ payload }, { call, put }) {
      const { detailVisible, commentsVisible, ...rest } = payload
      const response = yield call(getArticleDetail, rest);
      if (response.code === 0) {
        yield put({
          type: 'articleDetailResponse',
          payload: {
            ...response.data,
            detailVisible,
            commentsVisible,
          },
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *changeComment({ payload }, { call, put }) {
      const response = yield call(changeComment, payload);
      if (response.code === 0) {
        yield put({
          type: 'articleDetailResponse',
          payload: {
            ...response.data,
            commentsVisible: true,
          },
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
    *changeSecondComment({ payload }, { call, put }) {
      const response = yield call(changeSecondComment, payload);
      if (response.code === 0) {
        yield put({
          type: 'articleDetailResponse',
          payload: {
            ...response.data,
            commentsVisible: true,
          },
        });
      } else {
        notification.error({
          message: response.message,
        });
      }
    },
  },


  reducers: {
    articleListResponse(state, { payload }) {
      const { articleListData } = state
      return {
        ...state,
        articleListData: {
          ...articleListData,
          loading: false,
          ...payload,
        },
      };
    },
    updateArticleResponse(state, { payload }) {
      const { articleListData } = state
      const { list } = articleListData
      const dataList = list.map(item => {
        if (item._id === payload._id) {
          return payload
        }
        return item
      })
      return {
        ...state,
        articleListData: {
          ...articleListData,
          list: dataList,
        },
        articleDetailData: {
          ...helper.state.articleDetailData,
        },
      }
    },
    delArticleResponse(state, { payload }) {
      const { articleListData } = state
      const { list } = articleListData
      const dataList = list.filter(item => !(item._id === payload._id))
      return {
        ...state,
        articleListData: {
          ...articleListData,
          list: dataList,
        },
      }
    },
    addArticleResponse(state, { payload }) {
      const { articleListData, articleDetailData } = state
      const { list } = articleListData
      list.unshift(payload)
      return {
        ...state,
        articleListData: {
          ...articleListData,
          loading: false,
          list,
        },
        articleDetailData: {
          ...articleDetailData,
          detailVisible: false,
        },
      }
    },
    articleDetailResponse(state, { payload }) {
      const defailtValues = helper.getArticleDefault(payload)
      return {
        ...state,
        articleDetailData: {
          ...payload,
          ...defailtValues,
          changeType: true,
        },
        loading: false,
      };
    },
    // 修改文章详情页state
    changeArticleDetailState(state, { action }) {
      const { articleDetailData } = state
      return {
        ...state,
        articleDetailData: {
          ...articleDetailData,
          ...action,
        },
      };
    },
    // 修改文章列表页面state
    articleListState(state, { action }) {
      const { articleListData } = state
      return {
        ...state,
        articleListData: {
          ...articleListData,
          ...action,
        },
      };
    },
    resetArticle(state) { // 重置文章详情
      return {
        ...state,
        articleDetailData: {
          ...helper.state.articleDetailData,
        },
      };
    },
  },
};
