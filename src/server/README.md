
# Server

Utility functions for managing a simple server interface. Designed to work with [Express](https://expressjs.com)

The convention for server responses is:

### Success

```json
{ ok: true, data: object }
```

### Error

```json
{ ok: false, data: object, error: string }
```
