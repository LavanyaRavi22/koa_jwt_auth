const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const Logger = require('koa-logger');
const jwt = require("./jwt");

const app = new Koa();
const router = new Router();
const securedRouter = new Router();
var token;

require('./mongo')(app);

const ObjectID = require("mongodb").ObjectID;

securedRouter.use(jwt.errorHandler()).use(jwt.jwt());
app.use(BodyParser());
app.use(Logger());

var authHeader = require('koa-auth-header')({
  required: true, // if the authorization are required, will throw a 401 if the header is not present,
  types: {
    // if the authorization header is Authorization: Bearer: sometoken
    Bearer: function(value) {
      this.request.token = token;
    }
  }
});
 
securedRouter.use(authHeader);

router.get("/", async function (ctx) {
    let name = ctx.request.body.name || 'World';
    ctx.body = {message: `Hello ${name}!`}
});

securedRouter.get("/people",async function(ctx) {
	ctx.body = await ctx.app.people.find().toArray();
});

securedRouter.post("/people", async (ctx) => {
    ctx.body = await ctx.app.people.insert(ctx.request.body);
});

router.get("/people/:id",async (ctx) => {
   ctx.body = await ctx.app.people.findOne({"_id": ObjectID(ctx.params.id)});
});

securedRouter.put("/people/:id", async (ctx) => {
    let documentQuery = {"_id": ObjectID(ctx.params.id)}; // Used to find the document
    let valuesToUpdate = ctx.request.body;
    ctx.body = await ctx.app.people.updateOne(documentQuery, valuesToUpdate);
});

securedRouter.delete("/people/:id", async (ctx) => {
    let documentQuery = {"_id": ObjectID(ctx.params.id)}; // Used to find the document
    ctx.body = await ctx.app.people.deleteOne(documentQuery);
});

router.post("/auth", async (ctx) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

// hardcode values for now
    if (username === "user" && password === "pwd") {
	var tok = jwt.issue({user: "user", role: "admin"});
        token = tok;
        ctx.body = {
            token: tok
  	}
    } else {
        ctx.status = 401;
        ctx.body = {error: "Invalid login"}
    }
});

app.use(router.routes()).use(router.allowedMethods());
app.use(securedRouter.routes()).use(router.allowedMethods());

app.listen(3000);
