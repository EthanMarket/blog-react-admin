import { notification } from 'antd'
import { queryTag, addTag, delTag } from '@/services/api';

const helper = {
	state: {
		tagListData: {
			list: [],
			total: 10,
		},
		tagState: {
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
	namespace: 'tag',
	state: helper.state,
	effects: {
		*queryTag({ payload }, { call, put }) {
			const response = yield call(queryTag, payload);
			if (response.code === 0) {
				yield put({
					type: 'tagListResponse',
					payload: response.data,
				});
			} else {
				notification.error({
					message: response.message,
				});
			}
		},
		*addTag({ payload }, { call, put }) {
			const response = yield call(addTag, payload);
			if (response.code === 0) {
				yield put({
					type: 'addTagResponse',
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
		*deleteTag({ payload }, { call, put }) {
			const response = yield call(delTag, payload);
			if (response.code === 0) {
				yield put({
					type: 'delTagResponse',
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
		tagListResponse(state, { payload }) {
			return {
				...state,
				tagListData: payload,
			};
		},
		addTagResponse(state, { payload }) {
			const { tagListData } = state
			const { list } = tagListData
			list.unshift(payload)
			const { tagState } = state
			return {
				...state,
				tagState: {
					...tagState,
					visible: false,
				},
				tagListData: {
					...tagListData,
				},
			};
		},
		delTagResponse(state, { payload }) {
			const { tagListData } = state
			const { list } = tagListData
			const dataList = list.filter(item => !(item._id === payload._id))
			const { tagState } = state
			return {
				...state,
				tagState: {
					...tagState,
					visible: false,
				},
				tagListData: {
					...tagListData,
					list: dataList,
				},
			};
		},
		// 修改state
		changeTagState(state, { action }) {
			const { tagState } = state
			return {
				...state,
				tagState: {
					...tagState,
					...action,
				},
			};
		},
	},
}
