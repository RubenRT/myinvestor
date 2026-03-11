# API

## ⚙️ Setup

Ejecutar `yarn start` o `npm run start`.

## 📖 Endpoints

### Listado de fondos

```
curl --request GET \
  --url http://localhost:3000/funds
```

```
curl --request GET \
  --url http://localhost:3000/funds?page=1&limit=20
```

### Detalle de fondo

```
curl --request GET \
  --url http://localhost:3000/funds/1
```

### Compra de fondo

```
curl --request POST \
  --url http://localhost:3000/funds/1/buy \
  --header 'Content-Type: application/json' \
  --data '{
	"quantity": 10
}'
```

### Venta de fondo

```
curl --request POST \
  --url http://localhost:3000/funds/1/sell \
  --header 'Content-Type: application/json' \
  --data '{
	"quantity": 10
}'
```

### Traspasar fondo

```
curl --request POST \
  --url http://localhost:3000/funds/transfer \
  --header 'Content-Type: application/json' \
  --data '{
	"fromFundId": "1",
	"toFundId": "2",
	"quantity": 5
}'
```

### Detalle de una cartera

```
curl --request GET \
  --url http://localhost:3000/portfolio
```