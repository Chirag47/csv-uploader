import { Pagination } from 'element-react';
import React from 'react';
import './Paginator.css';

const Paginator = props =>{
  return (
    <div className="my-paginator">
      <Pagination total={props.total} currentPage={props.currentPage} pageSize={props.pageSize}
        layout="prev, pager, next, total, sizes" pageSizes={[25,50,100,500]}
        onCurrentChange={(page) => props.changePage(page)} onSizeChange={(size) => props.changeSize(size)}
      />
    </div>
  )
}

export default Paginator;