import { Select } from 'antd';
import React from 'react';

export default {
  getArticleSelectOption: dataList => { // 获取分类和tag下拉列表选择项
    const children = [];
     dataList.map(item => {
      const { _id, name } = item
      return children.push(
        <Select.Option key={_id} value={_id}>
          {name}
        </Select.Option>,
      );
    })
    return children
  },
}
