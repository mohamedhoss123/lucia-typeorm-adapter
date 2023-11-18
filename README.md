# @lucia-auth/adapter-typeorm

[typeorm](https://typeorm.io/) adapter for lucia

## Installation

```
npm i lucia-adapter-typeorm
```

## usage 

the typeorm adapter need you to pass the datasourse and the entity of (user,session,key)
```js
import { AppDataSource } from "../models/datasourse.js";
import { user } from "../models/user.entity.js";
import { key } from "../models/key.entity.js";
import { session } from "../models/session.entity.js";

export const auth = lucia({
    adapter: typeorm(AppDataSource, {
        user,
        key,
        session
    })
    // ...
});
```

for schema example go [here](./examples/schema)
