# 自签名证书

- openssl ecparam -out server.key -name prime256v1 -genkey
- openssl req -new -sha256 -key server.key -out server.csr
- openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt -days 365
