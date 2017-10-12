
# DB

A set of clients for different databases to be extended with app-specific methods

For example:

_Your db.js file_

```javascript
import postgres from 'postgres'

export default {
    connect(...args) {
        return postgres.connect(...args)
    },

    getUsers() {
        return postgres.select('users')
    }
}
```
