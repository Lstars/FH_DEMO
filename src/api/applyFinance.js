import fetch from '@/utils/fetch';


// 创建账号
export function addAccountApi(params = {}) {
  return fetch({
    url: '/quanfangtong/account/addAccount',
    method: 'post',
    data: {
      params
    }

  });
}

// 新建房源
export function addHouseApi(params = {}) {
  return fetch({
    url: '/quanfangtong/house/resource/addHouse',
    method: 'post',
    data: {
      params
    }

  });
}

// 电子签章
export function otherInfoApi(params = {}) {
  return fetch({
    url: '/quanfangtong/account/otherInfo',
    method: 'post',
    data: {
      params
    }

  });
}
