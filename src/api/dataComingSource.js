import request from '@/utils/request'
import {
  baseUrl
} from '@/configs/global'

const baseParentUrl = 'dataComingSource'

export function getList() {
  return request({
    url: `${baseUrl}/${baseParentUrl}/getList`,
    method: 'get'
  })
}

export function addDataComingSource(data) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/addDataComingSource`,
    method: 'post',
    data
  })
}
export function executeSql(data) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/executeSql`,
    method: 'post',
    data
  })
}

export function updateDataComingSource(data) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/updateDataComingSource`,
    method: 'post',
    data
  })
}

export function searchList(param) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/searchList`,
    method: 'get',
    params: {
      'searchContent': param
    }
  })
}

export function deleteInBatch(ids) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/deleteDataComingSourceInBatch/${ids}`,
    method: 'post'
  })
}

export function deleteByIdSinglely(id) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/deleteDataComingSource/${id}`,
    method: 'delete'
  })
}
