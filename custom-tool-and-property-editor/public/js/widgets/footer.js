const prodUrl = 'https://bm-panel.targetbay.com'
// const prodUrl = 'http://127.0.0.1:3000'
let userId = 1
let jsonPath = `https://bmapi.targetbay.com/api/v1/tenant/${userId}/account`;

let
  billing_address,
  billing_address_line_2,
  billing_city,
  billing_state,
  billing_zip,
  billing_country,
  trial_ends_at
    = ''
function getUserAddress() {
  return $.ajax({
    url: jsonPath,
    dataType: "json",
  });
}

$.when(getUserAddress()).done(function (data) {
  let address_data = data.data;
  billing_address = address_data.billing_address + " " + address_data.billing_address_line_2
  billing_city = address_data.billing_city
  billing_state = address_data.billing_state
  billing_country = address_data.billing_country
  billing_zip = address_data.billing_zip
  trial_ends_at = address_data.trial_ends_at

  unlayer.registerTool({
    name: 'footer',
    label: 'Footer',
    icon: 'fa-align-left',
    supportedDisplayModes: ['web', 'email'],
    // transformer: function (values, source) {
    //   const { value, data } = source

    //   return Object.assign(values, newValues);
    // },
    options: {
      subcription: {
        title: "Subcription ",
        position: 1,
        options: {
          "subscription_note": {
            "widget": "subscription_note"
          },
          "manage_links": {
            "label": "Manage Subscription Link",
            "defaultValue": true,
            "widget": "toggle"
          },
          // "unsubscribe": {
          //   "label": "Unsubscribe",
          //   "defaultValue": true,
          //   "widget": "toggle"
          // },
          "subscription_unsub_note": {
            "widget": "subscription_unsub_note"
          },
          "subcription_align": {
            "label": "Align",
            "defaultValue": "left",
            "widget": "alignment"
          },
        }
      },
      address: {
        title: "Address ",
        position: 2,
        options: {
          "address_warn_msg": {
            "widget": "address_warn_msg"
          },
          "address_text": {
            "label": "Apartment, suite, etc. (optional)",
            "defaultValue": billing_address ? billing_address : "111, suite",
            "widget": "text"
          },
          "city": {
            "label": "City",
            "defaultValue": billing_city ? billing_city : "san franciso",
            "widget": "text"
          },
          "state": {
            "label": "State",
            "defaultValue": billing_state ? billing_state : "New york",
            "widget": "text"
          },
          "country": {
            "label": "Country/Region",
            "defaultValue": billing_country ? billing_country : "United States",
            "widget": "text"
          },
          "pincode": {
            "label": "Pincode",
            "defaultValue": billing_zip ? billing_zip : "100221",
            "widget": "text"
          },
          "address_size": {
            "label": "Font Size (in pixels)",
            "defaultValue": 12,
            "widget": "counter"
          },
          "address_line": {
            "label": "Line height",
            "defaultValue": 14,
            "widget": "counter"
          },
          "address_align": {
            "label": "Align",
            "defaultValue": "left",
            "widget": "alignment"
          },
        }
      },
      brand: {
        title: "Brand ",
        position: 2,
        divider: {
          enabled: false
        },
        options: {
          "brand_toggle": {
            "label": "Turn off branding",
            "defaultValue": true,
            "widget": "toggle"
          },
          "brand_logos": {
            "defaultValue": prodUrl + "/images/logos/baymail-grey.svg",
            "widget": "brand_logos"
          },
          "logo_align": {
            "label": "Align",
            "defaultValue": "left",
            "widget": "alignment"
          },
        }
      }
    },
    values: {
      "deletable": false,
    },
    renderer: {
      Viewer: unlayer.createViewer({
        render(values) {
          return renderFooterForm(values)
        }
      }),
      exporters: {
        web: function (values) {
          return renderFooterForm(values)
        },
        email: function (values) {
          return renderFooterForm(values)
        }
      }
    }
  });

  // Subscription note 
  unlayer.registerPropertyEditor({
    name: 'subscription_note',
    Widget: unlayer.createWidget({
      render() {
        return `
        <div><p style="color:#495057b8; font-size:0.9rem">Expelling these alternatives could influence your campaign performance 
        and GDPR compliance. <a href="">Learn More</a></p></div>
      `
      },
    }),
  });
  // Subscription unsubcribe note 
  unlayer.registerPropertyEditor({
    name: 'subscription_unsub_note',
    Widget: unlayer.createWidget({
      render() {
        return `
        <div id="unsub-note" class="alert alert-info display-flex" role="alert" style="
          height: 4rem;
          color: #2d2d2d;
          border-color: #c6fffc52;
          ">
            <i class="fas fa-info-circle fa-inverse fa-2x" style="
              display: block;
              vertical-align: middle;
              margin-top: 0.4rem;
              font-size: 1.6em;
              "></i>
            <p style="
              display: block;
              padding-left: 0.5rem;
              font-size: 0.9rem;
              ">
              You must include an unsubscribe link in your email campaigns. 
            </p>
        </div>
      `
      },
    }),
  });
  // Address warning Message
  unlayer.registerPropertyEditor({
    name: 'address_warn_msg',
    Widget: unlayer.createWidget({
      render(value, updateValue, data) {
        return `
      <div id="address-msg" class="alert alert-danger hide" role="alert" style="
          height: 4rem;
        ">
          <i class="fas fa-ban fa-inverse fa-2x" style="
            display: block;
            vertical-align: middle;
            margin-top: 0.4rem;
            font-size: 1.6em;
            color: #cd2323e0;
            "></i>
          <p style="
            display: block;
            padding-left: 0.5rem;
            font-size: 0.9rem;
            "> Looks like your campaign is missing a physical address, which is required by federal law.</p>
      </div>
      `
      },
    }),
  });

  // Brand logos 
  unlayer.registerPropertyEditor({
    name: 'brand_logos',
    Widget: unlayer.createWidget({
      render() {
        return `
        <div class="badge-dd-option" style="display: block; left: 347px; top: 178.5px;">
          <ul id="ulBadgeList" class="badges">
            <li name="badge" class="logo-list selected">
              <img 
                src="${prodUrl}/images/logos/baymail-grey.svg"
                alt="badge11">
            </li>
            <li name="badge" class="logo-list">
              <img 
                src="${prodUrl}/images/logos/baymail-black.svg"
                alt="badge9">
            </li>
            <li name="badge" class="logo-list">
              <img 
                src="${prodUrl}/images/logos/baymail-green.svg"
                alt="badge10">
            </li>
            <li name="badge" class="logo-list">
              <img 
                src="${prodUrl}/images/logos/baymail.svg"
                alt="badge12">
            </li>
          </ul>
        </div>
        <div class="footer-premium">
          <div id="dialog" title="Preminum Alert" class="dialog-search container" 
            <p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>
              You are not a premium subscriber. Please subscribe a plan to turn off Baymail branding.
            </p>
          </div>
        </div>
      `
      },
      mount(node, value, updateValue) {
        $(document).ready(function () {
          $('.logo-list').on('click', function (e) {
            let selectedLogo = $(this).find("img").attr("src");
            $(".selected").removeClass('selected')
            $(this).addClass('selected')
            updateValue(selectedLogo);
          });
          
        });
      }
    }),
  });
  function renderFooterForm(values) {
    let {
      address_text,
      brand_logos,
      logo_align,
      subcription_align,
      city,
      state,
      country,
      pincode,
      address_align,
      address_size,
      address_line,
      brand_toggle
    } = values
    let dialog = $("#dialog").dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        Cancel: function () {
          $(".dialog-search").dialog("close");
        }
      },
      close: function () {
        $(".dialog-search").dialog("close");
        // allFields.removeClass( "ui-state-error" );
      }
    });
    checkAddressInput(address_text)
    let current_date = new Date();
    let trial_date = new Date(trial_ends_at);
    console.log("dial",dialog)
    if (trial_date >= current_date) {
      console.log('offf');
      brand_toggle = brand_toggle
    } else {
      dialog.dialog("open");
      brand_toggle = true
    }
    console.log(brand_toggle);
    return `
  <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_footer" style="box-sizing: border-box; word-break: break-all; width: 100%">
    <tbody>
      <tr>
        <td name="tblCell" class="tblCell" style="padding:20px;" valign="top" align="left">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tbody>
              <tr>
                <td name="bmeBadgeText" style="text-align:${subcription_align}; word-break: break-word;" align="left">
                  <span id="spnFooterText" style="font-family: Arial, Helvetica, sans-serif; font-weight: normal; font-size: 11px; line-height: 140%;">
                    <var type="BME_CANSPAM" class="hidden">Copyright 2020, All rights reserved.
                      <span style="text-decoration:underline;"></span>
                    </var>
                    <br>
                    <div style="text-align:${address_align}; font-size:${address_size}px";>
                      <p style="line-height:${address_line}px">${address_text ? address_text : "Your address will appear here"}</p>
                      <p style="line-height:${address_line}px">${city}</p>
                      <p style="line-height:${address_line}px">${state}</p>
                      <p style="line-height:${address_line}px">${country}</p>
                      <p style="line-height:${address_line}px">${pincode}</p>
                    </div>
                  </span><br>
                  <div style="text-align:${subcription_align}; font-family: Arial, Helvetica, sans-serif; font-weight: normal; font-size: 11px; line-height: 140%;">
                    <var type="BME_LINKS">
                      <span href="#" style="display: none;">
                        <img src="https://www.benchmarkemail.com/images/verified.png" alt="Unsubscribe from all mailings" title="Unsubscribe from all mailings" border="0">
                      </span>
                      <span name="footerSubscribe"><a href="" style="text-decoration:underline;">Unsubscribe</a> | </span>
                      <span name="footerSubscribe" style="">Manage Subscription</span>
                      <span name="footerForward" style="display: none;"> | </span>
                      <span name="footerForward" style="text-decoration: underline; display: none;">Forward Email</span>
                      <span name="footerAbuse" style="display: none;"> | </span>
                      <span name="footerAbuse" style="text-decoration: underline; display: none;">Report Abuse</span>
                    </var><br>
                  </div>
                </td>
              </tr>
              <tr>
                <td name="bmeBadgeImage" style="text-align:${logo_align};padding-top:20px;" align="${logo_align}">
                  <var type="BME_BADGE">
                    <img src="${brand_logos}" style="width: 11rem;" border="0" name="bmeBadgeImage" alt="">
                  </var></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  `
  }
})
function checkAddressInput(address) {
  if (address.length > 0) {
    $("#address-msg").addClass("hide").removeClass("display-flex")
  } else {
    $("#address-msg").addClass("display-flex").removeClass("hide")
  }
}
function checkUserTrial() {

}
// function checkUnsubscribe(value) {
//   if(!value) {
//     $("#unsub-note").addClass("display-flex").removeClass("hide")
//   } else {
//     $("#unsub-note").addClass("hide").removeClass("display-flex")
//   }
// }
