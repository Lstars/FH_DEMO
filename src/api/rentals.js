import fetch from '@/utils/fetch';

// 查询房态
export function houseStateApi(params = {}) {
  return fetch({
    url: '/quanfangtong/house/resource/houseState',
    method: 'post',
    data: {
      params
    }

  });
}

// 创建订单
export function createOrderApi(params = {}) {
  return fetch({
    url: '/quanfangtong/lease/order/createOrder',
    method: 'post',
    data: {
      params
    }

  });
}
