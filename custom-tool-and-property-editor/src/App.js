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
          user: {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@acme.com'
          },
          mergeTags: {
            first_name: {
              name: "First Name",
              value: "*|first_name|*"
            },
            last_name: {
              name: "Last Name",
              value: "*|last_name|*"
            },
            full_name: {
              name: "Full Name",
              value: "*|full_name|*"
            },
            email: {
              name: "Email",
              value: "*|email_address|*"
            },
            address: {
              name: "Address",
              mergeTags: {
                street_1: {
                  name: "Street 1",
                  value: "*|address.address_1|*"
                },
                street_2: {
                  name: "Street 2",
                  value: "*|address.address_2|*"
                },
                city: {
                  name: "City",
                  value: "*|address.city|*"
                },
                state: {
                  name: "State",
                  value: "*|address.state|*"
                },
                zip: {
                  name: "Zip",
                  value: "*|address.zip|*"
                }
              }
            },
            view_in_browser: {
              name: "View in browser",
              value: "*|view_in_browser|*"
            },
            unsub_link: {
              name: "Unsubscription Link",
              value: "*|unsub_link|*"
            }
          },
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
            window.location.protocol + '//' + window.location.host + '/js/widgets/product.js',
            window.location.protocol + '//' + window.location.host + '/js/widgets/dialog.js',
            window.location.protocol + '//' + window.location.host + '/js/widgets/footer.js',
          ]
        }}
      />
    );
  }
}

export default App;
