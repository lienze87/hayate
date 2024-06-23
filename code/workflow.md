# workflow

### 升级pnpm

```shell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 获取__dirname

```js
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```
