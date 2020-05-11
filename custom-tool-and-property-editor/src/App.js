import React, { Component } from 'react';
import './App.css';

import EmailEditor from 'react-email-editor'

class App extends Component {

  render() {
    return (
      <EmailEditor
        projectId={4251}
        appearance= {{
            theme: 'light',
            panels: {
              tools: {
                dock: 'right'
              }
            }
          }}
        options={{
          customCSS: [
            window.location.protocol + '//' + window.location.host + '/css/plugins/jquery-ui.css',
            window.location.protocol + '//' + window.location.host + '/css/plugins/bootstrap.min.css',
            'https://use.fontawesome.com/releases/v5.13.0/css/all.css',
            window.location.protocol + '//' + window.location.host + '/css/unlayer-custom.css',
          ],
          customJS: [
            window.location.protocol + '//' + window.location.host + '/js/plugins/jquery.js',
            window.location.protocol + '//' + window.location.host + '/js/plugins/jquery-ui.js',
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',
            window.location.protocol + '//' + window.location.host + '/js/widgets/product_new.js',
            window.location.protocol + '//' + window.location.host + '/js/widgets/footer.js',
          ]
        }}
      />
    );
  }
}

export default App;
