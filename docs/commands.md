# Command Reference for hsnode-cli

TODO: Add your command reference here

## To generate ExpressJS Rest Api

### Generate models

```shell
$ hsnode-cli generate model user
```

Output

```shell
Generated model file at models/User.js
```

### Generate router and controller

```shell
$ hsnode-cli generate router user
```

Output

```shell
Generated router file at routes/user.js
Generated controller file at controllers/userController.js
```

### Generate schema

```shell
$ hsnode-cli generate schema user
```

Output

```shell
Generated schema file at src/schema/User.js
Updated file src/schema/index.js
```

### Generate resolver

```shell
$ hsnode-cli generate resolver user
```

Output

```shell
Generated resolver file at src/resolver/User.js
Updated file src/resolver/index.js
```