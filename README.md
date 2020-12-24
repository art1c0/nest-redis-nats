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