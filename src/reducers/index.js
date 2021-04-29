import { combineReducers } from "redux";
import { actionType } from "../constants";

let loading = (state = false, action) => {
  if(action.type === actionType.SET_LOADING){
    return action.status;
  }
  return state;
}
let pageNo = (state = 1, action) => {
  if(action.type === actionType.SET_PAGE_NUMBER){
    return action.number;
  }
  return state;
}
let pageSize = (state = 25, action) => {
  if(action.type === actionType.SET_PAGE_SIZE){
    return action.pageSize;
  }
  return state;
}
let sortCriteria = (state = {}, action) => {
  if(action.type === actionType.SET_SORT){
    return Object.assign({},{column: action.columnProp, order: action.order});
  }
  return state;
}
let filter = (state = {}, action) => {
  if(action.type === actionType.SET_FILTER){
    return action.filter;
  }
  return state;
}
let total = (state = 0, action) => {
  if(action.type === actionType.SET_TOTAL){
    return action.total;
  }
  return state;
}
const columns = (state = [
    {
      name: "Name",
      prop: "name",
      dataType: "string"
    },{
      name: "Date of Birth",
      prop: "dob",
      dataType: "date"
    },{
      name: "Reporting Manager",
      prop: "manager",
      dataType: "string"
    },{
      name: "Department",
      prop: "department",
      dataType: "string"
    },{
      name: "Salary",
      prop: "salary",
      dataType: "number"
    }
  ], action) => {
  return state;
}
let rows = (state = [],action) => {
  if(action.type === actionType.SET_ROWS){
    return action.data;
  }
  return state;
}
export default combineReducers({
  loading,
  rows,
  columns,
  pageNo,
  pageSize,
  sortCriteria,
  filter,
  total
});