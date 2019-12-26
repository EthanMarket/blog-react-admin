import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
	Row,
	Col,
	Card,
	Form,
	Input,
	Button,
	Table,
	Popconfirm,
	Divider,
	Tag,
	Select,
	Modal,
	DatePicker,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const FormItem = Form.Item;
@connect(({ timeAxis }) => ({
	timeAxis,
}))
@Form.create()
class TableList extends PureComponent {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: '标题',
				width: 150,
				dataIndex: 'title',
			},
			{
				title: '内容',
				width: 350,
				dataIndex: 'content',
			},
			{
				title: '状态',
				dataIndex: 'state', // 状态 1 是已经完成 ，2 是正在进行，3 是没完成
				render: val => {
					// 状态 1 是已经完成 ，2 是正在进行，3 是没完成
					if (val === 1) {
						return <Tag color="green">已经完成</Tag>;
					}
					if (val === 2) {
						return <Tag color="red">正在进行</Tag>;
					}
					return <Tag>没完成</Tag>;
				},
			},
			{
				title: '开始时间',
				dataIndex: 'start_time',
				sorter: true,
				render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
			},
			{
				title: '结束时间',
				dataIndex: 'end_time',
				sorter: true,
				render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
			},
			{
				title: '操作',
				width: 150,
				render: (text, record) => (
					<div>
						<Fragment>
							<a onClick={() => this.showModal(record)}>修改</a>
						</Fragment>
						<Divider type="vertical" />
						<Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(text, record)}>
							<a href="#">Delete</a>
						</Popconfirm>
					</div>
				),
			},
		];
	}

	componentDidMount() {
		const { pageNum, pageSize } = this.props.timeAxis.timeState
		this.handleSearch(pageNum, pageSize);
	}

  /**
   * 主界面的state
   */
	_handleChange = action => {
		const { dispatch } = this.props;
		dispatch({
			type: 'timeAxis/setTimeAxisState',
			action,
		});
	}

  /**
   * 更改二级弹窗详情
   */
	_handleChangeDetail = action => {
		const { dispatch } = this.props;
		dispatch({
			type: 'timeAxis/setDetailState',
			action,
		});
	}

	handleChangePageParam = (pageNum, pageSize) => {
		this._handleChange({ pageNum, pageSize })
		this.handleSearch({ pageNum, pageSize });
	}

	showModal = record => {
		const { _id } = record
		const { dispatch } = this.props;
		if (_id) {
			dispatch({
				type: 'timeAxis/getTimeAxisDetail',
				payload: { _id },
			});
		} else {
			this._handleChangeDetail({ visible: true })
		}
	};

	handleSearch = action => {
		const { dispatch } = this.props;
		const { keyword, pageNum, pageSize, state } = this.props.timeAxis.timeState
		dispatch({
			type: 'timeAxis/queryTimeAxis',
			payload: {
				keyword,
				pageNum,
				pageSize,
				state,
				...action,
			},
		});
	};

	handleDelete = (text, record) => {
		const { dispatch } = this.props;
		const { _id } = record
		dispatch({
			type: 'timeAxis/deleteTimeAxis',
			payload: {
				_id,
			},
		});
	};

	_handlePopCancel = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'timeAxis/resetDetailState',
		});
	}

	_handleAddNewTimeDot = () => {
		const { dispatch } = this.props;
		const { detailState } = this.props.timeAxis
		const { changeType, ...rest } = detailState
		if (changeType) {
			dispatch({
				type: 'timeAxis/updateTimeAxis',
				payload: {
					...rest,
				},
			});
		} else {
			dispatch({
				type: 'timeAxis/addTimeAxis',
				payload: {
					...rest,
				},
			});
		}
	}

	renderSimpleForm = () => {
		const {
			keyword,
		} = this.props.timeAxis.timeState
		return (
			<Form layout="inline" style={{ marginBottom: '20px' }}>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={24} sm={24}>
						<FormItem>
							<Input
								placeholder="留言内容"
								value={keyword}
								onChange={event => this._handleChange({ keyword: event.target.value })}
							/>
						</FormItem>

						<Select
							style={{ width: 200, marginRight: 20 }}
							placeholder="选择状态"
							onChange={value => this._handleChange({ state: value })}
						>
							{/* 状态 1 是已经完成 ，2 是正在进行，3 是没完成 ,'' 代表所有时间轴 */}
							<Select.Option value="">所有</Select.Option>
							<Select.Option value="1">已完成</Select.Option>
							<Select.Option value="2">正在进行</Select.Option>
							<Select.Option value="3">未完成</Select.Option>
						</Select>

						<span>
							<Button
								onClick={this.handleSearch}
								style={{ marginTop: '3px' }}
								type="primary"
								icon="search"	>
								Search
						</Button>
						</span>
						<span>
							<Button
								onClick={this.showModal}
								style={{ marginTop: '3px', marginLeft: '10px' }}
								type="primary"
							>
								新增
						</Button>
						</span>
					</Col>
				</Row>
			</Form>
		);
	}

	/**
	 * 新增还有修改二级弹窗
	 */
	_renderSecondPop = () => {
		const {
			visible,
			title,
			content,
			defaultStateValue,
		} = this.props.timeAxis.detailState
		const normalCenter = {
			textAlign: 'center',
			marginBottom: 20,
		};
		return <Modal
			title="添加与修改时间轴"
			visible={visible}
			onOk={this._handleAddNewTimeDot}
			width="800px"
			onCancel={this._handlePopCancel}
		>
			<div>
				<Input
					style={normalCenter}
					addonBefore="标题"
					size="large"
					placeholder="标题"
					name="title"
					value={title}
					onChange={event => this._handleChangeDetail({ title: event.target.value })}
				/>
				<Input.TextArea
					style={normalCenter}
					size="large"
					placeholder="内容"
					name="content"
					value={content}
					onChange={event => this._handleChangeDetail({ content: event.target.value })}
				/>
				<DatePicker.RangePicker
					style={{ marginBottom: '20px', width: '100%' }}
					onChange={(date, dateString) => this._handleChangeDetail({
						start_time: new Date(dateString[0]),
						end_time: new Date(dateString[1]),
					})} />
				<Select
					style={{ marginBottom: '20px', width: '100%' }}
					placeholder="选择状态"
					defaultValue={defaultStateValue}
					onChange={value => this._handleChangeDetail({ state: value })}
				>
					{/* 状态 1 是已经完成 ，2 是正在进行，3 是没完成 */}
					<Select.Option value="1">已完成</Select.Option>
					<Select.Option value="2">正在进行中</Select.Option>
					<Select.Option value="3">没完成</Select.Option>
				</Select>
			</div>
		</Modal>
	}

	render() {
		const { list, total } = this.props.timeAxis.timeListData;
		const {
			loading,
			pageNum,
		} = this.props.timeAxis.timeState

		const _pagination = {
			total,
			defaultCurrent: pageNum,
			showSizeChanger: true,
			onShowSizeChange: (current, pageSize) => {
				this.handleChangePageParam(current, pageSize);
			},
			onChange: (current, pageSize) => {
				this.handleChangePageParam(current, pageSize);
			},
		};
		const {
			visible,
		} = this.props.timeAxis.detailState
		return (
			<PageHeaderWrapper >
				<Card bordered={false}>
					<div className="">
						<div className="">{this.renderSimpleForm()}</div>
						<Table
							pagination={_pagination}
							loading={loading}
							rowKey={record => record._id}
							columns={this.columns}
							bordered
							dataSource={list}
						/>
					</div>
				</Card>
				{visible ? this._renderSecondPop() : null}
			</PageHeaderWrapper>
		);
	}
}

export default TableList;
