import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Table, Popconfirm, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const FormItem = Form.Item;
/* eslint react/no-multi-comp:0 */
@connect(({ category }) => ({
	category,
}))
@Form.create()
class TableList extends PureComponent {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: '分类名',
				dataIndex: 'name',
			},
			{
				title: '创建时间',
				dataIndex: 'create_time',
				sorter: true,
				render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
			},
			{
				title: '操作',
				render: (text, record) => (
					<Fragment>
						<Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(text, record)}>
							<a href="#">Delete</a>
						</Popconfirm>
					</Fragment>
				),
			},
		];
	}

	componentDidMount() {
		const { pageNum, pageSize } = this.props.category.categoryState
		this.handleSearch(pageNum, pageSize);
	}

  /**
   * 公共头部，选择
   */
	_handleChange = action => {
    const { dispatch } = this.props;
		dispatch({
			type: 'category/changeCategoryState',
			action,
		});
	}


	handleChangePageParam = (pageNum, pageSize) => {
		this._handleChange({ pageNum, pageSize })
		this.handleSearch({ pageNum, pageSize });
	}

	showModal = () => {
		this._handleChange({ visible: true })
	};

	_handleAddNewCategory = () => {
		const { dispatch } = this.props;
		const { name, desc } = this.props.category.categoryState
		dispatch({
			type: 'category/addCategory',
			payload: {
				name, desc,
			},
		});
	};

	handleSearch = action => {
		const { dispatch } = this.props;
		const { keyword, pageNum, pageSize } = this.props.category.categoryState
		dispatch({
			type: 'category/queryCategory',
			payload: {
				keyword,
				pageNum,
				pageSize,
				...action,
			},
		});
	};

	handleDelete = (text, record) => {
		const { dispatch } = this.props;
		const { _id } = record
		dispatch({
			type: 'category/deleteCategory',
			payload: {
				_id,
			},
		});
	};

	renderSimpleForm() {
		const {
			keyword,
		} = this.props.category.categoryState;
		return (
			<Form layout="inline" style={{ marginBottom: '20px' }}>
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
					<Col md={24} sm={24}>
						<FormItem>
							<Input
								placeholder="分类名"
								value={keyword}
								onChange={event => this._handleChange({ keyword: event.target.value })}
							/>
						</FormItem>

						<span>
							<Button
								onClick={this.handleSearch}
								style={{ marginTop: '3px' }}
								type="primary"
								icon="search"
							>
								Search
          </Button>
						</span>
						<span>
							<Button
								style={{ marginTop: '3px', marginLeft: '20px' }}
								onClick={this.showModal}
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

	render() {
		const { list, total } = this.props.category.categoryListData;
		const {
			visible,
			loading,
			pageNum,
			name,
			desc,
		} = this.props.category.categoryState;
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
		const normalCenter = {
			textAlign: 'center',
			marginBottom: 20,
		};
		return (
			<PageHeaderWrapper title="分类管理">
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
				<Modal
					title="分类标签"
					visible={visible}
					onOk={this._handleAddNewCategory}
					width="600px"
					onCancel={() => this._handleChange({ visible: false })}
				>
					<Input
						style={normalCenter}
						addonBefore="分类名"
						size="large"
						placeholder="分类名"
						name="title"
						value={name}
						onChange={event => this._handleChange({ name: event.target.value })}
					/>
					<Input
						addonBefore="描述"
						size="large"
						placeholder="描述"
						name="title"
						value={desc}
						onChange={event => this._handleChange({ desc: event.target.value })}
					/>
				</Modal>
			</PageHeaderWrapper>
		);
	}
}

export default TableList;
