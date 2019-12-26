/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Input, Modal } from 'antd';
import { connect } from 'dva';
import ArticleHeader from '../ArticleHeader'

@connect(({ article, tag, category }) => ({
  article,
  tag,
  category,
}))
class ArticleComponent extends React.Component {
  /**
   * 重置文章详情
   */
  _handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/resetArticle',
    });
  }

/**
 * 更新并提交
 */
  _handleUpdateSubmit = () => {
    const { dispatch } = this.props;
    const { articleDetailData } = this.props.article
    const { changeType } = articleDetailData
    if (changeType) {
      dispatch({
        type: 'article/updateArticle',
        payload: {
          ...articleDetailData,
        },
      });
    } else {
      dispatch({
        type: 'article/addArticle',
        payload: {
          ...articleDetailData,
        },
      });
    }
  }

  /**
   * 修改文章内容
   */
  _handleChange = event => {
    const { dispatch } = this.props;
    const action = { content: event.target.value }
    dispatch({
      type: 'article/changeArticleDetailState',
      action,
    });
  }

  render() {
    const {
      detailVisible,
      content,
    } = this.props.article.articleDetailData
    const { TextArea } = Input;
    return (
      <div>
        <Modal
          title="添加与修改文章"
          visible={detailVisible}
          onOk={this._handleUpdateSubmit}
          width="1200px"
          onCancel={this._handleCancel}
        >
          <ArticleHeader></ArticleHeader>
          <TextArea
            style={{ marginBottom: 20 }}
            size="large"
            rows={6}
            autosize={{ minRows: 15 }}
            placeholder="文章内容，支持 markdown 格式"
            name="content"
            value={content}
            onChange={this._handleChange}
          />
        </Modal>
      </div>
    );
  }
}

export default ArticleComponent;
