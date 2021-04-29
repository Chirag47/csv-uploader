import { Button, Dialog } from 'element-react';
import React from 'react';
import { connect } from 'react-redux';
import { resetData, uploadCSVFile } from '../../actions';
import './Menu.css';

class Menu extends React.Component {
  constructor(){
    super();
    this.state = {
      showUploadDialog: false,
      data: []
    }
    this.readFile = this.readFile.bind(this);
    this.getFileData = this.getFileData.bind(this);
    this.isCsvValid = this.isCsvValid.bind(this);
    this.resetData = this.resetData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.downloadSampleFile = this.downloadSampleFile.bind(this);
  }
  toggleDialogVisibility(){
    let visibility = this.state.showUploadDialog;
    this.setState({
      showUploadDialog: !visibility
    });
  }
  downloadSampleFile(){
    let csvHeaders = '';
    let csvKeys = Object.keys(this.props.csvHeadersObj)
    csvKeys.map((header,index) => {
      if(index !== csvKeys.length - 1){
        csvHeaders += `${header},`;
      } else {
        csvHeaders += `${header}`
      }
    })
    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvHeaders);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Sample.csv';
    hiddenElement.click();
  }
  async getFileData(event){
    return new Promise((resolve,reject) => {
      var file = event.target.files[0];
      if(file.name.split('.')[1] !== 'csv'){
        alert("CSV File not uploaded");
      } else {
        var reader = new FileReader();
        reader.onload = function(e) {
          resolve(e.target.result)
        };
        reader.onerror = (e) => {
          reject(e)
        }
        reader.readAsText(file);
      }
    })    
  }
  isCsvValid(keys){
    let notFound = keys.filter(key => this.props.csvHeadersObj[key] === null);
    return notFound.length > 0 ? false : true;
  }
  async readFile(){
    let event = window.event;
    let data = await this.getFileData(event);
    data = data.split('\n');
    let keys = data[0].split(',');
    if(this.isCsvValid(keys)){
      data = data.slice(1)
      data = data.map(str => {
        let obj = {};
        let values = str.split(',');
        for(let i=0;i<keys.length;i++){
          let key = this.props.csvHeadersObj[keys[i]];
          obj[key.prop] = values[i];
        }
        return obj;
      })
      this.setState({data})
    } else {
      event.target.value = "";
      alert('Invalid headers in the csv. Do not edit headers from the sample csv.')
    }
  }
  resetData(){
    this.props.resetData();
  }
  uploadFile(){
    this.props.uploadFile(
      this.state.data,
      this.props.columns,
      this.props.pageNo,
      this.props.pageSize,
      this.props.sortCriteria,
      this.props.filter
    );
    this.toggleDialogVisibility();
  }
  render(){
    return (
      <div>
        <div className="menu-group">
          <div className="menu-group-1">
            <Button type="primary" onClick={() => this.toggleDialogVisibility()}>Add/Upload</Button>
          </div>
          <div className="menu-group-2">
            <Button onClick={() => this.resetData()}>Reset</Button>
            <Button type="text" onClick={() => this.downloadSampleFile()}>Download Sample File</Button>
          </div>
        </div>
        <Dialog title="Upload CSV" lockScroll visible={this.state.showUploadDialog} onCancel={() => this.toggleDialogVisibility()} size="mini">
          <Dialog.Body>
            <input type="file" accept=".csv" id="csvInput" onChange={() => this.readFile()} placeholder="Add/Upload"></input>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={ ()=> {this.toggleDialogVisibility()} }>Cancel</Button>
            <Button type="primary" onClick={ ()=> this.uploadFile() }>Upload</Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    )
    }
}
const getCSVHeaderPropMap = columns => {
  let map = {};
  columns.map(header => {
    map[header.name] = header;    
  })
  return map;
}
const mapStateToProps = state => ({
  csvHeadersObj: getCSVHeaderPropMap(state.columns),
  columns: state.columns,
  pageNo: state.pageNo,
  pageSize: state.pageSize,
  filter: state.filter,
  sortCriteria: state.sortCriteria
})
const mapDispatchToProps = dispatch => ({
  uploadFile: (data,columns,pageNo,pageSize,sortCriteria,filter) => dispatch(uploadCSVFile(data,columns,pageNo,pageSize,sortCriteria,filter)),
  resetData: () => dispatch(resetData())
})
export default connect(mapStateToProps, mapDispatchToProps)(Menu);