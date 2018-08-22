// Import react
import React from 'react';
import ReactDOM from 'react-dom';

// Import material-ui classes
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import ToolbarTitle from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const Util = (() => {
  const makeRes = () => {
    let res = {};
    const setRes = (prop, obj) => {
      res[prop] = obj;
    }
    const getRes = () => res;

    return {
      setRes,
      getRes
    };
  };

  const FlatRes = makeRes();

  const walker = (item, prop) => {
    console.log('prop: ',prop);
    console.log('item: ',item);
    if (Object(item) !== item) {
      FlatRes.setRes(prop, item);
    } else if (Array.isArray(item)) {
      let len = item.length, i;
      console.log('valor de len: ', len);
      if (len === 0) {
        FlatRes.setRes(prop, []);
      } else {
        for(i = 0; i < len; i++) {
          walker(item[i], prop + "_" + i);
        }
      }
    } else {
      for (var p in item) {
        console.log('Valor de p1: ',p);
        walker(item[p], prop ? prop + "_" + p : p);
        console.log('item: ',item);
      }
    }
  };

  const handleUnquoted = hash => {
    let str = hash.replace(/(['"])?([a-zA-Z0-9_.]+)(['"])?:/g, '"$2":').replace(/\s/g, "").replace(/'/g, '"');
    return JSON.parse(str);
  }

  const flatten = (obj) => {
    console.log('que es esto?: ',obj);
    let _obj = handleUnquoted(obj);
    walker(_obj, "");
    console.log('es el JSON: ',_obj)
    return FlatRes.getRes();
  };

  const unflatten = (data) => {
    let _data = handleUnquoted(data);
    if (Object(_data) !== _data || Array.isArray(_data)) {
      return _data;
    }
    let result = {}, obj, prop, parts, idx;

    for(let p in _data) {
        obj = result;
        prop = "";
        parts = p.split(".");
        let len = parts.length, i;
        for(i = 0; i < len; i++) {
          idx = !isNaN(parseInt(parts[i], 10));
          obj = obj[prop] || (obj[prop] = (idx ? [] : {}));
          prop = parts[i];
        }
        obj[prop] = _data[p];
    }
    return result[""];
  };

  return {
    flatten,
    unflatten
  };
})();

const PaperHeader = (props) => {
  return (
      <ToolbarTitle className="mui--toolbar-title__fix">{props.title}</ToolbarTitle>
  );
};

PaperHeader.propTypes = {
  title: 'React.PropTypes.string'
};

const Result = (props) => {
  const style = {
    borderRadius: 2,
    padding: 20,
    backgroundColor: "#EEE",
    fontFamily: "'Fira Mono', monospace"
  };

  return (
    <pre style={style}>
      {props.result}
    </pre>
  );
}

const AppStructure = (props) => {
  const styles = {
    root: {
      backgroundColor: '#FFF',
      marginBottom: 32,
      padding: 40
    },
    paperBlock: {
      padding: '0 20px 20px'
    },
    button: {
      margin: 12
    },
    textField: {
      fontFamily: "'Fira Mono', monospace"
    }
  };

  return (
    <div className="container">
      <AppBar
        title=""
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <div style={styles.root}>
        <Paper>
          <PaperHeader title="Object Flatten/Unflatten"/>
          <div style={styles.paperBlock}>
            <h2>Ingresa tu codigo en esta parte</h2>
            <TextField
              style={styles.textField}
              hintText="Paste the JavaScript object here"
              floatingLabelText="JavaScript Object"
              multiLine
              fullWidth
              rows={5}
              onChange={props.update}
            />
            <RaisedButton
              label="Flatten"
              className="mui--button__fix"
              style={styles.button}
              onClick={() => props.handleClick('flatten')}
              primary
            />
            <RaisedButton
              label="Unflatten"
              className="mui--button__fix"
              style={styles.button}
              onClick={() => props.handleClick('unflatten')}
              primary
            />
            <h2>Result</h2>
            <Result result={props.result}/>
          </div>
        </Paper>
      </div>
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      result: ""
    };
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };

  update(e) {
    this.setState({code: e.target.value});
 };

  handleClick(op) {
    let res = JSON.stringify(Util[op](this.state.code), null, 4);
    console.log('quee es?: ',this.state.code);
    console.log('op', op);
    console.log('hola: ',res);

    this.setState({result: res});
    let str = res.replace(/(['"])?([a-zA-Z0-9_.]+)(['"])?:/g, '"$2":').replace(/\s/g, "").replace(/'/g, '"');
    const va = JSON.parse(str);
    console.log('JSON aplanado: ',va); // es importante por esta parte aqui ya lo hizo en un JSON
  };


  render() {
    const result = this.state.result;
    return (
      <div className="container">
          <MuiThemeProvider >
            <AppStructure update={this.update} result={result} handleClick={this.handleClick}/>
          </MuiThemeProvider>
      </div>
    )
  };
};
export default App
