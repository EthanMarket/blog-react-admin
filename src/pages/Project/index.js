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
  Avatar,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const FormItem = Form.Item;
@connect(({ project }) => ({
  project,
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
        align: 'center',
      },
      {
        title: '内容',
        width: 350,
        dataIndex: 'content',
        align: 'center',
      },
      {
        title: '项目地址',
        width: 100,
        dataIndex: 'url',
        align: 'center',
      },
      {
        title: '封面图',
        width: 50,
        dataIndex: 'img',
        align: 'center',
        render: val => <Avatar shape="square" src={val} size={40} icon="user" />,
      },
      {
        title: '状态',
        dataIndex: 'state', // 状态 1 是已经完成 ，2 是正在进行，3 是没完成
        align: 'center',
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
        align: 'center',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'end_time',
        align: 'center',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        align: 'center',
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
    const { pageNum, pageSize } = this.props.project.projectState
    this.handleSearch(pageNum, pageSize);
  }

  /**
   * 主界面的state
   */
  _handleChange = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/setProjectState',
      action,
    });
  }

  _handleChangeSearchState = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/setProjectState',
      action,
    });
    this.handleSearch(action)// 刷新一次
  }

  /**
   * 更改二级弹窗详情
   */
  _handleChangeDetail = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/setDetailState',
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
        type: 'project/getProjectDetail',
        payload: { _id },
      });
    } else {
      this._handleChangeDetail({ visible: true })
    }
  };

  handleSearch = action => {
    const { dispatch } = this.props;
    const { keyword, pageNum, pageSize, state } = this.props.project.projectState
    dispatch({
      type: 'project/getProjectList',
      payload: {
        keyword,
        pageNum,
        pageSize,
        state,
        ...action,
      },
    });
  };

  _handleSearchkeywords = () => {
    const { dispatch } = this.props;
    const { keyword, state } = this.props.project.projectState
    const pageNum = 1
    const pageSize = 10
    dispatch({
      type: 'project/setProjectState',
      action: {
        pageNum,
        pageSize,
      },
    });
    dispatch({
      type: 'project/getProjectList',
      payload: {
        keyword,
        pageNum,
        pageSize,
        state,
      },
    });
  }

  handleDelete = (text, record) => {
    const { dispatch } = this.props;
    const { _id } = record
    dispatch({
      type: 'project/deleteProject',
      payload: {
        _id,
      },
    });
  };

  _handlePopCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/resetDetailState',
    });
  }

  _handleAddProject = () => {
    const { dispatch } = this.props;
    const { detailState } = this.props.project
    const { changeType, ...rest } = detailState
    if (changeType) {
      dispatch({
        type: 'project/updateProject',
        payload: {
          ...rest,
        },
      });
    } else {
      dispatch({
        type: 'project/addProject',
        payload: {
          ...rest,
        },
      });
    }
  }

  renderSimpleForm = () => {
    const {
      keyword,
    } = this.props.project.projectState
    return (
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem>
              <Input
                placeholder="项目 标题/内容"
                value={keyword}
                onChange={event => this._handleChange({ keyword: event.target.value })}
              />
            </FormItem>

            <Select
              style={{ width: 200, marginRight: 20 }}
              placeholder="选择状态"
              onChange={value => this._handleChangeSearchState({
                state: value,
                pageNum: 1,
                pageSize: 10,
              })}
            >
              {/* 状态 1 是已经完成 ，2 是正在进行，3 是没完成 ,'' 代表所有项目 */}
              <Select.Option value="">所有</Select.Option>
              <Select.Option value="1">已完成</Select.Option>
              <Select.Option value="2">正在进行</Select.Option>
              <Select.Option value="3">未完成</Select.Option>
            </Select>

            <span>
              <Button
                onClick={this._handleSearchkeywords}
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
      </Form >
    );
  }

	/**
	 * 新增还有修改二级弹窗
	 */
  _renderSecondPop = () => {
    const {
      visible,
      title,
      url,
      img,
      content,
      defaultStateValue,
    } = this.props.project.detailState

    const normalCenter = {
      textAlign: 'center',
      marginBottom: 20,
    };
    return <Modal
      title="添加与修改项目"
      visible={visible}
      onOk={this._handleAddProject}
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
        <Input
          style={normalCenter}
          addonBefore="地址"
          size="large"
          placeholder="项目链接url"
          name="url"
          value={url}
          onChange={event => this._handleChangeDetail({ url: event.target.value })}
        />
        <Input
          style={normalCenter}
          addonBefore="封面"
          size="large"
          placeholder="封面图片url"
          name="img"
          value={img}
          onChange={event => this._handleChangeDetail({ img: event.target.value })}
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
    const { list, total } = this.props.project.projectListData;
    const {
      loading,
      pageNum,
    } = this.props.project.projectState

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
    } = this.props.project.detailState
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
