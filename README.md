## blog 后台管理系统
* 使用[Ant Design Pro](https://pro.ant.design)初始化创建项目
* 感谢[@夜尽天明](https://github.com/biaochenxuying)提供的[后台管理系统](https://github.com/biaochenxuying/blog-react-admin)UI模板支持
### 一、项目准备
* 安装node环境，本项目`node版本v10.15.3`
* 安装依赖`npm install`
* 运行`npm start`
* `Node：`运行项目之前，需先启动[blog-koa项目](https://github.com/EthanMarket/blog-koa)

### 二、项目预览：
* 
	
### 二、主要功能：
####  1、`routers`目录
* `config`//项目配置文件目录
 *	[`blogRouters.js`](https://github.com/EthanMarket/blog-react-admin/blob/master/config/blogRouters.js) //项目路由目录，整个项目的页面路由

-`SimpleCode：`

	{
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
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
          **********************
        ],
      }
####  2、`src/services`目录
* [`api.js`](https://github.com/EthanMarket/blog-react-admin/blob/master/src/services/api.js)保存了api接口信息

-`SimpleCode：`
    
    export async function queryArticle(params) {
      return request(`/api/getArticleListAdmin?${stringify(params)}`);
    }
    
    export async function addArticle(params) {
      return request('/api/addArticle', {
	    method: 'POST',
	    data: params,
      });
    }
