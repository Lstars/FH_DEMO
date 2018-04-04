import fetch from '@/utils/fetch';

/* 获取开门记录 */
export function getDoorControlRecord(params = {}) {
  return fetch({
    url: '/queryDeviceLogsByBEnd/',
    method: 'post',
    data: {
      method: 'post',
      params: params
    }
  });
}
