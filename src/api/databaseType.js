import request from '@/utils/request'
import {
  baseUrl
} from '@/configs/global'

const baseParentUrl = 'databaseType'

export function getList() {
  return request({
    url: `${baseUrl}/${baseParentUrl}/getList`,
    method: 'get'
  })
}

export function addDatabaseType(data) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/addDatabaseType`,
    method: 'post',
    data
  })
}

export function updateDatabaseType(data) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/updateDatabaseType`,
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
    url: `${baseUrl}/${baseParentUrl}/deleteDatabaseTypeInBatch/${ids}`,
    method: 'post'
  })
}

export function deleteByIdSinglely(id) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/deleteDatabaseType/${id}`,
    method: 'delete'
  })
}
