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
                <div class="col-sm-6 col-6">
                  <h6 style='margin-top: 10px;'>Add product from store</h6>
                </div>
                <div class="col-sm-6 col-6">
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
          $("#dialog").dialog( "option", "width", 600 );
          $("#dialog").dialog( "option", "left", 470 );
          $(".blockbuilder-layer.blockbuilder-layer-selected > .blockbuilder-layer-selector .blockbuilder-layer-drag").css('display', 'none')
          $(".blockbuilder-layer.blockbuilder-layer-selected > .blockbuilder-layer-selector .blockbuilder-layer-controls").css('display', 'none')
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
    newValues.img_width = data.id
    
    return Object.assign(values, newValues);
  },
  options: {
    default: {
      title: null,
    },
    product: {
      title: "Product",
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
          "class": "product-name"
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
        "image": {
          "label": "Product Image",
          "defaultValue": {
            url: "http://placehold.it/250x150/78c5d6/fff/"
          },
          "widget": "image"
        },
        "url": {
          "label": "Product Url",
          "defaultValue": {
            url: "http://google.com",
            target: "_blank"
          },
          "widget": "link"
        },
        "button": {
          "label": "Button Name",
          "defaultValue": "Buy Now",
          "widget": "text"
        }
      },
    },
    product_attributes: {
      title: "Product Attributes",
      position: 2,
      options: {
        "img_width": {
          "label": "Image Width",
          "defaultValue": 50,
          "widget": "counter"
        },
        "img_height": {
          "label": "Image Height",
          "defaultValue": 150,
          "widget": "counter"
        }
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
  let { image, name, img_height, img_width, url, actual_price, compare_price, button } = values
  return `
      <table class="grid-item-card" style="box-sizing: border-box; word-break: break-all; width: 100%; padding-top: 5px; padding-right: 0px; padding-bottom: 5px; padding-left: 0px; margin-bottom: 10px;" width="100%">
      <tbody style="box-sizing: border-box;">
          <tr style="box-sizing: border-box; text-algin: center" >
          <td class="grid-item-card-cell" style="box-sizing: border-box; overflow-x: hidden; overflow-y: hidden; 
            border-top-left-radius:3px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; 
            border-bottom-left-radius: 3px; text-align: center; padding-top: 0px; 
            padding-right: 0px; padding-bottom: 0px; padding-left: 0px;"  align="center">
              <img src=" ${image.url}" alt="image" style="box-sizing: border-box; 
              line-height: 150px; font-size: 50px; color: rgb(120, 197, 214); margin-bottom: 15px; width: 100%;" 
              width=${img_width} height=${img_height}>
              <table class="grid-item-card-body" style="box-sizing: border-box; width:100%">
              <tbody style="box-sizing: border-box;">
                  <tr style="box-sizing: border-box;">
                  <td class="grid-item-card-content" 
                    style="box-sizing: border-box; font-size: 13px; color: rgb(111, 119, 125); 
                      padding-top: 0px; padding-right: 10px; padding-bottom: 20px; padding-left: 10px; 
                      width: 100%; line-height: 20px; text-align:center" width="100%">
                      <h1 class="card-title-${uniqueId}" style="box-sizing: border-box; font-size: 25px; font-weight: 300; color: rgb(68, 68, 68); text-align: center">
                          ${name}
                      </h1>
                      <p class="card-text" 
                        style="padding: 10px; box-sizing: border-box; font-size: 20px; font-weight: 300; color: rgb(68, 68, 68); text-align: center">
                        <strike>${actual_price}</strike>
                      </p>
                      <p class="card-text" 
                        style="padding: 10px; box-sizing: border-box; font-size: 20px; font-weight: 300; color: rgb(68, 68, 68); text-align: center">
                        ${compare_price}
                      </p>
                      <br>
                      <p>
                      <a href=${url} style="border-radius: 4px; line-height: 120%; display: inline-block; text-decoration: none; padding: 10px 20px; background-color: rgb(58, 174, 224); color: rgb(255, 255, 255);">
                        ${button}
                      </a>
                      </p>
                  </td>
                  </tr>
              </tbody>
              </table>
          </td>
          </tr>
      </tbody>
      </table>
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