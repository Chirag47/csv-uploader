import React from 'react';
import {Table} from 'element-react'

const MyTable = (props) => {
  
    return (
      <Table
        className="en-US"
        emptyText="No Data"
        style={{width: '100%'}}
        columns={props.columns}
        data={props.data}
        border={true}
        height={props.height}
        onSortChange={props.sortChange}
        highlightCurrentRow={true}
      />
    )
  
}

export default MyTable