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

//查询订单
export function orderListApi(params = {}) {
  return fetch({
    url: '/quanfangtong/lease/order/list',
    method: 'post',
    data: {
      params
    }

  });
}

//查询交租计划
export function planListApi(params = {}) {
  return fetch({
    url: '/quanfangtong/lease/bill/plan/list',
    method: 'post',
    data: {
      params
    }

  });
}

//首笔确认
export function firstConfirmOrderApi(params = {}) {
  return fetch({
    url: '/quanfangtong/lease/order/firstConfirmOrder',
    method: 'post',
    data: {
      params
    }

  });
}

// 退房
export function fcheckOutApi(params = {}) {
  return fetch({
    url: '/quanfangtong/lease/order/checkOut',
    method: 'post',
    data: {
      params
    }

  });
}
// 查看合同
export function contractApi(params = {}) {
  return fetch({
    url: '/quanfangtong/lease/contract/list',
    method: 'post',
    data: {
      params
    }

  });
}
