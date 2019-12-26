import request from '@/utils/request';

export async function loginAdmin(params) {
  return request('/api/loginAdmin', {
    method: 'POST',
    data: params,
  });
}
