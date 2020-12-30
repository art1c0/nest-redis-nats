# nest-redis-nats
Nest Redis NATS Microservice


Требуется создать сервис, который будет содержать API отображения операций клиента по работе с кредитной картой.
Сервис должен быть написан на Node.js , в основе Nest.js FW, который будет интегрироваться с messaging system ( https://nats.io/ ).

Все ивенты будут поступать в NATS server и посредством Node.js сервиса поглощаться, а далее укладываться в Redis группированными по пользователям. 

Сервис должен быть написан таким образом, чтобы при горизонтальном скалировании, consuming не производил дубликаты. Сервисы Redis + NATS  поднять через docker-compose

Пример ивент DTO:

```
{
	userId: Number
	eventType: Enum {}
	createdAt: Date
	currency: String
	amount: Number
}
```


#### RUN the app in development mode

```
docker-compose up
```

After adding new npm modules please run this to update the anonymous volume

```
docker-compose up --build -V
```

Send a mock event

```
GET http://localhost:3000/send/<userId>[?amount=<amount>]
```

Read events for a user

```
GET http://localhost:3000/events/<userId>[?skip=<skip>]
```

Service is listening for messages from NATS with plain string pattern "event" - this parameter `eventPattern` can be changed in app.controller.

#### RUN the app in production mode

Run two separate docker-compose files (NATS & Redis and the Main):

```
docker-compose -f docker-nats-redis.yml up
docker-compose -f docker-main.yml up
```
