/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Button, notification } from 'antd';
import { connect } from 'dva';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import 'simplemde/dist/simplemde.min.css';
import './style.less';
import ArticleHeader from '../ArticleHeader'

@connect(({ article, tag, category }) => ({
  article,
  tag,
  category,
}))
class ArticleCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smde: null,
    };
  }

  componentDidMount() {
    this.state.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: {
        enabled: false,
        uniqueId: 'SimpleMDE',
        delay: 1000,
      },
      previewRender(plainText) {
        return marked(plainText, {
          renderer: new marked.Renderer(),
          gfm: true,
          pedantic: false,
          sanitize: false,
          tables: true,
          breaks: true,
          smartLists: true,
          smartypants: true,
          highlight(code) {
            return highlight.highlightAuto(code).value;
          },
        });
      },
    });
  }

  _handleChange = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/changeArticleDetailState',
      action,
    });
  }

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { articleDetailData } = this.props.article;
    const {
      title,
      keyword,
      _id,
    } = articleDetailData
    if (!title) {
      notification.error({
        message: '文章标题不能为空',
      });
      return
    }
    if (!keyword) {
      notification.error({
        message: '文章关键字不能为空',
      });
      return
    }
    if (!this.state.smde.value()) {
      notification.error({
        message: '文章内容不能为空',
      });
      return
    }
    this._handleChange({ loading: true })
    // 修改
    if (_id) {
      dispatch({
        type: 'article/updateArticle',
        payload: {
          ...articleDetailData,
          content: this.state.smde.value(),
        },
      });
    } else {
      // 添加
      dispatch({
        type: 'article/addArticle',
        payload: {
          ...articleDetailData,
          content: this.state.smde.value(),
        },
      });
    }
  }


  render() {
    const {
      loading,
    } = this.props.article.articleDetailData
    return (
      <div >
        <ArticleHeader />
        <div>
          <Button
            onClick={this.handleSubmit}
            loading={loading}
            style={{ marginBottom: '10px' }}
            type="primary"
          >提交</Button>
        </div>

        <div title="添加与修改文章" width="1200px">
          <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={6} />
        </div>
      </div >
    );
  }
}

export default ArticleCreate;
