import './App.css';
import Menu from '../Menu';
import Main from '../Main';
import { connect } from 'react-redux';
import { Loading } from 'element-react';
function App(props) {
  return (
    <div className="App">
      <Loading loading={props.loading}>
        <header className="App-header">
            <Menu />
          </header>
          <Main />
      </Loading>
    </div>
  );
}
const mapStateToProps = state => ({
  loading: state.loading
})
export default connect(mapStateToProps)(App);
