# kysely-planetscale

[![CI](https://github.com/depot/kysely-planetscale/actions/workflows/ci.yml/badge.svg)](https://github.com/depot/kysely-planetscale/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/kysely-planetscale.svg)](https://www.npmjs.com/package/kysely-planetscale)
![Powered by TypeScript](https://img.shields.io/badge/powered%20by-typescript-blue.svg)

A [Kysely](https://github.com/koskimas/kysely) dialect for [PlanetScale](https://planetscale.com/), using the [PlanetScale serverless driver for JavaScript](https://planetscale.com/blog/introducing-the-planetscale-serverless-driver-for-javascript).

## Installation

You should install both `kysely` and `@planetscale/database` with `kysely-planetscale`, as they are both required peer dependencies. You can install them with your favorite package manager:

```bash
# with pnpm
pnpm add kysely-planetscale kysely @planetscale/database

# with yarn
yarn add kysely-planetscale kysely @planetscale/database

# with npm
npm install kysely-planetscale kysely @planetscale/database
```

## Usage

You can pass a new instance of `PlanetScaleDialect` as the `dialect` option when creating a new `Kysely` instance:

```typescript
import {Kysely} from 'kysely'
import {PlanetScaleDialect} from 'keysely-planetscale'

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    host: '<host>',
    username: '<user>',
    password: '<password>',
  }),
})
```

`PlanetScaleDialect` accepts the same options as `connect({...})` from `@planetscale/database`, so for instance if you are using Node.js and need to provide a `fetch` implementation:

```typescript
import {Kysely} from 'kysely'
import {PlanetScaleDialect} from 'keysely-planetscale'
import {fetch} from 'undici'

// Connect using a DATABASE_URL, provide a fetch implementation
const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
    fetch,
  }),
})
```

### Type Conversion

`PlanetScaleDialect` provides built-in support for converting JavaScript Dates to and from `DATETIME` and `TIMESTAMP` columns, as Kysely's generated types expect. However, you can override or extend this behavior by providing a custom `format` or `cast` function to override the defaults.

#### Custom `format` function

`PlanetScaleDialect` passes all parameters to `@planetscale/database` unmodified, expect for JavaScript Dates, which are converted to MySQL strings. If you [set a `format` function](https://github.com/planetscale/database-js#custom-query-parameter-format-function), you can override this behavior:

```typescript
import {Kysely} from 'kysely'
import {PlanetScaleDialect} from 'keysely-planetscale'
import SqlString from 'sqlstring'

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
    format: SqlString.format,
  }),
})
```

#### Custom `cast` function

`PlanetScaleDialect` automatically type-casts `DATETIME` and `TIMESTAMP` to JavaScript Dates. If you'd prefer to customize this behavior, you can [pass a custom `cast` function](https://github.com/planetscale/database-js#custom-type-casting-function):

```typescript
import {cast} from '@planetscale/database'
import {Kysely} from 'kysely'
import {PlanetScaleDialect} from 'keysely-planetscale'
import SqlString from 'sqlstring'

const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
    cast: inflate,
  }),
})

function inflate(field, value) {
  if (field.type === 'INT64' || field.type === 'UINT64') {
    return BigInt(value)
  }
  return cast(field, value)
}
```

## License

MIT License, see `LICENSE`.
