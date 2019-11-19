import request from '@/utils/request'
import {
  baseUrl
} from '@/configs/global'

const baseParentUrl = 'databaseInfo'

export function getList() {
  return request({
    url: `${baseUrl}/${baseParentUrl}/getList`,
    method: 'get'
  })
}

export function addDatabaseInfo(data) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/addDatabaseInfo`,
    method: 'post',
    data
  })
}

export function updateDatabaseInfo(data) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/updateDatabaseInfo`,
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
    url: `${baseUrl}/${baseParentUrl}/deleteDatabaseInfoInBatch/${ids}`,
    method: 'post'
  })
}

export function deleteByIdSinglely(id) {
  return request({
    url: `${baseUrl}/${baseParentUrl}/deleteDatabaseInfo/${id}`,
    method: 'delete'
  })
}
