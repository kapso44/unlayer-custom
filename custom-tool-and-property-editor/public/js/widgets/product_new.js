var uniqueId = '';
var productId = 0;
unlayer.registerPropertyEditor({
    name: 'add_products',
    layout: 'bottom',
    Widget: unlayer.createWidget({
        render(value) {
            uniqueId = generateId();
            return `
            <div id="product-search" class="container col-12">
              <div class="row">
                <div class="col-sm-8 col-8">
                  <h6 style='margin-top: 10px;'>Add product from store</h6>
                </div>
                <div class="col-sm-4 col-4">
                  <button type='button' id="add-product" class='btn btn-primary'>Add Product</button>
                </div>
              </div>
            </div>
            <div class="product-modal">
            <div id="dialog" title="Add Product" class="dialog-search container" 
              style='overflow-x: hidden;'>
              <div class="row">
                <div class="col-8">
                  <label> Search Product </label>
                  <input type="text" name="search" id="search-${uniqueId}" 
                  placeholder=" Search by name or ID, case sensitive" class="form-control" />
                </div>
                <div  class="dropdown col-4">
                  <label> Collections </label>
                  <select class="form-control" id="filter" name="filter">
                  <option value="all">All</option>
                  <option value="col1">Collection1</option>
                  <option value="col2">Collection2</option>
                </select>
                </div>
              </div>
              <br>  
              <div class="row">
                <div class="col-12">
                  <ul class="list-group" id="result-${uniqueId}"></ul>
                </div>
              </div>
            </div>
            </div>
          `
        },
        mount(node, value, updateValue) {
            $(document).ready(function () {
                $('#product-name-' + uniqueId).keyup(function (value) {
                    $(".card-title-" + uniqueId).text($(this).val())
                });
                var jsonPath = 'https://reqres.in/api/users';

                $.ajaxSetup({ cache: false });

                $('#search-' + uniqueId).keyup(function () {
                    event.preventDefault();
                    $('#result-' + uniqueId).html('');
                    var searchField = $('#search-' + uniqueId).val();
                    var expression = new RegExp(searchField, "i");

                    $.getJSON(jsonPath, function (data) {
                        $.each(data.data, function (key, value) {
                            if (value.first_name.search(expression) != -1 || value.last_name.search(expression) != -1
                                // || value.id.search(expression) != -1
                                // || value.location.search(expression) != -1
                            ) {
                                $('#result-' + uniqueId).append('' +
                                    '<li class="link-class list-group-item d-flex justify-content-between align-items-center"' +
                                    '>' +
                                    '<div class="image-parent image-src col-4" data-image="' + value.avatar + '">' +
                                    '<img src="' + value.avatar + '" height="100" width="100" class="img-thumbnail" /> ' +
                                    '</div>' +
                                    '<div class="details col-8">' +
                                    '<span class="name" data-name="' + value.first_name + '"><b>Product Name:</b> ' + value.first_name + '</span><br>' +
                                    '<span class="id" data-id="' + value.id + '"><b>Item Id: </b>' + value.id + '</span>' +
                                    '<span class="url hide-details" data-url="' + value.avatar + '"></span>' +
                                    '<span class="actual-price hide-details" data-actual-price="' + value.last_name + '"></span>' +
                                    '<span class="compare-price hide-details" data-compare-price="' + value.id + '"></span>' +
                                    '</div>' +
                                    '</li>'
                                );
                            }
                        });
                    });
                });

                $('#result-' + uniqueId).on('click', 'li', function () {
                    $(".dialog-search").dialog("close");
                    var name = $(this).find(".name").data('name');
                    var image = $(this).find(".img-thumbnail").attr('src');
                    var url = $(this).find(".url").data('url');
                    var actualPrice = $(this).find(".actual-price").data('actual-price');
                    var comparePrice = $(this).find(".compare-price").data('compare-price');
                    var id = $(this).find(".id").data('id');
                    productId = $(this).find(".id").data('id');

                    updateValue({
                        "name": name,
                        "url": url,
                        "image": image,
                        "actual_price": actualPrice,
                        "compare_price": comparePrice,
                        "id": id
                    }, {
                        "name": name,
                        "url": url,
                        "image": image,
                        "actual_price": actualPrice,
                        "compare_price": comparePrice,
                        "id": id
                    });
                });
            });
            $(function () {
                var dialog = $("#dialog").dialog({
                    autoOpen: false,
                    height: 400,
                    width: 500,
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

                $("#add-product").button().on("click", function () {
                    $('#search-' + uniqueId).keyup();
                    $("#dialog").dialog("option", "width", 600);
                    $("#dialog").dialog("option", "left", 470);
                    dialog.dialog("open");
                });
            });
        }
    })
});

let productData = {}
unlayer.registerTool({
    type: 'products',
    category: 'contents',
    label: 'Products',
    icon: 'fa-tag',
    values: {
    },
    transformer: function (values, source) {
        const { value, data } = source
        let newValues = { "image": {} }
        newValues.name = data.name ? data.name : values.name
        newValues.image.url = data.image ? data.image : values.image.url
        newValues.url = data.url ? data.url : values.url
        newValues.actual_price = data.actual_price ? data.actual_price : values.actual_price
        newValues.compare_price = data.compare_price ? data.compare_price : values.compare_price
        newValues.id = data.id

        return Object.assign(values, newValues);
    },
    options: {
        default: {
            title: "Product",
            options: {
                "background_color": {
                    "label": "Background",
                    "defaultValue": '#ffffff',
                    "widget": "color_picker"
                },
                "background_toggle": {
                    "label": "Add Background",
                    "defaultValue": true,
                    "widget": "toggle"
                },
            }
        },
        product: {
            title: "Product Content",
            position: 1,
            options: {
                "add_products": {
                    "label": "Add Products",
                    "defaultValue": "Search Products",
                    "widget": "add_products"
                },
                "name": {
                    "label": "Product Name",
                    "defaultValue": "Product 1",
                    "widget": "text",
                },
                "actual_price": {
                    "label": "Product Price",
                    "defaultValue": "$0",
                    "widget": "text"
                },
                "compare_price": {
                    "label": "Compare At Price",
                    "defaultValue": "$0",
                    "widget": "text"
                },
                "button": {
                    "label": "Button Name",
                    "defaultValue": "Buy Now",
                    "widget": "text"
                },
                "url": {
                    "label": "Product Url",
                    "defaultValue": {
                        url: "http://google.com",
                        target: "_blank"
                    },
                    "widget": "link"
                },
            },
        },
        name_attributes: {
            title: "Name Attributes",
            position: 2,
            collapse: false,
            options: {
                "name_font": {
                    "label": "Font",
                    "defaultValue": {
                        label: 'Arial',
                        value: 'arial,helvetica,sans-serif'
                      },
                    "widget": "font_family"
                },
                "name_color": {
                    "label": "Color",
                    "defaultValue": '#000000',
                    "widget": "color_picker"
                },
                "name_align": {
                    "label": "Align",
                    "defaultValue": 'center',
                    "widget": "alignment"
                },
                "name_font_size": {
                    "label": "Font Size (in pixels)",
                    "defaultValue": '25',
                    "widget": "counter"
                },
                "name_line_height": {
                    "label": "Line Height",
                    "defaultValue": '10',
                    "widget": "counter"
                },
            }
        },
        actual_price_attributes: {
            title: "Actual Price Attributes",
            position: 3,
            options: {
                "actual_font": {
                    "label": "Font",
                    "defaultValue": {
                        label: 'Arial',
                        value: 'arial,helvetica,sans-serif'
                      },
                    "widget": "font_family"
                },
                "actual_color": {
                    "label": "Color",
                    "defaultValue": '#444444',
                    "widget": "color_picker"
                },
                "actual_align": {
                    "label": "Align",
                    "defaultValue": 'center',
                    "widget": "alignment"
                },
                "actual_font_size": {
                    "label": "Font Size (in pixels)",
                    "defaultValue": '20',
                    "widget": "counter"
                },
                "actual_line_height": {
                    "label": "Line Height",
                    "defaultValue": '10',
                    "widget": "counter"
                },
            }
        },
        compare_price_attributes: {
            title: "Compare Price Attributes",
            position: 4,
            options: {
                "compare_font": {
                    "label": "Font",
                    "defaultValue": {
                        label: 'Arial',
                        value: 'arial,helvetica,sans-serif'
                      },
                    "widget": "font_family"
                },
                "compare_color": {
                    "label": "Color",
                    "defaultValue": '#000000',
                    "widget": "color_picker"
                },
                "compare_align": {
                    "label": "Align",
                    "defaultValue": 'center',
                    "widget": "alignment"
                },
                "compare_font_size": {
                    "label": "Font Size (in pixels)",
                    "defaultValue": '20',
                    "widget": "counter"
                },
                "compare_line_height": {
                    "label": "Line Height",
                    "defaultValue": '10',
                    "widget": "counter"
                },
            }
        },
        image_attributes: {
            title: "Product Image Attributes",
            position: 5,
            options: {
                "image": {
                    "label": "Product Image",
                    "defaultValue": {
                        url: "http://placehold.it/250x150/78c5d6/fff/"
                    },
                    "widget": "image"
                },
                "img_width": {
                    "label": "Image Width",
                    "defaultValue": 100,
                    "widget": "counter"
                },
                "img_height": {
                    "label": "Image Height",
                    "defaultValue": 150,
                    "widget": "counter"
                }
            }
        },
        button_attributes: {
            title: "Button Attributes",
            position: 6,
            options: {
                "button_font": {
                    "label": "Font",
                    "defaultValue": {
                        label: 'Arial',
                        value: 'arial,helvetica,sans-serif'
                      },
                    "widget": "font_family"
                },
                "button_text_color": {
                    "label": "Text Color",
                    "defaultValue": '#000000',
                    "widget": "color_picker"
                },
                "button_font_size": {
                    "label": "Font Size (in pixels)",
                    "defaultValue": '20',
                    "widget": "counter"
                },
                "button_align": {
                    "label": "Align",
                    "defaultValue": 'center',
                    "widget": "alignment"
                },
                "button_color": {
                    "label": "Button Color",
                    "defaultValue": '#3aaee0',
                    "widget": "color_picker"
                },
                "button_radius": {
                    "label": "Button Radius",
                    "defaultValue": '5',
                    "widget": "counter"
                },
            }
        },
        // color: {
        //     title: "Colors",
        //     position: 7,
        //     options: {
        //         "color": {
        //             "label": "Text",
        //             "defaultValue": '#000000',
        //             "widget": "color_picker"
        //         },
        //         "background_color": {
        //             "label": "Background",
        //             "defaultValue": '#ffffff',
        //             "widget": "color_picker"
        //         },
        //     }    
        // },
        // spacing: {
        //     title: "Spacing",
        //     position: 8,
        //     options: {
        //         "alignment": {
        //             "label": "Alignments",
        //             "defaultValue": 'center',
        //             "widget": "alignment"
        //         },
        //         "line_height": {
        //             "label": "Line Height",
        //             "defaultValue": '10',
        //             "widget": "counter"
        //         },
        //         "border": {
        //             "label": " Border",
        //             "defaultValue": {
        //                 borderTopWidth: "0px",
        //                 borderTopStyle: "solid",
        //                 borderTopColor: "#CCC",
        //                 borderLeftWidth: "0px",
        //                 borderLeftStyle: "solid",
        //                 borderLeftColor: "#CCC",
        //                 borderRightWidth: "0px",
        //                 borderRightStyle: "solid",
        //                 borderRightColor: "#CCC",
        //                 borderBottomWidth: "0px",
        //                 borderBottomStyle: "solid",
        //                 borderBottomColor: "#CCC"
        //             },
        //             "widget": "border"
        //         },
        //         "rounded_border": {
        //             "label": "Rounded Border",
        //             "defaultValue": '0',
        //             "widget": "counter"
        //         },
        //         "padding": {
        //             "label": "Padding (all sides)",
        //             "defaultValue": '0',
        //             "widget": "counter"
        //         },
        //     }    
        // }
    },
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                return renderProductTool(values)
            }
        }),
        exporters: {
            web: function (values) {
                return renderProductTool(values)
            },
            email: function (values) {
                return renderProductTool(values)
            }
        },
    }
});

