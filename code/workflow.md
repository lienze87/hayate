# workflow

### 安装choco

[choco](https://community.chocolatey.org/packages)是window包管理工具,打开cmd.exe，执行命令

```shell
  @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

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
