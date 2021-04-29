import axios from 'axios';
import {actionType} from '../constants';
import {Notification} from 'element-react';
import config from "./config";
let actionId = 0;

export function setLoading(status){
  return {
    id: actionId++,
    type: actionType.SET_LOADING,
    status
  }
}
export function setTotal(total){
  return {
    id: actionId++,
    type: actionType.SET_TOTAL,
    total
  }
}
export function setRows(data){
  return {
    id: actionId++,
    type: actionType.SET_ROWS,
    data
  }
}
export function setPageNumber(number){
  return {
    id: actionId++,
    type: actionType.SET_PAGE_NUMBER,
    number
  }
}
export function setPageSize(pageSize){
  return {
    id: actionId++,
    type: actionType.SET_PAGE_SIZE,
    pageSize
  }
}
export function setSortCriteria(columnProp,order){
  return {
    id: actionId++,
    type: actionType.SET_SORT,
    columnProp,
    order
  }
}
export function setFilter(filter){
  return {
    id: actionId++,
    type: actionType.SET_FILTER,
    filter
  }
}
export function resetData(){
  return async function(dispatch){
    dispatch(setLoading(true));
    try {
      let resetResponse = await axios.post(config.BASEURL + '/reset');
      if(resetResponse.status === 200){
        dispatch(setRows([]));
        Notification({
          type: 'success',
          message: "Reset Successful",
          title: 'Success',
          duration: 3000
        })
      }
    } catch (error) {
      Notification({
        type: 'error',
        message: error.message,
        title: 'Error',
        duration: 3000
      })
    }
    dispatch(setLoading(false));
  }
}
export function uploadCSVFile(data,columns,pageNo,pageSize,sortCriteria,filter){
  return async function(dispatch){
    dispatch(setLoading(true));
    try {
      let uploadResponse = await axios.post(config.BASEURL + '/setRows', {
        data,
        columns: columns.map(column => {
          return {
            name: column.prop,
            dataType: column.dataType
          }
        })
      });
      if(uploadResponse.status === 200){
        Notification({
          type: 'success',
          message: "Upload Successful",
          title: 'Success',
          duration: 3000
        })
        dispatch(getRows(pageNo,pageSize,sortCriteria,filter))
      }
    } catch (error) {
      Notification({
        type: 'error',
        message: error.message,
        title: 'Error',
        duration: 3000
      })
    }
    dispatch(setLoading(false));
  }
}
export function getRows(pageNo,pageSize,sortCriteria,filter){
  return async function(dispatch){
    dispatch(setLoading(true));
    try {
      let rowsResponse = await axios.post(config.BASEURL + '/getRows',{
        pageNo,
        pageSize,
        sortCriteria,
        filter
      });
      if(rowsResponse.status === 200){
        dispatch(setRows(rowsResponse.data.data));
        dispatch(setTotal(rowsResponse.data.total));
      } else {
        throw {message: "Could Not fetch Data. Please Refresh"};
      }
    } catch (error) {
      Notification({
        type: 'error',
        message: error.message,
        title: 'Error',
        duration: 3000
      })
    }
    dispatch(setLoading(false));
  }

}