/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { connect } from 'dva';
import { Input, Select } from 'antd';
import articleHelper from '../articleHelper';

@connect(({ article, tag, category }) => ({
  article,
  tag,
  category,
}))
export default class ArticleHeader extends React.Component {
  constructor(props) {
    super(props)

    this.info = {
      keyword: '',
      pageNum: 1,
      pageSize: 50,
    }
  }

  componentDidMount() {
    this.handleSearchTag();
    this.handleSearchCategory();
  }

  handleSearchTag = () => {
    const { dispatch } = this.props;
    const { keyword, pageNum, pageSize } = this.info
    dispatch({
      type: 'tag/queryTag',
      payload: {
        keyword,
        pageNum,
        pageSize,
      },
    });
  };

  handleSearchCategory = () => {
    const { dispatch } = this.props;
    const { keyword, pageNum, pageSize } = this.info
    dispatch({
      type: 'category/queryCategory',
      payload: {
        keyword,
        pageNum,
        pageSize,
      },
    });
  };

  /**
   * 文章公共头部，输入
   */
  _inputHandleChange = event => {
    this._handleChange({ [event.target.name]: event.target.value })
  }

  /**
   * 公共头部，选择
   */
  _handleChange = action => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/changeArticleDetailState',
      action,
    });
  }


  render() {
    const tagList = this.props.tag.tagListData.list;
    const { list } = this.props.category.categoryListData;
    const tagOptions = articleHelper.getArticleSelectOption(tagList)// 获取标签分类
    const categoryOptions = articleHelper.getArticleSelectOption(list)// 获取文章分类

    const {
      title,
      author,
      keyword,
      desc,
      img_url,
      typeDefault = '普通文章', // 文章类型
      originDefault = '原创', // 是否原创
      stateDefault = '发布', // 发布状态
    } = this.props.article.articleDetailData
    const normalCenter = {
      textAlign: 'center',
      marginBottom: 20,
    };
    console.log(stateDefault);
    return (
      <fragment>
        <Input
          style={normalCenter}
          addonBefore="标题"
          size="large"
          placeholder="标题"
          name="title"
          value={title}
          onChange={this._inputHandleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="作者"
          size="large"
          placeholder="作者"
          name="author"
          value={author}
          onChange={this._inputHandleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="关键字"
          size="large"
          placeholder="关键字"
          name="keyword"
          value={keyword}
          onChange={this._inputHandleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="描述"
          size="large"
          placeholder="描述"
          name="desc"
          value={desc}
          onChange={this._inputHandleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="封面链接"
          size="large"
          placeholder="封面链接"
          name="img_url"
          value={img_url}
          onChange={this._inputHandleChange}
        />

        <Select
          style={{ width: 200, marginTop: 20, marginBottom: 20 }}
          placeholder="选择发布状态"
          defaultValue={stateDefault}
          onChange={value => this._handleChange({ state: value })}
        >
          {/*  0 草稿，1 发布 */}
          <Select.Option value="0">草稿</Select.Option>
          <Select.Option value="1">发布</Select.Option>
        </Select>

        <Select
          style={{ width: 200, marginTop: 20, marginBottom: 20 }}
          placeholder="选择文章类型"
          defaultValue={typeDefault}
          onChange={value => this._handleChange({ type: value })}
        >
          {/* 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍 */}
          <Select.Option value="1">普通文章</Select.Option>
          <Select.Option value="2">简历</Select.Option>
          <Select.Option value="3">管理员介绍</Select.Option>
        </Select>

        <Select
          style={{ width: 200, marginTop: 20, marginLeft: 10, marginBottom: 20 }}
          placeholder="选择文章转载状态"
          defaultValue={originDefault}
          onChange={value => this._handleChange({ origin: value })}
        >
          {/* 0 原创，1 转载，2 混合 */}
          <Select.Option value="0">原创</Select.Option>
          <Select.Option value="1">转载</Select.Option>
          <Select.Option value="2">混合</Select.Option>
        </Select>

        <Select
          allowClear
          mode="multiple"
          style={{ width: 200, marginTop: 20, marginLeft: 10, marginBottom: 20 }}
          placeholder="标签"
          onChange={value => this._handleChange({ tags: value })}
        >
          {tagOptions}
        </Select>
        <Select
          allowClear
          mode="multiple"
          style={{ width: 200, marginTop: 20, marginLeft: 10, marginBottom: 20 }}
          placeholder="文章分类"
          onChange={value => { this._handleChange({ category: value }) }}
        >
          {categoryOptions}
        </Select>
      </fragment>
    )
  }
}
