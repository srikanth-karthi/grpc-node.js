const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./news.proto";
var protoLoader = require("@grpc/proto-loader");

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
      // console.log('eriufg')
      callback(null, newsList);
    },
    addNews: (call, callback) => {
      // console.log(call)
      const _news = { id: Date.now(), ...call.request };
      news.push(_news);
      callback(null, _news);
    },
    // deletenews:(call,callback)=>
    // {
    //   const valueToRemove = call.request.id
    //   let newArray = news.filter(element => element.id !== valueToRemove);
    //   news=newArray;
    //   callback(null,news);
    // },
    deletenews: (call, callback) => {
      const valueToRemove = call.request.id;
      const indexToRemove = news.findIndex(element => element.id === valueToRemove);
    
      if (indexToRemove !== -1) {
        const removedNews = news.splice(indexToRemove, 1)[0];
        callback(null, removedNews); // Return the deleted News item
      } else {
        callback({
          // code: grpc.status.NOT_FOUND,
          details: 'News not found',
        });
      }
    }
    
  });
  

  server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log("Server running at http://127.0.0.1:50051");
      server.start();
    }
  );