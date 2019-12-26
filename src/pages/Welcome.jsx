import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert } from 'antd';
import styles from './Welcome.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text >{children}</Typography.Text>
    </code>
  </pre>
);

export default () => (
  <PageHeaderWrapper>
    <Card style={{ height: '400px' }}>
      <Alert
        message="首页尚未完全完成"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
      <Typography.Text
        strong
        style={{
          marginBottom: 12,
        }}
      >
      </Typography.Text>
      <CodePreview> 根据喜好，完成首页</CodePreview>
    </Card>
  </PageHeaderWrapper>
);
