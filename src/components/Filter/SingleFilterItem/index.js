import { DatePicker, Input, InputNumber, Select } from 'element-react';
import React from 'react';
import "./SingleFilter.css";

class SingleFilterItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: "",
      numberValue: 0,
      options: [],
      dateValue: new Date()
    }
  }
  async onSearch(query) {
    if (query !== '') {
      this.setState({
        loading: true
      });
  
      setTimeout(() => {
        this.setState({
          loading: false,
          options: this.state.states.map(item => {
            return { value: item, label: item };
          }).filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          })
        });
      }, 200);
    } else {
      this.setState({
        options: []
      });
    }
  }
  onChange(key,val){
    this.setState({[key]: val});
    this.props.updateFilter(this.props.prop,val);
  }
  render(){
    let filterDiv;
    if(this.props.dataType === "string"){
      filterDiv = (
        <Input placeholder="Please input" value={this.state.value} onChange={this.onChange.bind(this,'value')} className="filter-input" />
        // <Select value={this.state.value} filterable={true} remote={true} remoteMethod={this.onSearch.bind(this)} loading={this.state.loading}>
        //   {
        //     this.state.options.map(el => {
        //       return <Select.Option key={el.value} label={el.label} value={el.value} />
        //     })
        //   }
        // </Select>
      )
    } else if(this.props.dataType === "date"){
      filterDiv = (
        <DatePicker
          value={this.state.dateValue}
          placeholder="Pick a date"
          onChange={this.onChange.bind(this,'dateValue')}
        />
      )
    } else {
      filterDiv = (<InputNumber defaultValue={this.state.numberValue} onChange={this.onChange.bind(this,'numberValue')} min="0" ></InputNumber>)
    }
    return (
      <div className="single-filter-item">
        <span>{this.props.name}</span> {filterDiv}
      </div>
    )
  }
}

export default SingleFilterItem;