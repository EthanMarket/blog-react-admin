import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Table, Popconfirm, Modal, Switch, Tag, Select, Radio, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const FormItem = Form.Item;
@connect(({ friendLinks }) => ({
  friendLinks,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '链接名',
        dataIndex: 'name',
      },
      {
        title: '图标',
        dataIndex: 'icon',
      },
      {
        title: 'url',
        dataIndex: 'url',
      },
      {
        title: '描述',
        dataIndex: 'desc',
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: val => (val ? <Tag>其他友情链接</Tag> : <Tag color="green">博主链接</Tag>),
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: state => <Switch checked={!!state} disabled />,
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
    ]
  }

  componentDidMount() {
    const { pageNum, pageSize } = this.props.friendLinks.linkState
    this.handleSearch(pageNum, pageSize);
  }

  /**
   * 公共头部，选择
   */
  _handleChange = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'friendLinks/setLinkState',
      action,
    });
  }

  _handlePopCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'friendLinks/resetLinkState',
    });
  }

  /**
   * 根据用户类型进行搜索
   */
  _handleChangeSearchState = action => {
    this._handleChange(action)
    this.handleSearch(action)
  }

  _handleChangeInput = event => {
    this._handleChange({ [event.target.name]: event.target.value })
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
        type: 'friendLinks/getLinkDetail',
        payload: { _id },
      });
    } else {
      this._handleChange({ visible: true })
    }
  };

  _handleAddNewLink = () => {
    const { dispatch } = this.props;
    const { name, desc, url, type, icon, state, changeType, _id } = this.props.friendLinks.linkState
    if (changeType) {
      dispatch({
        type: 'friendLinks/updateLink',
        payload: {
          name, desc, url, type, icon, state, _id,
        },
      });
    } else {
      dispatch({
        type: 'friendLinks/addLink',
        payload: {
          name, desc, url, type, icon, state,
        },
      });
    }
  };

  handleSearch = action => {
    const { dispatch } = this.props;
    const { keyword, pageNum, pageSize } = this.props.friendLinks.linkState
    dispatch({
      type: 'friendLinks/queryLink',
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
      type: 'friendLinks/deleteLink',
      payload: {
        _id,
      },
    });
  };

  renderSimpleForm = () => {
    const {
      keyword,
    } = this.props.friendLinks.linkState;
    return (
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem>
              <Input
                placeholder="链接名"
                value={keyword}
                onChange={event => this._handleChange({ keyword: event.target.value })}
              />
            </FormItem>

            <Select
              style={{ width: 200, marginRight: 20 }}
              placeholder="选择类型"
              onChange={
                value => this._handleChangeSearchState({
                  type: value,
                  pageNum: 1,
                  pageSize: 10,
                })}
            >
              <Select.Option value="">所有</Select.Option>
              <Select.Option value="1">其他链接</Select.Option>
              <Select.Option value="0">博主链接</Select.Option>
            </Select>

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

  _renderSecondPop = () => {
    const {
      visible,
      name,
      desc,
      url,
      icon,
      type,
      state,
    } = this.props.friendLinks.linkState;
    const normalCenter = {
      textAlign: 'center',
      marginBottom: 20,
    };
    return <div>
      <Modal
        title="添加链接"
        visible={visible}
        onOk={this._handleAddNewLink}
        width="600px"
        onCancel={this._handlePopCancel}
      >
        <Input
          style={normalCenter}
          addonBefore="链接名"
          size="large"
          placeholder="链接名"
          name="name"
          value={name}
          onChange={this._handleChangeInput}
        />
        <Input
          style={normalCenter}
          addonBefore="链接图标"
          size="large"
          placeholder="链接图标"
          name="icon"
          value={icon}
          onChange={this._handleChangeInput}
        />
        <Input
          style={normalCenter}
          addonBefore="链接链接"
          size="large"
          placeholder="链接链接"
          name="url"
          value={url}
          onChange={this._handleChangeInput}
        />
        <Radio.Group
          style={normalCenter}
          onChange={event => this._handleChange({ type: event.target.value })}
          value={type}>
          <Tag style={{ height: 40, fontSize: 14, lineHeight: '40px' }}>
            链接类型
          </Tag>
          <Radio value={1}>其他友情链接</Radio>
          <Radio value={0}>博主的个人链接</Radio>
        </Radio.Group>
        <Input
          style={normalCenter}
          addonBefore="描述"
          size="large"
          placeholder="描述"
          name="desc"
          value={desc}
          onChange={this._handleChangeInput}
        />
        <div>
          <Tag style={{ height: 40, fontSize: 14, lineHeight: '40px', paddingRight: 20 }}>
            是否展示：
          <Switch
          style={{ marginLeft: 50 }}
            defaultChecked={!!state}
            onChange={checked => this._handleChange({ state: checked ? 1 : 0 })}
          />
          </Tag>
        </div>
      </Modal>
    </div>
  }

  render() {
    const { list, total } = this.props.friendLinks.linkListData;
    const {
      loading,
      pageNum,
    } = this.props.friendLinks.linkState;
    const {
      visible,
    } = this.props.friendLinks.linkState;
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
