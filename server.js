const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./news.proto";
var protoLoader = require("@grpc/proto-loader");
const { startServer } = require('grpcwebproxy');
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const newsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let news = [
  { id: "1", title: "Note 1", body: "Content 1", postImage: "Post image 1" },
  { id: "2", title: "Note 2", body: "Content 2", postImage: "Post image 2" },
];

server.addService(newsProto.NewsService.service, {
    getAllNews: (_, callback) => {
      const newsList = { news: news };
      callback(null, newsList);
    },
  });
  

  const proxyServer = startServer({
    serviceName: 'NewsService',
    protoPath: PROTO_PATH,
    addr: '0.0.0.0:9090', // Change the address to your desired proxy address
    grpcServer: server,
  });
  
  proxyServer.start();
  console.log('gRPC Proxy Server running at http://0.0.0.0:9090');