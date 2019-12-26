/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
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
  Tag,
  Select,
  Modal,
  Divider,
  Radio,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const FormItem = Form.Item;
@connect(({ otherUser }) => ({
  otherUser,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机',
        dataIndex: 'phone',
      },
      {
        title: '头像',
        dataIndex: 'img_url',
      },
      {
        title: '个人介绍',
        width: 250,
        dataIndex: 'introduce',
      },
      {
        title: '类型',
        dataIndex: 'type',
        // 0：管理员 1：其他用户
        render: val =>
          (!val ? <Tag color="green">管理员</Tag> : <Tag color="blue">其他用户</Tag>),
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
    const { pageNum, pageSize } = this.props.otherUser.userState
    this.handleSearch(pageNum, pageSize);
  }

  /**
   * 主界面的state
   */
  _handleChange = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'otherUser/setUserState',
      action,
    });
  }

  /**
   * 根据用户类型进行搜索
   */
  _handleChangeSearchState = action => {
    this._handleChange(action)
    this.handleSearch(action)
  }

  /**
   * 更改二级弹窗详情
   */
  _handleChangeDetail = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'otherUser/setDetailState',
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
        type: 'otherUser/getUserDetail',
        payload: { _id },
      });
    } else {
      this._handleChangeDetail({ visible: true })
    }
  };

  handleSearch = action => {
    const { dispatch } = this.props;
    const { keyword, pageNum, pageSize, type } = this.props.otherUser.userState
    dispatch({
      type: 'otherUser/queryUser',
      payload: {
        keyword,
        pageNum,
        pageSize,
        type,
        ...action,
      },
    });
  };

  handleDelete = (text, record) => {
    const { dispatch } = this.props;
    const { _id } = record
    dispatch({
      type: 'otherUser/deleteUser',
      payload: {
        _id,
      },
    });
  };

  _handlePopCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'otherUser/resetDetailState',
    });
  }

  _handleAddNewUserDot = () => {
    const { dispatch } = this.props;
    const { detailState } = this.props.otherUser
    const { changeType, ...rest } = detailState
    if (changeType) {
      dispatch({
        type: 'otherUser/updateUser',
        payload: {
          ...rest,
        },
      });
    } else {
      dispatch({
        type: 'otherUser/addUser',
        payload: {
          ...rest,
        },
      });
    }
  }

  renderSimpleForm = () => {
    const {
      keyword,
    } = this.props.otherUser.userState
    return (
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem>
              <Input
                placeholder="用户名"
                value={keyword}
                onChange={event => this._handleChange({ keyword: event.target.value })}
              />
            </FormItem>

            <Select
              style={{ width: 200, marginRight: 20 }}
              placeholder="选择状态"
              onChange={value => this._handleChangeSearchState({ type: value, pageNum: 1, pageSize: 10 })}
            >
              {/* 状态 0 管理员 ，1 其他用户 */}
              <Select.Option value="">所有</Select.Option>
              <Select.Option value="1">其他用户</Select.Option>
              <Select.Option value="0">管理员</Select.Option>
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
      name,
      password,
      email,
      phone,
      create_time,
      type = 0,
      changeType,
      introduce,
    } = this.props.otherUser.detailState
    const normalCenter = {
      textAlign: 'center',
      marginBottom: 20,
    };
    return <Modal
      title="添加或修改用户信息"
      visible={visible}
      onOk={this._handleAddNewUserDot}
      width="800px"
      onCancel={this._handlePopCancel}
    >
      <div>
        <Radio.Group
          style={normalCenter}
          onChange={event => this._handleChangeDetail({ type: event.target.value })}
          value={type}>
          <Tag style={{ height: 40, fontSize: 14, lineHeight: '40px' }}>
            用户类型：
          </Tag>
          <Radio value={0}>超级用户</Radio>
          <Radio value={1}>普通用户</Radio>
        </Radio.Group>
        <Input
          style={normalCenter}
          addonBefore="用户名称"
          size="large"
          placeholder="用户名称"
          name="name"
          value={name}
          onChange={event => this._handleChangeDetail({ name: event.target.value })}
        />
        <Input
          style={normalCenter}
          addonBefore="密码"
          size="large"
          placeholder="密码"
          name="password"
          value={password}
          onChange={event => this._handleChangeDetail({ password: event.target.value })}
        />
        <Input
          style={normalCenter}
          addonBefore="邮箱"
          size="large"
          placeholder="邮箱"
          name="email"
          value={email}
          onChange={event => this._handleChangeDetail({ email: event.target.value })}
        />
        <Input
          style={normalCenter}
          addonBefore="手机号"
          size="large"
          placeholder="手机号"
          name="phone"
          value={phone}
          onChange={event => this._handleChangeDetail({ phone: event.target.value })}
        />
        {changeType ? <Input
          style={normalCenter}
          addonBefore="创建时间"
          size="large"
          placeholder="创建时间"
          name="create_time"
          value={create_time}
          onChange={event => this._handleChangeDetail({ create_time: event.target.value })}
        /> : ''}

        <Input.TextArea
          size="large"
          name="introduce"
          placeholder="用户简介"
          autoSize={{ minRows: 3, maxRows: 5 }}
          value={introduce}
          onChange={event => this._handleChangeDetail({ introduce: event.target.value })}
        />
      </div>
    </Modal>
  }

  render() {
    const { list, total } = this.props.otherUser.userListData;
    const {
      loading,
      pageNum,
    } = this.props.otherUser.userState

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
    } = this.props.otherUser.detailState
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
