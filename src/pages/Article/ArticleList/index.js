/* eslint-disable react/jsx-no-target-blank */
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
  Divider,
  Tag,
  Select,
  Avatar,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import domain from '@/utils/domain';
import ArticleComponent from './ArticleComponent';
import Comments from '../Comments';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ article }) => ({
  article,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '标题',
          width: 120,
          dataIndex: 'title',
          align: 'center',
        },
        {
          title: '作者',
          width: 80,
          dataIndex: 'author',
          align: 'center',
        },
        {
          title: '关键字',
          width: 80,
          dataIndex: 'keyword',
          render: arr => (
            <span>
              {arr.map(item => (
                <span color="magenta" key={item}>
                  {item}
                </span>
              ))}
            </span>
          ),
          align: 'center',
        },
        {
          title: '封面图',
          width: 80,
          dataIndex: 'img_url',
          render: val => <Avatar shape="square" src={val} size={40} icon="user" />,
          align: 'center',
        },
        {
          title: '标签',
          dataIndex: 'tags',
          width: 60,
          render: arr => (
            <span>
              {arr.map(item => (
                <Tag color="cyan" key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </span>
          ),
          align: 'center',
        },
        {
          title: '分类',
          dataIndex: 'category',
          width: 70,
          render: arr => (
            <span>
              {arr.map(item => (
                <Tag color="blue" key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </span>
          ),
          align: 'center',
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: 70,
          render: val => {
            // 文章发布状态 => 0 草稿，1 已发布
            if (val) {
              return <Tag color="green">已发布</Tag>
            }
            return <Tag color="red">草稿</Tag>;
          },
          align: 'center',
        },
        {
          title: '评论已处理',
          dataIndex: 'comments',
          width: 50,
          render: comments => {
            // console.log('comments',comments)
            let flag = 1;
            const { length } = comments;
            if (length) {
              for (let i = 0; i < length; i++) {
                flag = comments[i].is_handle;
              }
            }
            // 新添加的评论 是否已经处理过 => 1 是 / 2 否
            if (flag === 2) {
              return <Tag color="red">否</Tag>;
            }
            return <Tag color="green">是</Tag>;
          },
          align: 'center',
        },
        {
          title: '观看/点赞/评论',
          width: 120,
          dataIndex: 'meta',
          render: val => (
            <div>
              <span>{val.views}</span> | <span>{val.likes}</span> | <span>{val.comments}</span>
            </div>
          ),
        },
        {
          title: '原创',
          dataIndex: 'origin',
          align: 'center',
          width: 50,
          render: val => {
            // 文章转载状态 => 0 原创，1 转载，2 混合
            if (val === 0) {
              return <Tag color="green">原创</Tag>;
            }
            if (val === 1) {
              return <Tag color="red">转载</Tag>;
            }
            return <Tag>混合</Tag>;
          },
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
          sorter: true,
          align: 'center',
          render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
          title: '操作',
          width: 220,
          align: 'center',
          render: (text, record) => (
            <div>
              <Fragment>
                <a onClick={() => this.showModal({
                  _id: record._id, detailVisible: true, changeType: true,
                })}>修改</a>
              </Fragment>
              <Divider type="vertical" />
              <Fragment>
                <a onClick={() => this.showModal({
                  _id: record._id, commentsVisible: true,
                })
                }>评论</a>
              </Fragment>
              <Divider type="vertical" />
              <Fragment>
                <a href={`${domain}articleDetail?_id=${record._id}`} target="_blank">详情</a>
              </Fragment>
              <Divider type="vertical" />
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(text, record)}>
                <a href="#">Delete</a>
              </Popconfirm>
            </div>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    const { pageNum, pageSize } = this.props.article.articleListData
    this.handleSearch(pageNum, pageSize);
  }

  handleChangeSearchState = state => {
    this._handleChangeState({ state, pageNum: 1, pageSize: 10 })
    this.handleSearch({ state })// 刷新一次
  }


  handleChangePageParam = (pageNum, pageSize) => {
    this._handleChangeState({ pageNum, pageSize })
    this.handleSearch({ pageNum, pageSize })// 刷新一次
  }

  /**
   *新增，修改，评论
   */
  showModal = action => {
    // action=0时，新增文章
    // action={}时，修改文章，获取文章详情
    const { dispatch } = this.props;
    if (action) {
      const { _id, detailVisible, commentsVisible } = action
      const params = {
        _id,
        filter: 2, // 文章的评论过滤 => 1: 过滤，2: 不过滤
      };
      dispatch({
        type: 'article/getArticleDetail',
        payload: {
          detailVisible,
          commentsVisible,
          type: 1,
          ...params,
        },
      });
    } else {
      // 新增文章
      dispatch({
        type: 'article/changeArticleDetailState',
        action: {
          detailVisible: true,
          changeType: false, // 这不是更新
        },
      });
    }
  };

  handleSearch = action => {
    const { dispatch } = this.props;
    const { keyword, state, pageNum, pageSize } = this.props.article.articleListData
    const params = {
      keyword,
      state,
      pageNum,
      pageSize,
      ...action,
    };
    dispatch({
      type: 'article/queryArticle',
      payload: {
        ...params,
      },
    });
  };

  handleSearchKeywords = () => {
    const { dispatch } = this.props;
    const { keyword, state, pageNum, pageSize } = this.props.article.articleListData
    const params = {
      keyword,
      state,
      pageNum,
      pageSize,
    };
    dispatch({
      type: 'article/queryArticle',
      payload: {
        ...params,
      },
    });
  };

  handleDelete = (text, record) => {
    const { dispatch } = this.props;
    const { _id } = record
    dispatch({
      type: 'article/delArticle',
      payload: { _id },
    });
  };

  /**
   * 公共头部，选择
   */
  _handleChangeState = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/articleListState',
      action,
    });
  }

  renderSimpleForm() {
    const { keyword } = this.props.article.articleListData
    return (
      <Form layout="inline" style={{ marginBottom: '20px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
            <FormItem>
              <Input
                placeholder="标题/描述"
                value={keyword}
                onChange={event => this._handleChangeState({ keyword: event.target.value })}
              />
            </FormItem>

            <Select
              style={{ width: 200, marginRight: 20 }}
              placeholder="选择状态"
              onChange={this.handleChangeSearchState}
            >
              {/* 文章发布状态 => 0 草稿，1 已发布'' 代表所有文章 */}
              <Select.Option value="">所有</Select.Option>
              <Select.Option value="0">草稿</Select.Option>
              <Select.Option value="1">已发布</Select.Option>
            </Select>

            <span>
              <Button
                onClick={this.handleSearchKeywords}
                style={{ marginTop: '3px' }}
                type="primary"
                icon="search"
              >
                Search
              </Button>
            </span>
            <span>
              <Button
                onClick={() => {
                  this.showModal(0);
                }}
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


  render() {
    const { articleListData } = this.props.article;
    const { list, total, pageNum, pageSize, loading } = articleListData
    const pagination = {
      total,
      defaultCurrent: pageNum,
      pageSize,
      showSizeChanger: true,
      onShowSizeChange: current => {
        this.handleChangePageParam(current, pageSize);
      },
      onChange: current => {
        this.handleChangePageParam(current, pageSize);
      },
    };

    return (
      <PageHeaderWrapper >
        <Card bordered={false}>
          <div >
            <div>{this.renderSimpleForm()}</div>
            <Table
              size="middle"
              pagination={pagination}
              loading={loading}
              rowKey={record => record._id}
              columns={this.state.columns}
              bordered
              dataSource={list}
            />
          </div>
        </Card>
        <Comments />
        <ArticleComponent />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
