declare module "restify" {
  interface Next {
    ifError(err?: any): any;
  }
}
