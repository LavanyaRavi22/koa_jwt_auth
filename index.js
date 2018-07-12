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

app.use(securedRouter.routes()).use(securedRouter.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

router.use(function(ctx,next){
    console.log("ROUTER");
    console.log("-- -- -- -- -- --");
    console.log(ctx.status);
    next();
});

securedRouter.use(function(ctx,next){
    console.log("SECURED ROUTER");
    console.log("-- -- -- -- -- --");
    console.log(ctx.status);
    if(token)
        ctx.headers.authorization = `Bearer ${token}`;
    next();
});

//securedRouter.use(jwt.errorHandle()).use(jwt.jwt());
securedRouter.use(jwt.errorHandle()).use(jwt.jwt());
app.use(BodyParser());
app.use(Logger());

router.get("/", async function (ctx) {
    let name = 'World';
    console.log("get / -------------------------");
    console.log(ctx.status);
    ctx.body = {message: `Hello ${name}!`}
    console.log(ctx.status);
});

securedRouter.get("/people",async (ctx) => {
    console.log("In people -----------");
    console.log(ctx);
    console.log(ctx.body);
    ctx.body = await ctx.app.people.find().toArray();
    console.log(ctx.body);
    console.log(ctx.status);
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

router.get("/auth", async (ctx) => {
    let username = ctx.request.query.username;
    let password = ctx.request.query.password;
// hardcode values for now
    if (username === "user" && password === "pwd") {
     var tok = jwt.issue({user: "user", role: "admin"});
   // var tok = koajwt.sign(profile, 'secret', { expiresInMinutes: 60*5 })
        token = tok;
        ctx.body = {
            token: tok
  	    }
    } else {
        ctx.status = 401;
        ctx.body = {error: "Invalid login"}
    }
});


app.listen(3000);