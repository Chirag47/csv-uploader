import { Button, Dialog } from 'element-react';
import SingleFilterItem from "./SingleFilterItem";
import React from 'react';

class Filter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showFilterDialog: false,
      filter: {}
    }
    this.toggleFilterDialog = this.toggleFilterDialog.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }
  toggleFilterDialog(){
    let visibility = this.state.showFilterDialog;
    this.setState({
      showFilterDialog: !visibility
    })
  }
  updateFilter(key,val){
    let filter = this.state.filter;
    if(val){
      filter[key] = val;
    } else {
      delete filter[key];
    }
    this.setState({filter})
  }
  applyFilter(){
    this.props.setFilter(this.state.filter);
    this.toggleFilterDialog();
  }
  render(){
    return (
      <div>
        <div className="filter-button">
          <Button type="primary" size="small" onClick={() => this.toggleFilterDialog()}>Filter</Button>
        </div>
        <div>
          <Dialog visible={this.state.showFilterDialog} onCancel={() => this.toggleFilterDialog()} title="Filter">
            <Dialog.Body>
              {this.props.columns && this.props.columns.map((col,index) => 
                <SingleFilterItem name={col.name} prop={col.prop} dataType={col.dataType} key={index} 
                  updateFilter={this.updateFilter.bind(this)}
                />
              )}
            </Dialog.Body>
            <Dialog.Footer className="dialog-footer">
            <Button onClick={() => this.toggleFilterDialog()}>Cancel</Button>
            <Button type="primary" onClick={() => this.applyFilter()}>Apply</Button>
          </Dialog.Footer>
          </Dialog>
        </div>
      </div>
    )
  }
}
export default Filter;