function renderProductTool(values) {
    // border-top-style: ${borderTopStyle}; border-top-width: ${borderTopWidth}; border-top-color: ${borderTopColor};
    // border-right-style: ${borderRightStyle}; border-right-width: ${borderRightWidth}; border-right-color: ${borderRightColor};
    // border-bottom-style: ${borderBottomStyle}; border-bottom-width: ${borderBottomWidth}; border-bottom-color: ${borderBottomColor};
    // border-left-style: ${borderLeftStyle}; border-left-width: ${borderLeftWidth}; border-left-color: ${borderLeftColor};
    let { 
        image,
        background_toggle,
        background_color,
        name,
        name_font,
        name_color, 
        name_align,
        name_line_height,
        name_font_size,
        actual_font,
        actual_price,
        actual_color,
        actual_align,
        actual_line_height,
        actual_font_size,
        compare_font,
        compare_price,
        compare_color,
        compare_align,
        compare_line_height,
        compare_font_size,
        img_height,
        img_width,
        url,
        button,
        button_font,
        button_align,
        button_color,
        button_text_color,
        button_font_size,
        button_radius,
    } = values

    return `
    <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%" cellpadding="0" cellspacing="0">
  <tbody>
    <tr style="vertical-align: top">
      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        <!--[if (mso)|(IE)]>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="background-color: #e7e7e7;">
              <![endif]-->
              <div class="email-row-container" style="padding: 0px;background-color: transparent">
                <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="email-row">
                  <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 0px;background-color: transparent;" align="center">
                          <table cellpadding="0" cellspacing="0" border="0" style="width:500px;">
                            <tr style="background-color: transparent;">
                              <![endif]-->
                              <!--[if (mso)|(IE)]>
                              <td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top">
                                <![endif]-->
                                <div class="email-col email-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                                  <div style="width: 100% !important;">
                                    <!--[if (!mso)&(!IE)]><!-->
                                    <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                      <!--<![endif]-->
                                      <table id="u_content_image_1" class="u_content_image" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                  <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                                    <img align="center" border="0" src="https://unroll-images-production.s3.amazonaws.com/projects/4251/1589964645932-200.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 30%;max-width: 200.02px;"
                                                      width="200.02" />
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table id="u_content_text_1" class="u_content_text" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                              <div style="color: #000000; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="font-size: 14px; line-height: 140%; text-align: center;"><span style="font-size: 16px; line-height: 22.4px;"><strong><span style="line-height: 22.4px; font-size: 16px;">Product Title</span></strong>
                                                  </span>
                                                </p>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table id="u_content_text_2" class="u_content_text" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                              <div style="color: #000000; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="text-align: center; font-size: 14px; line-height: 140%;"><span style="font-size: 14px; line-height: 19.6px;">$0.00</span></p>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table id="u_content_text_3" class="u_content_text" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                              <div style="color: #000000; line-height: 140%; text-align: left; word-wrap: break-word;">
                                                <p style="text-align: center; font-size: 14px; line-height: 140%;">$0.00</p>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table id="u_content_button_1" class="u_content_button" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                          <tr>
                                            <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                              <div align="center">
                                                <!--[if mso]>
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:arial,helvetica,sans-serif;">
                                                  <tr>
                                                    <td style="font-family:arial,helvetica,sans-serif;" align="center">
                                                      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:36px; v-text-anchor:middle; width:100px;" arcsize="11%" stroke="f" fillcolor="#3AAEE0">
                                                        <w:anchorlock/>
                                                        <center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;">
                                                          <![endif]-->
                                                          <a href="" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                                                          <span style="display:block;padding:10px 20px;line-height:120%;"><strong><span style="font-size: 14px; line-height: 16.8px;">Buy Now</span></strong>
                                                          </span>
                                                          </a>
                                                          <!--[if mso]>
                                                        </center>
                                                      </v:roundrect>
                                                    </td>
                                                  </tr>
                                                </table>
                                                <![endif]-->
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <!--[if (!mso)&(!IE)]><!-->
                                    </div>
                                    <!--<![endif]-->
                                  </div>
                                </div>
                                <!--[if (mso)|(IE)]>
                              </td>
                              <![endif]-->
                              <!--[if (mso)|(IE)]>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <![endif]-->
                  </div>
                </div>
              </div>
              <!--[if (mso)|(IE)]>
            </td>
          </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </tbody>
</table>
<!--[if (mso)|(IE)]></div><![endif]-->
    `
}

function generateId() {
    var length = 5;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}