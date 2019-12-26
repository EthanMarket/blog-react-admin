export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: '欢迎',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/article',
            name: '文章',
            icon: 'file-markdown',
            routes: [
              {
                path: '/article/list',
                name: '文章列表',
                component: './Article/ArticleList/index',
              },
              {
                path: '/article/create',
                name: '创建文章',
                component: './Article/ArticleCreate/index',
              },
            ],
          },
          {
            path: '/tag',
            name: '标签',
            icon: 'tags',
            component: './Tag/index',
          },
          {
            path: '/category',
            name: '分类',
            icon: 'book',
            component: './Category/index',
          },
          {
            path: '/friendlink',
            name: '友情链接',
            icon: 'link',
            component: './FriendLinks/index',
          },
          {
            path: '/project',
            name: '项目管理',
            icon: 'project',
            component: './Project/index',
          },
          {
            path: '/timeAxis',
            name: '时间轴',
            icon: 'clock-circle',
            component: './TimeAxis/index',
          },
          {
            path: '/otherUser',
            name: '用户管理',
            icon: 'usergroup-add',
            component: './OtherUser/index',
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: './Admin',
            authority: ['admin'],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
