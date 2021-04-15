GET Product API: This is the API to be exposed in the Product micro - service.The service will
return a list of porducts that are applicable to a given user.This API will act as downstream API to UserCart Microservice.

API Request

HTTP Method: GET Request URI: /rest/v1 / products

Query Parameters: NA

API Response[{
  "productId": "12445dsd234",
  "category": "Modile",
  "productName": "Samsung",
  "productModel": "GalaxyNote",
  "price": 700 "availableQuantity": 10
}, {
  "productId": "123245ds4234",
  "category": "TV",
  "productName": "Sony",
  "productModel": "Bravia",
  "price": 1200 "availableQuantity": 6
}]

HTTP Method: PUT Request URI: /rest/v1 / users //cart

Body Parameter {
  "productId": "12445dsd234",
  "quantity": 2,
}

Example Request: PUT / rest / v1 / users / qa - test - user / cart

Example Response: Request path variables are highlighted in RED below. {
  "productId": "12445dsd234",
  "productName": "Samsung",
  "quantity": 2 "amount": 1400,
}

HTTP Method: GET Request URI: /rest/v1 / users //cart

Example Request: GET / rest / v1 / users / qa - test - user / cart

Example Response: Request path variables are highlighted in RED below. {
  "uuid": "qa-test-user",
  "cart": [{
    "productId": "12445dsd234",
    "productName": "Samsung",
    "quantity": 2 "amount": 1400,
  }]
}