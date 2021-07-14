# laravel-graphiql
GraphiQL for Laravel GraphQL Applications

### Installation
```bash
composer require malico/laravel-graphiql
```
Publish assets with
```bash
php artisan vendor:publish --tag=graphiql-assets --force
```
There's a configuration file which is optional which you can publish with. It has little customization like uri to use, graphql endpoint url, domains. Also allows you to decide if you want to enable graphiql in production. 
```
php artisan vendor:publish --tag=graphiql-config
```
### Usage

Visit `/graphiql` to access explore your schema. 

#### Author
Malico (Ndifon Desmond Yong)

[hi@malico.me](hi@malico.me)
