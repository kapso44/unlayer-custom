$(document).ready(function () {
  const prodUrl = "http://targetbay-dev-alb-855413330.us-west-2.elb.amazonaws.com";
  // const prodUrl = 'http://127.0.0.1:3000' 
  // storeId = 'd2805f6b0c56'
  let getTenantApi = `http://127.0.0.1:8000/api/v1/tenant`;
  let storeId = localStorage.getItem('storeId');
  let token = localStorage.getItem('authorization');
  let brandLogos = {
    'brand_1': '/images/logos/baymail.svg',
    'brand_2': '/images/logos/baymail-black.svg',
    'brand_3': '/images/logos/baymail-green.svg',
    'brand_4': '/images/logos/baymail-grey.svg'
  }

  let
    billing_address,
    billing_city,
    billing_state,
    billing_zip,
    billing_country,
    trial_ends_at
      = ''

  function getUserAddress() {
    return $.ajax({
      url: getTenantApi,
      dataType: "json",
      headers: {
        "authorization": 'eyJraWQiOiJNZlRiWkFVeEc2UTM1dkM4STVMMzU2aXlrNitjZGlWdkpyUUN5elh4SktjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMzlmNWFjOC1jY2ZlLTRkYjUtOGM0Yi1lNzVhNDRlYzQzMzQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfT2NpMk9RSndnIiwiY29nbml0bzp1c2VybmFtZSI6ImYzOWY1YWM4LWNjZmUtNGRiNS04YzRiLWU3NWE0NGVjNDMzNCIsImF1ZCI6IjZsYmtlaDE3anRyMnM4OTE1NXFoZDE5Y3FxIiwiZXZlbnRfaWQiOiJmMzMzZTQxNi1hYzU5LTRlNTctOWYzNy01MGEwZDIxY2QyYzkiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU5ODI2NTM5NiwibmFtZSI6IkthcGlsIiwiZXhwIjoxNTk4MjY5MDAwLCJpYXQiOjE1OTgyNjU0MDAsImZhbWlseV9uYW1lIjoiU2hhcm1hIiwiZW1haWwiOiJrYXBpbCszNUB0YXJnZXRiYXkuY29tIn0.Th-VWpTmh5LwQYTNoEMAATMIx6Ss82fO6-wuUH2h5rV3nVTXjYGh3nJckihEtnaWjqCpStxaUoo52_nNKP4EG4iR3_jfy5JMzob29Hpk1t5p7ktucMY5u7zaSSkpbu4DaGoUo6cd1YphgTykyKK0hEZIseiZVm7Y1WASFwqYz9xPUPa0u7SXnrZMQ2jQvuiNhmHrr1jBZy7ukuTRDSBZR7QYl9z2nbys27CcP3mldwMLHJAj2OSc8O5BZ-UBNeA-Mbz1k3RhWoabNSemOYwTH65BG4uY-L2uEm7VswQ3lf8BG8rJyHkn6JddLfn6QyxZjPtlCSgDAhil5PSD6yqLjA',
        "store-id": 'faa62d68144e'
      }
    });
  }

  $.when(getUserAddress()).done(function (response) {
    const { data } = response;
    const brand = data.settings?.brand;

    billing_address = (data?.billing_address ? data?.billing_address : "") + (data?.billing_address_line_2 ? + ", " + data?.billing_address_line_2 : "")
    billing_city = data?.billing_city
    billing_state = data?.billing_state
    billing_country = data?.billing_country
    billing_zip = data?.billing_zip
    trial_ends_at = data?.trial_ends_at

    let current_date = new Date();
    let trial_date = new Date(trial_ends_at);

    unlayer.registerTool({
      name: 'footer',
      label: 'Footer',
      icon: 'fa-align-left',
      supportedDisplayModes: ['web', 'email'],
      transformer: function (values, source) {
        const { name, value, data } = source

        let dialog = $("#footer-dialog").dialog({
          resizable: false,
          autoOpen: false,
          height: "auto",
          width: 400,
          modal: true,
          buttons: {
            Cancel: function () {
              $("#footer-dialog").dialog("close");
            }
          }
        });

        if (trial_date < current_date && name == "brand_toggle" && value === false) {
          values.brand_toggle = true
          dialog.dialog("open");
        }
        return Object.assign(values);
      },
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
              "label": "Apartment, suite, etc.",
              "defaultValue": billing_address ? billing_address : "",
              "widget": "text"
            },
            "city": {
              "label": "City",
              "defaultValue": billing_city ? billing_city : "",
              "widget": "text"
            },
            "state": {
              "label": "State",
              "defaultValue": billing_state ? billing_state : "",
              "widget": "text"
            },
            "country": {
              "label": "Country/Region",
              "defaultValue": billing_country ? billing_country : "",
              "widget": "text"
            },
            "pincode": {
              "label": "Pincode",
              "defaultValue": billing_zip ? billing_zip : "",
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
              "defaultValue": brand?.is_brand_selected ?? true,
              "widget": "toggle"
            },
            "brand_logos": {
              "defaultValue": prodUrl + brandLogos[brand?.selected_brand ?? 'brand_1'],
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
              <li name="badge" class="logo-list">
                <img 
                  src="${prodUrl + brandLogos['brand_4']}"
                  alt="badge11">
              </li>
              <li name="badge" class="logo-list">
                <img 
                  src="${prodUrl + brandLogos['brand_2']}"
                  alt="badge9">
              </li>
              <li name="badge" class="logo-list">
                <img 
                  src="${prodUrl + brandLogos['brand_3']}"
                  alt="badge10">
              </li>
              <li name="badge" class="logo-list">
                <img 
                  src="${prodUrl + brandLogos['brand_1']}"
                  alt="badge12">
              </li>
            </ul>
          </div>
          <div class="footer-premium">
            <div id="footer-dialog" title="Premium Alert" class="dialog-search container" style='display:none'><br>
              <p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>
              Please subscribe a plan to turn off Baymail branding.
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
      checkAddressInput(address_text, city, state, country, pincode)

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
                        <p style="line-height:${address_line}px">
                          ${address_text ? address_text + ", " : ""}
                          ${city ? city + ", " : ""}
                          ${state ? state + ", " : ""}
                          ${country ? country + ", " : ""}
                          ${pincode ? pincode : ""}.
                        </p>
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
                ${brand_toggle ? `
                <tr>
                  <td name="bmeBadgeImage" style="text-align:${logo_align};padding-top:20px;" align="${logo_align}">
                    <var type="BME_BADGE">
                      <img src="${brand_logos}" style="width: 11rem;" border="0" name="bmeBadgeImage" alt="">
                    </var></td>
                </tr>`
          : ''}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    `
    }
  })
  function checkAddressInput(a1, a2, a3, a4, a5) {
    a1 = a1?.trim();
    a2 = a2?.trim();
    a3 = a3?.trim();
    a4 = a4?.trim();
    a5 = a5?.trim();
    if (a1?.length > 0 && a2?.length > 0 && a3?.length > 0 && a4?.length > 0 && a5?.length > 0) {
      $("#address-msg").addClass("hide").removeClass("display-flex")
    } else {
      $("#address-msg").addClass("display-flex").removeClass("hide")
    }
  }
  // function checkUnsubscribe(value) {
  //   if(!value) {
  //     $("#unsub-note").addClass("display-flex").removeClass("hide")
  //   } else {
  //     $("#unsub-note").addClass("hide").removeClass("display-flex")
  //   }
  // }
})