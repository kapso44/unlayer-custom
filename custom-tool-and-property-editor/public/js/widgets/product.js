$(document).ready(function () {
  let productApiUrl = localStorage.getItem('productApi');
  var productFeedApi = `http://127.0.0.1:8001/api/v1/product/all`;
  let tenantId = 54;
  let token = localStorage.getItem('authorization');
  var uniqueId = '';
  let lastPage = 0;   
  let currentPage = 1;

  function getProducts(page, query = '') {
    let limit = 5;
    $('#product-name-' + uniqueId).keyup(function (value) {
      $(".card-title-" + uniqueId).text($(this).val())
    });
    $.ajaxSetup({ cache: false });
    if (page === 1 || (query !== '' && page === 1)) $('#result-' + uniqueId).html('');
    return $.ajax({
      url: productFeedApi + '?page=' + page + '&limit=' + limit + '&query=' + query,
      dataType: "json",
      method: "POST",
      headers: {
        "authorization": token,
        "store-id": tenantId
      },
      beforeSend: function () {
        $('#loader-icon').show();
      },
      complete: function () {
        $('#loader-icon').hide();
      },
      success: function (data) {
        $('#loader-icon').hide();
        lastPage = data.last_page;
        if (data.products.length > 0) {
          let i = 1;
          let list = ''
          $.each(data.products, function (key, value) {
            // if (value.title.search(expression) != -1 || pid.search(searchField) != -1 || value.sku.search(searchField) != -1) {
            const { variants, title, platform_product_id } = value;
            let imageSrc = variants[0].image ? variants[0].image['src']['medium'] : 'https://unroll-images-production.s3.amazonaws.com/projects/4251/1589964645932-200.png';
            const actual_price = variants[0].price ? variants[0].price : undefined;
            const compare_price = variants[0].display_price ? variants[0].display_price : undefined;
            const currency_code = variants[0].currency_code ? variants[0].currency_code : "USD"
            list = list +
              `<li class="link-class list-group-item d-flex justify-content-between align-items-center">
                  <div class="image-parent image-src col-4" data-image="${imageSrc}">
                    <img src="${imageSrc}" class="img-thumbnail"/>
                  </div>
                  <div class="details col-8">
                    <span class="name" data-name="${title}"><b>Product name: </b>${title}</span><br>
                    <span class="id grey-text" data-id="${platform_product_id}"><b>Item Id:</b> ${platform_product_id}</span><br>
                    <span class="id grey-text" data-id="${variants[0].sku}"><b>Sku:</b> ${variants[0].sku}</span><br>
                    <span class="url hide-details" data-url=""></span>
                    <span class="actual-price" data-actual-price="${actual_price !== undefined ? currency_code + " " + actual_price : "unassigned"}">
                      <b>Price:</b> ${currency_code + " " + actual_price}
                    </span>
                    <span class="compare-price grey-text hide-details" data-compare-price="${compare_price !== undefined ? currency_code + " " + compare_price : "unassigned"}">
                      ${currency_code + " " + compare_price}
                    </span>
                  </div>
                </li>`;
            // }
          });
          $('#result-' + uniqueId).append(list);
        } else {
          $('#loader-icon').hide();
          $('#result-' + uniqueId).html(`
            <div class="no-product">
              <div class="text">
                <p>
                  No products found
                </p>
              </div>
              <div class="image">
                <img src="http://targetbay-dev-alb-855413330.us-west-2.elb.amazonaws.com/images/empty-results.svg" role="presentation" alt="" class="Polaris-EmptyState__Image">
              </div>
            </div>
          `)
        }
      },
      error: function () { }
    });
  }

  unlayer.registerPropertyEditor({
    name: 'add_products',
    layout: 'bottom',
    Widget: unlayer.createWidget({
      render(value) {
        uniqueId = generateId();
        return `
              <div id="product-search" class="container col-12">
                <div class="row">
                  <div class="col-sm-7 col-7">
                    <h6 style='margin-top: 10px;'>Add product from store</h6>
                  </div>
                  <div class="col-sm-5 col-5" style="float:right">
                    <button type='button' id="add-product" class='btn btn-primary'>Add Product</button>
                  </div>
                </div>
              </div>
              <div class="product-modal">
              <div id="dialog" title="Add product" class="dialog-search container" 
                style='overflow-x: hidden;'>
                <div class="row sticky">
                  <div class="col-8 form-group has-search">
                    <label> Search product </label>
                    <span class="fa fa-search form-control-feedback"></span>
                    <input type="text" name="search" id="search-${uniqueId}" 
                    placeholder=" Search by name, Id or sku" class="form-control" />
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
                <div id="loader-icon"><img src="https://i.gifer.com/ZZ5H.gif" /><div>
              </div>
              </div>
            `
      },
      mount(node, value, updateValue) {
        $(document).ready(function () {
          let query = '';
          let page = 2;
          getProducts(currentPage, query);
          $('#search-' + uniqueId).keyup(function () {
            event.preventDefault();
            query = $('#search-' + uniqueId).val();
            if (query !== '') {
              page = 2;
              getProducts(currentPage, query) 
            } else {
              page = 2;
            }
          });
          $("#dialog").scroll(function () {
            if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight && page <= lastPage) {
              getProducts(page, query);
              page += 1;
            }
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
            height: 650,
            width: 800,
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
            // $("#dialog").dialog("option", "width", 600);
            // $("#dialog").dialog("option", "left", 470);
            dialog.dialog("open");
            $(".ui-dialog-titlebar-close").html('<span aria-hidden="true">×</span><span class="sr-only">Close</span>');
            $(".ui-dialog-titlebar-close").addClass("close").removeClass("ui-dialog-titlebar-close");
            $(".ui-dialog").addClass("modal-content");
            $(".ui-dialog-titlebar").addClass("modal-header").removeClass("ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle");
            $(".ui-dialog-title").addClass("modal-title h4").removeClass("ui-dialog-title");
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
      newValues.image.autoWidth = value.autoWidth === undefined ? true : value.autoWidth
      newValues.image.maxWidth = value.maxWidth === undefined ? "100%" : value.maxWidth
      newValues.name = data.name ? data.name : values.name
      newValues.image.url = data.image ? data.image : values.image.url
      newValues.url = data.url ? data.url : values.url
      newValues.actual_price = data.actual_price ? (data.actual_price === "unassigned" ? "" : data.actual_price) : values.actual_price
      newValues.compare_price = data.compare_price ? (data.compare_price === "unassigned" ? "" : data.compare_price) : values.compare_price
      newValues.id = data.id

      return Object.assign(values, newValues);
    },
    options: {
      default: {
        title: "Product",
        options: {
          "width": {
            "label": "Width",
            "defaultValue": 100,
            "widget": "counter"
          },
          "align": {
            "label": "Align",
            "defaultValue": 'center',
            "widget": "alignment"
          },
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
            "defaultValue": "Product Title",
            "widget": "text",
          },
          "actual_price": {
            "label": "Product Price",
            "defaultValue": "$0.00",
            "widget": "text"
          },
          "compare_price": {
            "label": "Compare At Price",
            "defaultValue": "$0.00",
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
            "defaultValue": '15',
            "widget": "counter"
          },
          "name_line_height": {
            "label": "Line Height",
            "defaultValue": '0',
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
            "defaultValue": '14',
            "widget": "counter"
          },
          "actual_top_pad": {
            "label": "Top Padding",
            "defaultValue": '5',
            "widget": "counter"
          },
          "actual_bottom_pad": {
            "label": "Bottom Padding",
            "defaultValue": '0',
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
            "defaultValue": '15',
            "widget": "counter"
          },
          "compare_top_pad": {
            "label": "Top Padding",
            "defaultValue": '0',
            "widget": "counter"
          },
          "compare_bottom_pad": {
            "label": "Bottom Padding",
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
              url: "https://img.mybaymail.com/assets/1598262173137-Group 7.png",
              autoWidth: true
            },
            "widget": "image"
          },
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
            "defaultValue": '#FFFFFF',
            "widget": "color_picker"
          },
          "button_font_size": {
            "label": "Font Size (in pixels)",
            "defaultValue": '14',
            "widget": "counter"
          },
          "button_align": {
            "label": "Align",
            "defaultValue": 'center',
            "widget": "alignment"
          },
          "button_color": {
            "label": "Button Color",
            "defaultValue": '#3AAEE0',
            "widget": "color_picker"
          },
          "button_radius": {
            "label": "Button Radius",
            "defaultValue": '3',
            "widget": "counter"
          },
        }
      },
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
    let {
      image,
      width,
      align,
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
      actual_top_pad,
      actual_bottom_pad,
      actual_font_size,
      compare_font,
      compare_price,
      compare_color,
      compare_align,
      compare_top_pad,
      compare_bottom_pad,
      compare_font_size,
      url,
      button,
      button_font,
      button_align,
      button_color,
      button_text_color,
      button_font_size,
      button_radius,
    } = values

    if (image.maxWidth === undefined) {
      image.maxWidth = '100%'
    }

    return `
      <!--[if IE]>
      <div class="ie-container">
      <![endif]-->
      <!--[if mso]>
      <div class="mso-container">
      <![endif]-->
        <table class="grid-item-card" style="box-sizing: border-box; word-break: break-all; width:${width}%;" 
          width="${width}%" align="${align}">
          <tbody style="box-sizing: border-box;">
            <tr style="box-sizing: border-box; text-algin: ${align}" >
              <td class="grid-item-card-cell" style="box-sizing: border-box; overflow-x: hidden; overflow-y: hidden; 
              background-color:${background_toggle ? background_color : ""}" align="${align}">
              <!--[if (mso)|(IE)]>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color: #e7e7e7;">
                    <![endif]-->
                    <div class="email-row-container" style="padding: 0px;background-color: transparent">
                      <div style="Margin: 0 auto;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
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
                                      <div class="email-col-100" style="display: table-cell;vertical-align: top;">
                                        <div style="width: 100% !important;">
                                          <!--[if (!mso)&(!IE)]><!-->
                                          <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                            <!--<![endif]-->
                                            <table id="u_content_image_1" class="u_content_image" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                              <tbody>
                                                <tr>
                                                  <td style="overflow-wrap:break-word;word-break:break-word;font-family:arial,helvetica,sans-serif;">
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                      <tr>
                                                        <td class="product-img" style="padding: 10px;" align="center">
                                                          <img src=" ${image.url}" alt="${name}" style="box-sizing: border-box;
                                                            margin-bottom: 20px; width:auto; max-width: ${image.maxWidth}; height:auto">
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
                                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family: ${name_font?.value}">
                                                    <div style="color: ${name_color}; line-height: ${name_line_height}px; text-align: ${name_align}; word-wrap: break-word;">
                                                      <p style="font-size: ${name_font_size}px; line-height: ${name_line_height}px; text-align: ${name_align};">
                                                        <span style="font-size: ${name_font_size}px; line-height: ${name_line_height}px;">
                                                        <strong>
                                                        <span class="card-title-${uniqueId}" 
                                                          style="line-height: ${name_line_height}px; font-size: ${name_font_size}px;
                                                          color: ${name_color}; text-align: ${name_align}; font-family: ${name_font?.value}
                                                          ">
                                                        ${name}
                                                        </span>
                                                        </strong>
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
                                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:${actual_top_pad}px 10px ${actual_bottom_pad}px;font-family: ${actual_font?.value};">
                                                    <div style="color: ${compare_price === '' ? '#000000' : actual_color}; line-height: line-height: 140%; text-align: ${actual_align}; word-wrap: break-word;">
                                                      <p style="text-align: ${actual_align}; font-size: ${actual_font_size}px; line-height: 140%;">
                                                        <span style="font-size: ${actual_font_size}px; line-height: 19.6px;">
                                                          ${compare_price === '' ? actual_price : `<strike>${actual_price}</strike>`}
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
                                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:${compare_top_pad}px 10px ${compare_bottom_pad}px;font-family: ${compare_font?.value};">
                                                    <div style="color: ${compare_color}; line-height: line-height: 140%; text-align: ${compare_align}; word-wrap: break-word;">
                                                      <p style="text-align: ${compare_align}; font-size: ${compare_font_size}px; line-height: 140%;">
                                                        <span style="font-size: ${compare_font_size}px; line-height: 19.6px;">
                                                          ${compare_price}
                                                        </span>
                                                      </p>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <table id="u_content_button_1" class="u_content_button" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                              <tbody>
                                                <tr>
                                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;">
                                                    <div align="${button_align}">
                                                      <!--[if mso]>
                                                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:arial,helvetica,sans-serif;">
                                                        <tr>
                                                          <td style="font-family:${button_font?.value};" align="center">
                                                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:36px; v-text-anchor:middle; width:100px;" arcsize="11%" stroke="f" fillcolor="#3AAEE0">
                                                              <w:anchorlock/>
                                                              <center style="color:${button_text_color};font-family:arial,helvetica,sans-serif;">
                                                                <![endif]-->
                                                                <a href=${url} target="_blank" style="box-sizing: border-box;display: inline-block; font-size: ${button_font_size}px; font-family:${button_font?.value};
                                                                  text-decoration: none;-webkit-text-size-adjust: none;text-align: ${button_align};color: ${button_text_color}; background-color: ${button_color}; 
                                                                  border-radius: ${button_radius}px; -webkit-border-radius: ${button_radius}px; -moz-border-radius: ${button_radius}px; 
                                                                  width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
                                                                <span style="display:block;padding:10px 20px;line-height:120%;">
                                                                <strong>
                                                                <span style="font-size: ${button_font_size}px;">
                                                                ${button}
                                                                </span>
                                                                </strong>
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
      <!--[if (mso)|(IE)]>
      </div>
      <![endif]-->
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
})