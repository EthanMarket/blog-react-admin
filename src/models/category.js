/* eslint-disable no-tabs */
import { notification } from 'antd'
import { queryCategory, addCategory, delCategory } from '@/services/api';

const helper = {
	state: {
		categoryListData: {
			list: [],
			total: 0,
		},
		categoryState: {
			visible: false, // 添加回来后，二级菜单应该消失
			loading: false,
			keyword: '',
			pageNum: 1,
			pageSize: 10,
			name: '',
			desc: '',
		},
	},
};
export default {
	namespace: 'category',
	state: helper.state,
	effects: {
		*queryCategory({ payload }, { call, put }) {
			const response = yield call(queryCategory, payload);
			if (response.code === 0) {
				yield put({
					type: 'categoryListResponse',
					payload: response.data,
				});
			} else {
				notification.error({
					message: response.message,
				});
			}
		},
		*addCategory({ payload }, { call, put }) {
			const response = yield call(addCategory, payload);
			if (response.code === 0) {
				yield put({
					type: 'addCategoryResponse',
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
		*deleteCategory({ payload }, { call, put }) {
			const response = yield call(delCategory, payload);
			if (response.code === 0) {
				yield put({
					type: 'delCategoryResponse',
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
		categoryListResponse(state, { payload }) {
			return {
				...state,
				categoryListData: payload,
			};
		},

	addCategoryResponse(state, { payload }) {
		const { categoryListData } = state
		const { list } = categoryListData
		list.unshift(payload)
		const { categoryState } = state
		return {
			...state,
			categoryState: {
				...categoryState,
				visible: false,
			},
			categoryListData: {
				...categoryListData,
			},
		};
	},
	delCategoryResponse(state, { payload }) {
		const { categoryListData } = state
		const { list } = categoryListData
		const dataList = list.filter(item => !(item._id === payload._id))
		const { categoryState } = state
		return {
			...state,
			categoryState: {
				...categoryState,
				visible: false,
			},
			categoryListData: {
				...categoryListData,
				list: dataList,
			},
		};
	},
	// 修改state
	changeCategoryState(state, { action }) {
		const { categoryState } = state
		return {
			...state,
			categoryState: {
				...categoryState,
				...action,
			},
		};
	},
},
}
