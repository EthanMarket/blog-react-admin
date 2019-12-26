/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Modal, Select, Comment, Avatar, Tag } from 'antd';
import { connect } from 'dva';

function CommentItem({ item, children }) {
  return (<Comment
    actions={item.actions}
    author={<a>{item.user.name}</a>}
    avatar={<Avatar src={item.user.avatar} alt={item.user.name} />}
    content={
      <p>
        {' '}
        {item.to_user ? `@${item.to_user.name}:  ` : ''} {item.content}
      </p>
    }
  >
    {children}
  </Comment>)
}

@connect(({ article }) => ({
  article,
}))
export default class Comments extends React.Component {
  _selectValue = state => {
    switch (state) {
      case 0:
        return '待审核';
      case 1:
        return '正常通过';
      case -1:
        return '删除';
      case -2:
        return '垃圾评论';
      default:
        return ''
    }
  }


  handleChangeState = (_id, value, type, index, item) => {
    const { dispatch } = this.props;
    if (type === 1) {
      const params = {
        _id: item._id,
        article_id: _id,
        state: value,
      };
      dispatch({
        type: 'article/changeComment',
        payload: {
          ...params,
        },
      });
    } else {
      const params = {
        _id: item._id,
        article_id: _id,
        state: value,
        index,
      };
      dispatch({
        type: 'article/changeThirdComment',
        payload: {
          ...params,
        },
      });
    }
  }

  _renderComment = (commentList, _id) => commentList.map((item, index) => {
    const { state, is_handle, other_comments } = item
    const defaultValue = this._selectValue(state)
    item.actions = [
      <div>
        {is_handle === 2 ? (
          <Tag color="red">未处理过</Tag>
        ) : (
            <Tag color="green">已经处理过</Tag>
          )}
        <Select
          style={{ width: 200, marginBottom: 10, marginLeft: 10 }}
          placeholder="选择审核状态"
          defaultValue={defaultValue}
          onChange={value => {
            this.handleChangeState(_id, value, 1, index, item);
          }}
        >
          {/* 状态 => 0 待审核 / 1 正常通过 / -1 已删除 / -2 垃圾评论 */}
          <Select.Option value="0">待审核</Select.Option>
          <Select.Option value="1">正常通过</Select.Option>
          <Select.Option value="-1">删除</Select.Option>
          <Select.Option value="-2">垃圾评论</Select.Option>
        </Select>
      </div>,
    ];
    return (<CommentItem key={item._id} item={item}>
      {this._renderSecondComment(other_comments)}
    </CommentItem>)
  })


  _renderSecondComment = other_comments => other_comments.map((item, index) => {
    const { state } = item
    const defaultValue = this._selectValue(state)
    item.actions = [
      <Select
        style={{ width: 200, marginBottom: 10 }}
        placeholder="选择审核状态"
        defaultValue={defaultValue}
        onChange={value => {
          this.handleChangeState(value, 2, index, item);
        }}
      >
        {/* 状态 => 0 待审核 / 1 通过正常 / -1 已删除 / -2 垃圾评论 */}
        <Select.Option value="0">待审核</Select.Option>
        <Select.Option value="1">通过</Select.Option>
        <Select.Option value="-1">删除</Select.Option>
        <Select.Option value="-2">垃圾评论</Select.Option>
      </Select>,
    ];
    return (<CommentItem key={item._id} item={item} />)
  })

  _handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/resetArticle',
    });
  }

  render() {
    const { articleDetailData } = this.props.article;
    const { commentsVisible, comments, _id } = articleDetailData
    const list = this._renderComment(comments, _id)
    const normalCenter = {
      textAlign: 'center',
      marginBottom: 20,
    };
    return (
      <div>
        <Modal
          title="文章评论管理"
          visible={commentsVisible}
          onOk={this._handleCancel}
          width="1200px"
          onCancel={this._handleCancel}
        >
          <h2 style={normalCenter}>{articleDetailData.title}</h2>
          <div>{list.length ? list : <div style={normalCenter}>暂无评论！</div>}</div>
        </Modal>
      </div>
    );
  }
}
