import { stringify } from 'qs';
import request from '@/utils/request';

/* ---------------文章管理start by ethan---------------------------*/
export async function queryArticle(params) {
  return request(`/api/getArticleListAdmin?${stringify(params)}`);
}

export async function addArticle(params) {
  return request('/api/addArticle', {
    method: 'POST',
    data: params,
  });
}
export async function delArticle(params) {
  return request('/api/delArticle', {
    method: 'POST',
    data: params,
  });
}

export async function updateArticle(params) {
  return request('/api/updateArticle', {
    method: 'POST',
    data: params,
  });
}

export async function getArticleDetail(params) {
  return request('/api/getArticleDetail', {
    method: 'POST',
    data: params,
  });
}
export async function changeComment(params) {
  return request('/api/changeComment', {
    method: 'POST',
    data: params,
  });
}
export async function changeSecondComment(params) {
  return request('/api/changeSecondComment', {
    method: 'POST',
    data: params,
  });
}

/* ---------------文章管理end by ethan---------------------------*/
/* ---------------项目管理start by ethan------------*/
export async function getProjectList(params) {
  return request(`/api/getProjectList?${stringify(params)}`);
}
export async function addProject(params) {
  return request('/api/addProject', {
    method: 'POST',
    data: params,
  });
}
export async function updateProject(params) {
  return request('/api/updateProject', {
    method: 'POST',
    data: params,
  });
}
export async function deleteProject(params) {
  return request('/api/delProject', {
    method: 'POST',
    data: params,
  });
}
export async function getProjectDetail(params) {
  return request('/api/getProjectDetail', {
    method: 'POST',
    data: params,
  });
}
/* ---------------项目管理end by ethan--------------*/
/* ---------------标签管理start by ethan---------------------------*/
export async function queryTag(params) {
  return request(`/api/getTagList?${stringify(params)}`);
}

export async function addTag(params) {
  return request('/api/addTag', {
    method: 'POST',
    data: params,
  });
}

export async function delTag(params) {
  return request('/api/delTag', {
    method: 'POST',
    data: params,
  });
}
/* ---------------标签管理end by ethan---------------------------*/
/*= ====================分类管理start by ethan========================================== */
export async function queryCategory(params) {
  return request(`/api/getCategoryList?${stringify(params)}`);
}

export async function addCategory(params) {
  return request('/api/addCategory', {
    method: 'POST',
    data: params,
  });
}
export async function updateCategory(params) {
  return request('/api/updateCategory', {
    method: 'POST',
    data: params,
  });
}

export async function delCategory(params) {
  return request('/api/delCategory', {
    method: 'POST',
    data: params,
  });
}
/*= ====================分类管理end by ethan========================================== */

/* ----------时间线start by ethan------------------*/
export async function queryTimeAxis(params) {
  return request(`/api/getTimeAxisList?${stringify(params)}`);
}

export async function addTimeAxis(params) {
  return request('/api/addTimeAxis', {
    method: 'POST',
    data: params,
  });
}
export async function delTimeAxis(params) {
  return request('/api/delTimeAxis', {
    method: 'POST',
    data: params,
  });
}

export async function updateTimeAxis(params) {
  return request('/api/updateTimeAxis', {
    method: 'POST',
    data: params,
  });
}

export async function getTimeAxisDetail(params) {
  return request('/api/getTimeAxisDetail', {
    method: 'POST',
    data: params,
  });
}
/* ----------时间线end by ethan------------------*/
/* ---------------链接管理start by ethan---------------------------*/
export async function queryLink(params) {
  return request(`/api/getLinkList?${stringify(params)}`);
}

export async function addLink(params) {
  return request('/api/addLink', {
    method: 'POST',
    data: params,
  });
}
export async function updateLink(params) {
  return request('/api/updateLink', {
    method: 'POST',
    data: params,
  });
}
export async function delLink(params) {
  return request('/api/delLink', {
    method: 'POST',
    data: params,
  });
}
export async function getLinkDetail(params) {
  return request('/api/getLinkDetail', {
    method: 'POST',
    data: params,
  });
}
/* ---------------链接管理end by ethan------------------*/
/* ---------------用户管理start by ethan---------------------------*/
export async function queryUser(params) {
  return request(`/api/getUserList?${stringify(params)}`);
}

export async function addUser(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}
export async function updateUser(params) {
  return request('/api/updateUser', {
    method: 'POST',
    data: params,
  });
}

export async function delUser(params) {
  return request('/api/delUser', {
    method: 'POST',
    data: params,
  });
}
export async function getUserDetail(params) {
  return request('/api/getUserDetail', {
    method: 'POST',
    data: params,
  });
}
/* ---------------用户管理end by ethan---------------------------*/
