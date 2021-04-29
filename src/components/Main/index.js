import React from 'react';
import { connect } from 'react-redux';
import { getRows, setFilter, setPageNumber, setPageSize, setSortCriteria } from '../../actions';
import Filter from '../Filter';
import Paginator from '../Paginator';
import MyTable from '../Table';
import './Main.css';

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      columns: [
        ...this.props.columns.map(col => {
          return {
            label: col.name,
            prop: col.prop,
            minWidth: 150,
            sortable: true
          }
        })
      ]
    }
    this.onPageChange = this.onPageChange.bind(this);
    this.onSizeChange = this.onSizeChange.bind(this);
    this.props.getRowData(this.props.pageNo,this.props.pageSize,this.props.sortCriteria,this.props.filter)
  }
  onSortChange({column, prop, order}){
    this.props.setSort(prop,order);
    this.props.getRowData(this.props.pageNo,this.props.pageSize,{column: prop, order},this.props.filter);
  }
  onSetFilter(filter){
    this.props.setFilter(filter);
    this.props.getRowData(this.props.pageNo,this.props.pageSize,this.props.sortCriteria,filter);
  }
  onPageChange(page){
    this.props.setPageNumber(page);
    this.props.getRowData(page,this.props.pageSize,this.props.sortCriteria,this.props.filter);
  }
  onSizeChange(size){
    this.props.setPageSize(size);
    this.props.getRowData(this.props.pageNo,size,this.props.sortCriteria,this.props.filter);
  }
  render(){
    return (
      <div>
        <div className="filter-row">
          <Paginator total={this.props.total} currentPage={this.props.pageNo} pageSize={this.props.pageSize}
            changePage={this.onPageChange} changeSize={this.onSizeChange} />
          <Filter setFilter={this.onSetFilter.bind(this)} columns={this.props.columns}/>
        </div>
        <div>
          <MyTable columns={this.state.columns} sortChange={this.onSortChange.bind(this)} data={this.props.rows} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  rows: state.rows,
  columns: state.columns,
  total: state.total,
  pageNo: state.pageNo,
  pageSize: state.pageSize,
  filter: state.filter,
  sortCriteria: state.sortCriteria
})
const mapDispatchToProps = dispatch => ({
  setSort: (col,order) => dispatch(setSortCriteria(col,order)),
  setFilter: filter => dispatch(setFilter(filter)),
  setPageNumber: number => dispatch(setPageNumber(number)),
  setPageSize: size => dispatch(setPageSize(size)),
  getRowData: (pageNo,pageSize,sortCriteria,filter) => dispatch(getRows(pageNo,pageSize,sortCriteria,filter))
})
export default connect(mapStateToProps, mapDispatchToProps)(Main);