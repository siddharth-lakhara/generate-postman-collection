const { Collection, Item, Header } = require('postman-collection');
const fs = require('fs');

// This is the our postman collection
const postmanCollection = new Collection({
  info: {
    // Name of the collection
    name: 'Sample Postman collection'
  },
  // Requests in this collection
  item: [],
});

// This string will be parsed to create header
const rawHeaderString =
  'Authorization:\nContent-Type:application/json\ncache-control:no-cache\n';

// Parsing string to postman compatible format
const rawHeaders = Header.parse(rawHeaderString);

// Generate headers
const requestHeader = rawHeaders.map((h) => new Header(h));

// API endpoint
const apiEndpoint = 'https://httpbin.org/post';

// Name of the request
const requestName = 'Sample request name';

// Request body
const requestPayload = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
};

// Add tests for request
const requestTests = `
pm.test('Sample test: Test for successful response', function() {
  pm.expect(pm.response.code).to.equal(200);
});
`

// Create the final request
const postmanRequest = new Item({
  name: `${requestName}`,
  request: {
    header: requestHeader,
    url: apiEndpoint,
    method: 'POST',
    body: {
      mode: 'raw',
      raw: JSON.stringify(requestPayload),
    },
    auth: null,
  },
  event: [
    {
      listen: 'test',
      script: {
        type: 'text/javascript',
        exec: requestTests,
      },
    },
  ],
});

// Add the reqest to our empty collection
postmanCollection.items.add(postmanRequest);

// Convert the collection to JSON 
// so that it can be exported to a file
const collectionJSON = postmanCollection.toJSON();

// Create a colleciton.json file. It can be imported to postman
fs.writeFile('./collection.json', JSON.stringify(collectionJSON), (err) => {
  if (err) { console.log(err); }
  console.log('File saved');
});